const canvas = document.getElementById('dfs-animation');
const ctx = canvas.getContext('2d');

const rabbitCanvas = document.getElementById('rabbit-canvas');
const rabbitCtx = rabbitCanvas.getContext('2d');

pathColor = "orange";

// Adjust canvas size dynamically or use fixed size
canvas.width = 800;  // Increased width for larger graph
canvas.height = 600; // Increased height for larger graph

// Define nodes for a complex graph with dead ends and a fork
const nodes = [
    {x: 100, y: 100, label: 'Start'},  
    {x: 300, y: 100, label: 'B'},
    {x: 500, y: 100, label: 'C'},
    {x: 700, y: 100, label: 'D'},  
    {x: 200, y: 300, label: 'E'},
    {x: 400, y: 300, label: 'F'},  
    {x: 600, y: 300, label: 'G'},  
    {x: 300, y: 500, label: 'Carrot'},  
    {x: 500, y: 500, label: 'I'},  
    {x: 100, y: 300, label: 'J'}   
];

// Define edges for the graph, including long paths, dead ends, and a fork
const edges = [
    [0, 1], [1, 2], [2, 3],  // Long path A -> B -> C -> D (dead end)
    [0, 4], [4, 5],          // Path from A -> E -> F (fork point)
    [5, 6],                  // F -> G (dead end)
    [5, 7], [5, 8],          // Fork paths F -> H and F -> I
    [4, 9],                  // E -> J (dead end)
];

// Adjusted DFS path that explores all nodes, including dead ends
const dfsPath = [0, 1, 2, 3, 2, 1, 0, 4, 5, 6, 5, 7, 5, 8, 5, 4, 9];
let rabbitIndex = 0;

// Custom style for nodes
const nodeStyle = {
    radius: 20,
    fillColor: '#614939',  // light brown for node
    strokeColor: '#614939', // light brown for node outline
    labelColor: '#000',     // Black for labels
    highlightFillColor: pathColor, // Highlighted node color
};

// Custom style for edges
const edgeStyle = {
    strokeColor: '#785c4a',  // lighter brown for edges
    lineWidth: 40,
    highlightColor: pathColor  // lighter brown for highlighted edges
};

function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw edges (tunnels)
    ctx.strokeStyle = edgeStyle.strokeColor;
    ctx.lineWidth = edgeStyle.lineWidth;
    edges.forEach(edge => {
        const [start, end] = edge;
        ctx.beginPath();
        ctx.moveTo(nodes[start].x, nodes[start].y);
        ctx.lineTo(nodes[end].x, nodes[end].y);
        ctx.stroke();
    });

    // Draw nodes (tunnel points)
    nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeStyle.radius, 0, Math.PI * 2);
        ctx.fillStyle = nodeStyle.fillColor;
        ctx.fill();
        ctx.strokeStyle = nodeStyle.strokeColor;
        ctx.stroke();
        
        // Draw node label
        ctx.fillStyle = nodeStyle.labelColor;
        ctx.font = '16px Arial';
        ctx.fillText(node.label, node.x - 5, node.y + 5);
    });
}

function highlightEdge(start, end, pathColor) {
    // Highlight the edge between two nodes
    ctx.strokeStyle = pathColor;
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.moveTo(nodes[start].x, nodes[start].y);
    ctx.lineTo(nodes[end].x, nodes[end].y);
    ctx.stroke();
}

function moveRabbit() {
    const currentNode = nodes[dfsPath[rabbitIndex]];
    
    // Draw rabbit at the current node (highlighted node)
    ctx.beginPath();
    ctx.arc(currentNode.x, currentNode.y, nodeStyle.radius - 5, 0, Math.PI * 2);
    ctx.fillStyle = nodeStyle.highlightFillColor;
    ctx.fill();

    // Highlight the edge connecting to the next node
    if (rabbitIndex > 0) {
        highlightEdge(dfsPath[rabbitIndex - 1], dfsPath[rabbitIndex], nodeStyle.highlightFillColor);
    }

    if (rabbitIndex == 0) {
        drawGraph();
    }

    // Move to the next node in the DFS path
    rabbitIndex = (rabbitIndex + 1) % dfsPath.length;
    if (rabbitIndex - 1 >= 0) {
        moveRabbitOnce(currentNode.x, currentNode.y, nodes[dfsPath[rabbitIndex - 1]].x, nodes[dfsPath[rabbitIndex - 1]].y)
    }
    else {
        moveRabbitOnce(currentNode.x, currentNode.y, nodes[dfsPath[dfsPath.length - 1]].x, nodes[dfsPath[dfsPath.length - 1]].y)
    }
    
    // Loop the rabbit movement every second
    setTimeout(moveRabbit, 1000);

    // restart animation if carrot (goal state) has been reached
    if (currentNode.label == "Carrot") { 
        rabbitIndex = 0;
    }
}

function drawRabbit(x, y) {
    const rabbitImage = new Image();  // Create a new image object
    rabbitImage.src = 'static/assets/rabbit.png';  // Set the source to the rabbit image path

    rabbitImage.onload = function() {
        const rabbitWidth = 250;  // Set the desired width of the rabbit
        const rabbitHeight = 200; // Set the desired height of the rabbit
        rabbitCtx.clearRect(0, 0, rabbitCanvas.width, rabbitCanvas.height); // Clear previous rabbit
        rabbitCtx.drawImage(rabbitImage, x - rabbitWidth / 2, y - rabbitHeight / 2, rabbitWidth, rabbitHeight);
    };
}

function moveRabbitOnce(currentX, currentY, newX, newY) {
    const rabbitWidth = 250;  // Rabbit width for reference
    const rabbitHeight = 200; // Rabbit height for reference

    // Step 1: Restore the background at the current rabbit location
    const backgroundData = ctx.getImageData(currentX - rabbitWidth / 2, currentY - rabbitHeight / 2, rabbitWidth, rabbitHeight);
    ctx.putImageData(backgroundData, currentX - rabbitWidth / 2, currentY - rabbitHeight / 2);

    // Step 2: Save the background at the new location before drawing the rabbit
    const newBackgroundData = ctx.getImageData(newX - rabbitWidth / 2, newY - rabbitHeight / 2, rabbitWidth, rabbitHeight);

    // Step 3: Draw the rabbit at the new location
    drawRabbit(newX, newY);
}

drawGraph();
drawRabbit(100, 100);
// Start the DFS traversal animation
moveRabbit();