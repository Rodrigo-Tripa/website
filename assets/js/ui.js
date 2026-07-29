const info = document.getElementById("node-info");

function initializeUI(cy) {

    // Clique

    cy.on("tap", "node", (event) => {

        const node = event.target;

        cy.elements().removeClass("highlight");
        node.addClass("hover");

        node.connectedEdges().addClass("highlight");
        node.neighborhood("node").addClass("hover");

        info.innerHTML = `
            <h3>${node.data("label")}</h3>

            <p><strong>ID:</strong> ${node.id()}</p>

            <p><strong>Type:</strong> ${node.data("type")}</p>

            <p><strong>Connections:</strong> ${node.connectedEdges().length}</p>
        `;

    });

    // Hover

    cy.on("mouseover", "node", (event) => {

        event.target.addClass("hover");

    });

    cy.on("mouseout", "node", (event) => {

        const node = event.target;

        if (!node.selected()) {
            node.removeClass("hover");
        }

    });

    // Fundo

    cy.on("tap", (event) => {

        if (event.target !== cy) {
            return;
        }

        cy.elements().removeClass("hover");
        cy.elements().removeClass("highlight");

        info.innerHTML = `
            <h3>No node selected</h3>

            <p>Click a node in the graph.</p>
        `;

    });

    // Abrir GitHub

    cy.on("dbltap", "node", (event) => {

        const node = event.target;

        window.open(
            `https://github.com/Rodrigo-Tripa/Cyber-Notes/search?q=${encodeURIComponent(node.data("label"))}`,
            "_blank"
        );

    });

}