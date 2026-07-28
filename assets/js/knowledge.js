const cy = cytoscape({

    container: document.getElementById("cy"),

    elements: [

        // Nodes

        {
            data: {
                id: "Cyber Notes",
                label: "Cyber Notes"
            }
        },

        {
            data: {
                id: "Linux",
                label: "Linux"
            }
        },

        {
            data: {
                id: "Networking",
                label: "Networking"
            }
        },

        {
            data: {
                id: "Cryptography",
                label: "Cryptography"
            }
        },

        {
            data: {
                id: "Python",
                label: "Python"
            }
        },

        {
            data: {
                id: "Docker",
                label: "Docker"
            }
        },

        // Edges

        {
            data: {
                source: "Cyber Notes",
                target: "Linux"
            }
        },

        {
            data: {
                source: "Cyber Notes",
                target: "Networking"
            }
        },

        {
            data: {
                source: "Cyber Notes",
                target: "Cryptography"
            }
        },

        {
            data: {
                source: "Cyber Notes",
                target: "Python"
            }
        },

        {
            data: {
                source: "Cyber Notes",
                target: "Docker"
            }
        }

    ],

    style: [

        {
            selector: "node",

            style: {

                "background-color": "#ffffff",

                "label": "data(label)",

                "color": "#ffffff",

                "font-size": "12px",

                "text-valign": "bottom",

                "text-margin-y": "8px",

                "text-outline-width": 0

            }

        },

        {
            selector: "edge",

            style: {

                "line-color": "#444",

                "width": 1.5,

                "curve-style": "bezier"

            }

        }

    ],

    layout: {

        name: "cose",

        animate: true,

        fit: true,

        padding: 50

    }

});

const info = document.getElementById("node-info");

cy.on("tap", "node", (event) => {

    const node = event.target;

    info.innerHTML = `

        <h3>${node.id()}</h3>

        <p>This note will eventually be loaded automatically from GitHub.</p>

        <p><strong>ID:</strong> ${node.id()}</p>

    `;

});