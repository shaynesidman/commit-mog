from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

@app.route("/api/<username>", methods=["GET"])
def compare(username: str):
    """
    Get commits for user and their friends
    Parameters: username (string)
    Returns: JSON object of user and their friends' commits
    """
    if not GITHUB_TOKEN:
        return jsonify({ "error": "GitHub token is required for GitHub API" }), 500
    
    headers = { "Authorization": f"bearer {GITHUB_TOKEN}" }

    # Get a list of the user's friends
    friends = get_user_friends(username, headers)

    if "error" in friends:
        return jsonify(friends), 404

    # Get contributions for each friend
    friends_commits = []
    for friend in friends:
        result = get_user_commits(friend["login"], headers)
        if "error" in result:
            continue
        friends_commits.append(result)

    # Get contributions for user
    user_commits = get_user_commits(username, headers)

    return jsonify(friends_commits)


def get_user_friends(username: str, headers: dict):
    """
    Fetch a list of a user's friends on GitHub using their REST API.
    Parameters: username (string)
    Returns: List of user objects
    """

    GITHUB_FOLLOWING_URL = f"https://api.github.com/users/{username}/following"
    
    response = requests.get(GITHUB_FOLLOWING_URL, headers=headers)

    if response.status_code != 200:
        return { "error": "Failed to fetch user's friends" }

    friends = response.json()

    return friends


def get_user_commits(username: str, headers: dict):
    """
    Get commit counts for a user using GitHub's GraphQL API.
    Parameters: username (string), from (ISO date, optional), to (ISO date, optional)
    Returns: Commit count (int)
    """

    GITHUB_GRAPHQL_URL = "https://api.github.com/graphql"

    query = """
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          totalCommitContributions
          restrictedContributionsCount
        }
      }
    }
    """

    response = requests.post(
        GITHUB_GRAPHQL_URL,
        headers=headers,
        json={"query": query, "variables": {"username": username}},
    )

    if response.status_code != 200:
        return { "error": "GitHub API request failed" }

    data = response.json()

    if "errors" in data:
        return { "error": data["errors"][0]["message"] }

    user = data.get("data", {}).get("user")

    if not user:
        return { "error": "User not found" }

    contributions = user["contributionsCollection"]
    total_commits = contributions["totalCommitContributions"] + contributions["restrictedContributionsCount"]

    return { "username": username, "commits": total_commits }