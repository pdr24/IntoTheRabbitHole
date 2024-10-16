document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('tunnelsystem');
    const buttonContainer = document.querySelector('.button-container'); // Get button container
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;

    const pathColor = "orange";

    const nodeStyle = {
        radius: 20,
        fillColor: '#614939',
        strokeColor: '#614939',
        labelColor: '#000',
    };

    const edgeStyle = {
        strokeColor: '#785c4a',
        lineWidth: 40,
    };

    class TunnelSystem {
        constructor(nodes_val = [], edges_val = []) {
            this._nodes = nodes_val;
            this._edges = edges_val;
            this.updateDFSPath();
        }

        updateDFSPath() {
            var path = [];
            this._dfsPath = path;
        }

        get nodes() {
            return this._nodes;
        }

        get edges() {
            return this._edges;
        }
    }

    const nodes = [
        {x: 100, y: 100, label: 'Start'},  
        {x: 300, y: 100, label: 'B'},
        {x: 500, y: 150, label: 'C'},
        {x: 700, y: 100, label: 'D'},  
        {x: 300, y: 300, label: 'E'},
        {x: 500, y: 300, label: 'F'},  
        {x: 700, y: 300, label: 'G'},  
        {x: 400, y: 500, label: 'Carrot'},  
        {x: 600, y: 500, label: 'I'},  
        {x: 100, y: 300, label: 'J'}
    ];

    const edges = [
        [0, 1], [1, 2], [2, 3],
        [0, 4], [4, 5], [5, 6],
        [5, 7], [5, 8], [4, 9]
    ];

    var puzzle = new TunnelSystem(nodes, edges);

    function drawGraph(puzzle) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw edges
        ctx.strokeStyle = edgeStyle.strokeColor;
        ctx.lineWidth = edgeStyle.lineWidth;
        puzzle.edges.forEach(edge => {
            const [start, end] = edge;
            ctx.beginPath();
            ctx.moveTo(puzzle.nodes[start].x, puzzle.nodes[start].y);
            ctx.lineTo(puzzle.nodes[end].x, puzzle.nodes[end].y);
            ctx.stroke();
        });

        // Get canvas position relative to the page
        const canvasRect = canvas.getBoundingClientRect();

        // Draw nodes and create buttons
        puzzle.nodes.forEach((node, index) => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeStyle.radius, 0, Math.PI * 2);
            ctx.fillStyle = nodeStyle.fillColor;
            ctx.fill();
            ctx.strokeStyle = nodeStyle.strokeColor;
            ctx.stroke();

            ctx.fillStyle = nodeStyle.labelColor;
            ctx.font = '16px Arial';
            ctx.fillText(node.label, node.x - 10, node.y + 5);

            // Create invisible button over each node
            const button = document.createElement('button');
            button.className = 'node-button';
            button.style.position = 'absolute';
            button.style.left = `${node.x - nodeStyle.radius}px`;
            button.style.top = `${node.y - nodeStyle.radius}px`;
            button.style.width = `${nodeStyle.radius * 2}px`;
            button.style.height = `${nodeStyle.radius * 2}px`;
            button.style.backgroundColor = 'transparent';
            button.style.border = 'none';
            button.style.cursor = 'pointer';

            button.onclick = () => {
                nodeClicked(node, index);
            };

            // Append button to the button-container instead of the body
            buttonContainer.appendChild(button);
        });
    }

    function nodeClicked(node, index) {
        console.log(`Node ${node.label} clicked!`);
    }

    drawGraph(puzzle);
});
