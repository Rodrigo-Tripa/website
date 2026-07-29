async function init() {

    try {

        const tree = await fetchRepositoryTree();

        const elements = buildGraphElements(tree);
        console.log(elements.nodes);
        const network = createGraph(elements);

        initializeUI(network, tree);

    } catch (error) {

        console.error(error);

        document.getElementById("node-info").innerHTML = `
            <h3>Error</h3>
            <p>${error.message}</p>
        `;

    }

}

document.addEventListener("DOMContentLoaded", init);