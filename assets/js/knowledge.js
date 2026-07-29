let cy;

async function init() {

    try {

        const tree = await fetchRepositoryTree();

        const elements = buildGraphElements(tree);

        console.log(tree);
        console.log(elements);
        console.log(elements.nodes);

        console.log("Nodes:", elements.nodes.length);
        console.log("Edges:", elements.edges.length);

        console.log("Primeiro nó:", elements.nodes[0]);
        console.log("Primeira edge:", elements.edges[0]);

        window.elements = elements;

        cy = createGraph(elements);

        initializeUI(cy, tree);

    } catch (error) {

        console.error(error);

        document.getElementById("node-info").innerHTML = `
            <h3>Error</h3>
            <p>${error.message}</p>
        `;
    }

}


document.addEventListener("DOMContentLoaded", init);