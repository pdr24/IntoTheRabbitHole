var curr_level = 0; // keeps track of current level for use with game logic 

const canvas = document.getElementById('tunnelsystem');
const ctx = canvas.getContext('2d');

const rabbitCanvas = document.getElementById('rabbit-canvas');
const rabbitCtx = rabbitCanvas.getContext('2d');

pathColor = "orange";

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

// Adjust canvas size dynamically or use fixed size
canvas.width = 800;  // Increased width for larger graph
canvas.height = 600; // Increased height for larger graph

// to read and update the current level 
document.addEventListener("DOMContentLoaded", function() {
    const pageBody = document.body;
    const pageId = pageBody.getAttribute('data-page-id');  // Get the page-specific value

    if (pageId === 'level1') {
        console.log("This is Level 1");
        curr_level = 1;
    } 
    else if (pageId === 'level2') {
        console.log("This is Level 2");
        curr_level = 2;
    }
});

// class representing the tunnel system (graph)
class TunnelSystem {

    constructor(nodes_val = [], edges_val = []) {
        this._nodes = nodes_val; // array of nodes
        this._edges = edges_val; // array of edges
        this.updateDFSPath(); // update dfs path based on nodes and edges 
    }

    updateDFSPath() {
        // for this TunnelSystem object, determine the correct sequence of nodes to reach the goal according to DFS
        var path = [];
        // find path 
        // TODO: implement DFS algorithm to find the path !!!

        // update this.dfsPath accordingly 
        this._dfsPath = path;
    }

    addNode(x, y, label) {
        this.nodes.push({ x, y, label });
        this.updateDFSPath();
    }

    addEdge(node1Index, node2Index) {
        if (node1Index < this.nodes.length && node2Index < this.nodes.length) {
            this.edges.push([node1Index, node2Index]);
            this.updateDFSPath();
        } 
        else {
            console.log('Error: One or both of the node indices do not exist.');
        }
    }

    addEdgeByLabels(label1, label2) {
        const node1Index = this.nodes.findIndex(node => node.label === label1);
        const node2Index = this.nodes.findIndex(node => node.label === label2);

        // Check if both nodes were found
        if (node1Index !== -1 && node2Index !== -1) {
            this.addEdge(node1Index, node2Index);  // Reuse addEdge by index
        } 
        else {
            console.log(`Error: One or both of the node labels do not exist. Node1: ${label1}, Node2: ${label2}`);
        }
    }

    get nodes() {
        return this._nodes;
    }
     
    set nodes(newNodes) {
        this.nodes = newNodes;
    } 

    get edges() {
        return this._edges;
    }

    set edges(newEdges) {
        this.edges = newEdges;
    }

    get dfsPath() {
        return this._dfsPath;
    }

    set dfsPath(newPath) {
        this.dfsPath = newPath;
    }
}

// TODO: to be implemented later... start with a hard coded graph for now
function generatePuzzle() {
    // randomly generate a puzzle 
    // store it as graph
    // return puzzle graph 
}

function drawGraph(puzzle) {
    // draw graph/tunel system based on the given puzzle 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw edges (tunnels)
    ctx.strokeStyle = edgeStyle.strokeColor;
    ctx.lineWidth = edgeStyle.lineWidth;
    puzzle.edges.forEach(edge => {
        const [start, end] = edge;
        ctx.beginPath();
        ctx.moveTo(nodes[start].x, nodes[start].y);
        ctx.lineTo(nodes[end].x, nodes[end].y);
        ctx.stroke();
    });

    // Draw nodes (tunnel points)
    puzzle.nodes.forEach(node => {
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

    // TODO: each node should be a button with an onclick function validateUserClick() !!!!!!!!!!!!!!!!!!!!
}

function loadRabbit(puzzle) {
    // draw rabbit at starting position of the puzzle
}

function validateUserClick(click, index, path) {
    // if the user's click is the same as path[index] then true 
    if (click == path[index]) {
        return true; // proceed as normal
    }

    displayError(); // display error 
    return false;
}

function displayError() {
    // display error message or something if user clicks the wrong node
    // for use within validateUserClick()
}

function checkIfCarrotReached(click, index, path) {
    // check if user has correctly reached the end of the path 
    if ((click == path[index]) && (index == path.length)) {
        return true;
    }

    return false;
}

function carrotReached() {
    // display success message 
    calculateAndSaveMetrics();
    // show option to go the next level 
}

function calculateAndSaveMetrics() {
    // calculate any metrics (like accuracy, time on puzzle, etc)
    // save to browser cookies 
}

// TODO: do all of these and implement the methods above 
// randomly select or generate puzzle 
// draw graph according to puzzle 
// load rabbit into starting point 
// have var userAllClicks to keep track of the clicks the user has made 
// have var userCorrectClicks to keep track of the correct selections to see how far along the path they are right now
// validateUserClick will compare the user's click to what should be the next click according to puzzle 

// var puzzle = generatePuzzle(); // change it to hard coded puzzle at first if needed 

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

// Define edges for the graph, including long paths, dead ends, and a fork
const edges = [
    [0, 1], [1, 2], [2, 3],  // Long path A -> B -> C -> D (dead end)
    [0, 4], [4, 5],          // Path from A -> E -> F (fork point)
    [5, 6],                  // F -> G (dead end)
    [5, 7], [5, 8],          // Fork paths F -> H and F -> I
    [4, 9],                  // E -> J (dead end)
];

var puzzle = new TunnelSystem(nodes, edges);

drawGraph(puzzle); // draw puzzle as tunnel system 
loadRabbit(puzzle); // draw rabbit at starting point of the tunnel according to puzzle 
var userAllClicks = [];
var userCorrectClicks  =[];

// TODO: NEED TO FIGURE OUT HOW TO SET ONCLICK FUNCTIONS SO THAT THE GAME AUTOMATICALLY PROGRESSES
