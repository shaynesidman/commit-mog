# commit-mog

My social media feeds have been flooded with the newest form of brainrot: looksmaxxers. Naturally, the corresponding lingo made its way into conversations with my friends — and eventually, onto GitHub. **Commit Mog** lets you compare your GitHub contribution stats with the people you follow to see who mogs who.

## What is "mogging"?

In looksmaxxer culture, to *mog* someone means to outshine them in some way. If you have more commits than your friend, you mog them. If they have more than you, they mog you. It's that simple — and that humbling.

## Features

- Look up any GitHub user and pull their commit stats
- Automatically fetches the people they follow on GitHub
- Compares commits across **week**, **month**, or **year** time windows
- Categorizes results into **Moggers** (they beat you), **Mogged** (you beat them), and **Equals** (tied)
- Includes private repo contributions
- Serves up context-aware, meme-flavored messages based on your results

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Python 3.13, Flask |
| GitHub API | REST API + GraphQL |
| Deployment | Vercel, AWS Lambda + API Gateway via AWS SAM |

## How It Works

1. Enter a GitHub username
2. The backend fetches the user's contribution count and their following list from GitHub
3. Commit counts are pulled via the GitHub GraphQL API for the selected time period
4. Results are sorted into three buckets and displayed in a carousel with humorous commentary

```
GitHub Username
    → Flask API → GitHub REST + GraphQL APIs
    → Categorize (moggers / mogged / equals)
    → Display with carousels + mog messages
```

## Running Locally

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in `/backend`:

```
GITHUB_TOKEN=your_github_personal_access_token
```

Then start the server:

```bash
flask run
```

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in `/frontend`:

```
VITE_BACKEND_URL=http://127.0.0.1:5000
```

Then start the dev server:

```bash
npm run dev
```

## Deployment

The backend is deployed serverlessly via [AWS SAM](https://aws.amazon.com/serverless/sam/). The GitHub token is pulled from AWS Secrets Manager at `/commit-mog/github-token`.

```bash
cd backend
sam build
sam deploy
```

## GitHub Token Scopes

The token needs `read:user` to access following lists and contribution data. Private repo contributions require the token to belong to the user being looked up (or a user with access).
