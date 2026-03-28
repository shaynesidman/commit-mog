from flask import Flask, jsonify, request
from flask_cors import CORS
from mangum import Mangum
from a2wsgi import WSGIMiddleware
import requests
import os
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app) # Maybe TODO: restrict origin domains to just frontend

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
FRIENDS_LIMIT = 50

def get_date_range(period: str):
    """
    Returns (from_date, to_date) ISO strings for a given period.
    Supported periods: 'week', 'month', 'year'
    """
    now = datetime.now(timezone.utc)
    if period == "week":
        from_date = now - timedelta(weeks=1)
    elif period == "month":
        from_date = now - timedelta(days=30)
    else:  # default is year
        from_date = now - timedelta(days=365)
    return from_date.isoformat(), now.isoformat()


@app.route("/api/<username>", methods=["GET"])
def compare(username: str):
    """
    Get commits for user and their friends
    Parameters: username (string), period (query param: 'week'|'month'|'year', default 'year')
    Returns: JSON object of user and their friends' commits
    """
    if not GITHUB_TOKEN:
        return jsonify({ "error": "GitHub token is required for GitHub API" }), 500

    headers = { "Authorization": f"bearer {GITHUB_TOKEN}" }

    period = request.args.get("period", "year")
    from_date, to_date = get_date_range(period)

    # Get GitHub user metadata 
    user = get_user_data(username, headers)
    if "error" in user:
        status = 404 if user.get("error_code") == "USER_NOT_FOUND" else 500
        return jsonify(user), status

    # Get contributions for user
    user_commits = get_user_commits(username, headers, from_date, to_date)
    if "error" in user_commits:
        status = 404 if user_commits.get("error_code") == "USER_NOT_FOUND" else 500
        return jsonify(user_commits), status

    user_commits["avatar_url"] = user.get("avatar_url")
    user_commits["profile_url"] = user.get("html_url")

    # Get a list of the user's friends
    friends = get_user_friends(username, headers)

    if "error" in friends:
        status = 404 if friends.get("error_code") in ("USER_NOT_FOUND", "NOT_FOLLOWING_ANYONE") else 500
        return jsonify(friends), status

    # Warn if the user follows more than the limit (list is already capped by per_page)
    total_following = user.get("following", 0)
    print(user.get("following", 0))
    warning = None
    if total_following > FRIENDS_LIMIT:
        warning = f"{username} follows {total_following} people, only comparing the first {FRIENDS_LIMIT}."

    # Get contributions for each friend
    friends_commits = []
    for friend in friends:
        result = get_user_commits(friend["login"], headers, from_date, to_date)
        if "error" in result:
            continue
        result["avatar_url"] = friend["avatar_url"]
        result["profile_url"] = friend["html_url"]
        friends_commits.append(result)

    response = { "user": user_commits, "friends": friends_commits }
    if warning:
        response["warning"] = warning
    return jsonify(response)


def get_user_friends(username: str, headers: dict):
    """
    Fetch a list of a user's friends on GitHub using their REST API.
    Parameters: username (string)
    Returns: List of user objects
    """
    GITHUB_FOLLOWING_URL = f"https://api.github.com/users/{username}/following"

    response = requests.get(GITHUB_FOLLOWING_URL, headers=headers, params={"per_page": FRIENDS_LIMIT})

    if response.status_code == 404:
        return { "error": "User not found", "error_code": "USER_NOT_FOUND" }

    if response.status_code != 200:
        return { "error": "Failed to fetch user's following list", "error_code": "API_ERROR" }

    friends = response.json()

    if len(friends) == 0:
        return { "error": f"{username} is not following anyone", "error_code": "NOT_FOLLOWING_ANYONE" }

    return friends


def get_user_data(username: str, headers: dict):
    """
    Fetch the user's data from GitHub
    Parameters: username (string)
    Returns: List of user objects
    """
    GITHUB_USER_URL = f"https://api.github.com/users/{username}"
    
    # Fetch users from REST API since better for bulk data of one type
    response = requests.get(GITHUB_USER_URL, headers=headers)

    if response.status_code == 404:
        return { "error": f"GitHub user {username} not found", "error_code": "USER_NOT_FOUND" }

    if response.status_code != 200:
        return { "error": "Failed to fetch user data", "error_code": "API_ERROR" }

    user = response.json()

    return user


def get_user_commits(username: str, headers: dict, from_date: str = None, to_date: str = None):
    """
    Get commit counts for a user using GitHub's GraphQL API.
    Parameters: username (string), from_date (ISO date, optional), to_date (ISO date, optional)
    Returns: Commit count (int)
    """
    GITHUB_GRAPHQL_URL = "https://api.github.com/graphql"

    query = """
    query($username: String!, $from: DateTime, $to: DateTime) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          totalCommitContributions
          restrictedContributionsCount
        }
      }
    }
    """

    # Fetch contributions from GraphQL API since structured
    response = requests.post(
        GITHUB_GRAPHQL_URL,
        headers=headers,
        json={"query": query, "variables": {"username": username, "from": from_date, "to": to_date}},
    )

    if response.status_code != 200:
        return { "error": "GitHub API request failed", "error_code": "API_ERROR" }

    data = response.json()

    if "errors" in data:
        return { "error": data["errors"][0]["message"], "error_code": "API_ERROR" }

    user = data.get("data", {}).get("user")

    if not user:
        return { "error": f"GitHub user '{username}' not found", "error_code": "USER_NOT_FOUND" }

    contributions = user["contributionsCollection"]
    total_commits = contributions["totalCommitContributions"] + contributions["restrictedContributionsCount"]

    return { "username": username, "commits": total_commits }


handler = Mangum(WSGIMiddleware(app), lifespan="off")