const REPO_OWNER = "Rodrigo-Tripa";
const REPO_NAME = "Cyber-Notes";
const BRANCH = "master";

async function fetchRepositoryTree() {

    const url =
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/${BRANCH}?recursive=1`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`GitHub API returned ${response.status}`);
    }

    const data = await response.json();

    return buildTree(data.tree);

}