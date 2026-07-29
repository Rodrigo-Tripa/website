function buildTree(files) {

    const root = {

        id: "root",
        name: "Cyber Notes",
        children: []

    };

    const folders = {};

    for (const file of files) {

        if (file.type !== "blob") {
            continue;
        }

        if (!file.path.endsWith(".md")) {
            continue;
        }

        const parts = file.path.split("/");

        if (parts.length < 2) {
            continue;
        }

        const categoryName = parts[0];

        const noteName = parts[parts.length - 1]
            .replace(".md", "");

        if (!folders[categoryName]) {

            folders[categoryName] = {

                id: slug(categoryName),
                name: categoryName,
                children: []

            };

            root.children.push(folders[categoryName]);

        }

        folders[categoryName].children.push({

            id: slug(`${categoryName}-${noteName}`),
            name: noteName,
            path: file.path,
            sha: file.sha

        });

    }

    root.children.sort((a, b) => a.name.localeCompare(b.name));

    root.children.forEach(category => {

        category.children.sort((a, b) =>
            a.name.localeCompare(b.name)
        );

    });

    return root;

}

function buildGraphElements(tree) {

    const nodes = [];
    const edges = [];

    traverse(tree);

    return {
        nodes,
        edges
    };

    function traverse(node, parent = null) {
        console.log(node);
        nodes.push({
            id: node.id,
            label: node.name,
            type: node.children ? "folder" : "note",
            path: node.path ?? null,
            sha: node.sha ?? null
        });

        if (parent) {

            edges.push({
                from: parent.id,
                to: node.id
            });

        }

        if (!node.children) {
            return;
        }

        node.children.forEach(child => traverse(child, node));

    }

}

function slug(text) {

    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

}