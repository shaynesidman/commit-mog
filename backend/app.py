from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
GITHUB_GRAPHQL_URL = "https://api.github.com/graphql"

@app.route("/api/users/<username>", methods=["GET"])
def get_user_commits(username: str):
    """
    Get commit counts for a user using GitHub's GraphQL API.
    Parameters: username (string), from (ISO date, optional), to (ISO date, optional)
    Returns: Commit count (int)
    """
    if not GITHUB_TOKEN:
        return jsonify({"error": "GitHub token is required for GraphQL API"}), 500

    headers = {"Authorization": f"bearer {GITHUB_TOKEN}"}

    date_from = request.args.get("from")
    date_to = request.args.get("to")

    # Build contributionsCollection arguments
    cc_args = ""
    if date_from or date_to:
        parts = []
        if date_from:
            parts.append(f'from: "{date_from}"')
        if date_to:
            parts.append(f'to: "{date_to}"')
        cc_args = f"({', '.join(parts)})"

    query = """
    query($username: String!) {
      user(login: $username) {
        contributionsCollection%s {
          totalCommitContributions
          restrictedContributionsCount
        }
      }
    }
    """ % cc_args

    response = requests.post(
        GITHUB_GRAPHQL_URL,
        headers=headers,
        json={"query": query, "variables": {"username": username}},
    )

    if response.status_code != 200:
        return jsonify({"error": "GitHub API request failed"}), 502

    data = response.json()

    if "errors" in data:
        return jsonify({"error": data["errors"][0]["message"]}), 404

    user = data.get("data", {}).get("user")
    if not user:
        return jsonify({"error": "User not found"}), 404

    contributions = user["contributionsCollection"]
    total_commits = (
        contributions["totalCommitContributions"]
        + contributions["restrictedContributionsCount"]
    )

    return jsonify({
        "username": username,
        "commits": total_commits,
    })