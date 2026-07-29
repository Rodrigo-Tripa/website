const REPO_OWNER = "Rodrigo-Tripa";
const REPO_NAME = "Cyber-Notes";
const BRANCH = "master";

// GitHub Personal Access Token (leave empty for public access)
// To increase rate limit from 60 to 5000 requests/hour, add your token here
// Generate at: https://github.com/settings/tokens (needs 'public_repo' scope)
const GITHUB_TOKEN = "";

function getGitHubHeaders() {
    if (!GITHUB_TOKEN) {
        return {};
    }
    return {
        "Authorization": `token ${GITHUB_TOKEN}`,
        "Accept": "application/vnd.github.v3+json"
    };
}

async function fetchRepositoryTree() {

    const url =
        `https://api.rodrigotripa.dev/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/${BRANCH}?recursive=1`;

    const response = await fetch(url, { headers: getGitHubHeaders() });

    if (!response.ok) {
        throw new Error(`GitHub API returned ${response.status}`);
    }

    const data = await response.json();

    return buildTree(data.tree);
}

async function fetchMarkdown(path) {

    const url =
        `https://api.rodrigotripa.dev/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Unable to load ${path}`);
    }

    return await response.text();

}