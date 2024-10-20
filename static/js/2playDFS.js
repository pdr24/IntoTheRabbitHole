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

        });
    }

    function drawButtons(puzzle) {
        // Clear existing buttons
        buttonContainer.innerHTML = '';

        // Get the button container's dimensions
        const containerWidth = buttonContainer.offsetWidth;
        const containerHeight = buttonContainer.offsetHeight;

        // Get the original graph dimensions (used for scaling)
        const originalWidth = 800; // Original width of the graph
        const originalHeight = 600; // Original height of the graph

        // Draw nodes and create buttons
        puzzle.nodes.forEach((node, index) => {
            // Scale the node position relative to the container size
            const scaledX = (node.x / originalWidth) * containerWidth;
            const scaledY = (node.y / originalHeight) * containerHeight;

            // Create a button for each node
            const button = document.createElement('button');
            button.style.position = 'absolute';
            button.style.left = `${scaledX - nodeStyle.radius * 2}px`;
            button.style.top = `${scaledY - nodeStyle.radius * 2}px`;
            button.style.width = `${nodeStyle.radius * 4}px`;
            button.style.height = `${nodeStyle.radius * 4}px`;
            button.style.borderRadius = '50%';  // Make the button circular
            button.style.backgroundColor = nodeStyle.fillColor;
            button.style.backgroundColor = "green";
            button.style.border = 'none';
            button.style.cursor = 'pointer';
            button.textContent = node.label;

            button.onclick = () => {
                nodeClicked(node, index);
            };

            // Append button to the button-container
            buttonContainer.appendChild(button);
        });
    }

    function drawEdges(puzzle) {
        // Clear any existing elements in the button container
        // buttonContainer.innerHTML = '';
    
        // Get the container's current dimensions
        const containerWidth = buttonContainer.offsetWidth;
        const containerHeight = buttonContainer.offsetHeight;
    
        // Original graph dimensions
        const originalWidth = 800;
        const originalHeight = 600;
    
        // Draw edges as unclickable buttons
        puzzle.edges.forEach(edge => {
            const [startIndex, endIndex] = edge;
            const startNode = puzzle.nodes[startIndex];
            const endNode = puzzle.nodes[endIndex];
    
            // Scale positions relative to the container
            const scaledStartX = (startNode.x / originalWidth) * containerWidth;
            const scaledStartY = (startNode.y / originalHeight) * containerHeight;
            const scaledEndX = (endNode.x / originalWidth) * containerWidth;
            const scaledEndY = (endNode.y / originalHeight) * containerHeight;
    
            // Calculate distance and angle between the start and end nodes
            const deltaX = scaledEndX - scaledStartX;
            const deltaY = scaledEndY - scaledStartY;
            const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);  // Length of the edge
            const angle = Math.atan2(deltaY, deltaX);  // Angle between the two nodes
    
            // Create an edge button
            const edgeButton = document.createElement('div');
            edgeButton.style.position = 'absolute';
            edgeButton.style.backgroundColor = edgeStyle.strokeColor;  // Set edge color
            edgeButton.style.backgroundColor = "pink"; // remove later 
            edgeButton.style.height = `${edgeStyle.lineWidth}px`;  // Set the thickness of the edge
            edgeButton.style.width = `${length}px`;  // Set the length of the edge
            edgeButton.style.left = `${scaledStartX}px`;  // Position at the start node
            edgeButton.style.top = `${scaledStartY}px`;   // Position at the start node
            edgeButton.style.transformOrigin = '0 0';  // Rotate from the start node
            edgeButton.style.transform = `rotate(${angle}rad)`;  // Rotate to align with the end node
            edgeButton.style.pointerEvents = 'none';  // Make it unclickable
    
            // Append the edge button to the button container
            buttonContainer.appendChild(edgeButton);
        });
    }

    function drawGraphAsButtons(puzzle) {
        buttonContainer.innerHTML = '';
        drawButtons(puzzle);
        drawEdges(puzzle);
    }
    

    function nodeClicked(node, index) {
        console.log(`Node ${node.label} clicked!`);
    }

    drawGraph(puzzle);
    drawGraphAsButtons(puzzle);
});
