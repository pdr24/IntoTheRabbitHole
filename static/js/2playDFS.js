var curr_level = 0; // keeps track of current level for use with game logic 


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

    // TODO: to be implemented later... start with a hard coded graph for now
    function generatePuzzle() {
        // randomly generate a puzzle 
        // store it as graph
        // return puzzle graph 
    }


    var puzzle = new TunnelSystem(nodes, edges);

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
    }

    function drawGraph(puzzle) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        buttonContainer.innerHTML = '';
        drawButtons(puzzle);
        drawEdges(puzzle);
    }
    
    function nodeClicked(node, index) {
        console.log(`Node ${node.label} clicked!`);
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


    //drawGraph(puzzle);

    var puzzle = new TunnelSystem(nodes, edges);

    drawGraph(puzzle); // draw puzzle as tunnel system 
    loadRabbit(puzzle); // draw rabbit at starting point of the tunnel according to puzzle 
    var userAllClicks = [];
    var userCorrectClicks  =[];
});

// TODO: CONSOLIDATE 2PLAYDFS AND PLAYDFS AND THEN DELETE ONE OF THEM !!!!!!!!!!!!!!!!!
