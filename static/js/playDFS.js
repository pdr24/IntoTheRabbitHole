curr_level = 0; // keeps track of current level for use with game logic 

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
        this.nodes = nodes_val; // array of nodes
        this.edges = edges_val; // array of edges
        this.updateDFSPath(); // update dfs path based on nodes and edges 
    }

    updateDFSPath() {
        // for this TunnelSystem object, determine the correct sequence of nodes to reach the goal according to DFS
        path = [];
        // find path 
        // TODO: implement DFS algorithm to find the path 

        // update this.dfsPath accordingly 
        this.dfsPath = path;
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
        return this.nodes;
    }

    set nodes(newNodes) {
        this.nodes = newNodes;
    }

    get edges() {
        return this.edges;
    }

    set edges(newEdges) {
        this.edges = newEdges;
    }

    get dfsPath() {
        return this.dfsPath;
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

    // each node should be a button with an onclick function validateUserClick()
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