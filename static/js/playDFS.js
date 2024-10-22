var curr_level = 0; // keeps track of current level for use with game logic 
var rabbitScaleFactor = 0.3; // scale factor to size rabbit image according to screen size

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

    const rabbitCanvas = document.getElementById('rabbit-canvas'); // get rabbit canvas for drawing the rabbit
    const rabbitCtx = rabbitCanvas.getContext('2d');

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
            const visited = new Array(nodes.length).fill(false); // To keep track of visited nodes
            const dfsPath = []; // To store the final DFS path
            const nodeCount = nodes.length;

            const adjacencyList = Array.from({ length: nodeCount }, () => []);

            // Add edges to the adjacency list
            for (const [start, end] of edges) {
                adjacencyList[start].push(end);
                adjacencyList[end].push(start); // Since it's an undirected graph
            }

            // Helper function to perform DFS
            function dfs(currentNode) {
                // Mark the current node as visited and add it to the path
                visited[currentNode] = true;
                dfsPath.push(currentNode);

                // Explore neighbors of the current node
                const neighbors = adjacencyList[currentNode];
                for (const neighbor of neighbors) {
                    if (!visited[neighbor]) {
                        dfs(neighbor);
                        // Backtrack to the current node after visiting a neighbor
                        dfsPath.push(currentNode);
                    }
                }
            }

            // Perform DFS starting from node 0 (assuming 0 is the starting node)
            dfs(0);

            const pathLabels = dfsPath.map(index => nodes[index].label);
            this._dfsPath = pathLabels;
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
            button.style.border = 'none';
            button.style.cursor = 'pointer';
            button.textContent = node.label;

            button.onclick = () => {
                nodeClicked(node, puzzle);
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
        // clear canvas and button container in case something was already there 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        buttonContainer.innerHTML = '';

        // draw buttons and edges for the tunnel system 
        drawButtons(puzzle);
        drawEdges(puzzle);
    }
    
    function nodeClicked(node, puzzleObj) {
        console.log(`Node ${node.label} clicked!`);
        const path = puzzleObj.dfsPath;

        // update userAllClicks
        userAllClicks.push(node.label)

        if (isUserClickValid(node, currIndex, path)) { // user's click was correct 
            userCorrectClicks.push(node.label);
            currIndex = currIndex + 1;
            console.log("click was correct");

            // move rabbit 
            var labelPrev = path[currIndex - 2]; // needs to be -2 to get the prev node 
            var prevNode = puzzleObj.nodes.find(node => node.label === labelPrev);
            drawRabbit(node.x, node.y);

            // draw path 
            console.log("prevNode x and y: " + prevNode.x + ", " + prevNode.y);
            ctx.beginPath();
            ctx.moveTo(prevNode.x, prevNode.y); // Move to the previous node's position
            ctx.lineTo(node.x, node.y); // Draw a line to the current node's position
            ctx.strokeStyle = pathColor; // Set path color
            ctx.lineWidth = 20; // Set path width
            ctx.stroke(); // Render the line

        }
        else { // user click was incorrect 
            showErrorOnCanvas(node.label);
            // TODO: update required vars to track user correctness and progress as needed 
        }

        // check if carrot reached 
        if (isCarrotReached(node)) {
            console.log("carrot has been reached");
            carrotReached();

            // add logic for when the carrot has been reached 
        }
    }

    function showErrorOnCanvas(label) {
        const canvasRect = canvas.getBoundingClientRect();  // Get the actual size and position of the canvas
        const canvasWidth = canvasRect.width;
        const canvasHeight = canvasRect.height;
    
        // Create the button
        const button = document.createElement('button');
        button.innerHTML = label + " was the wrong node. Try again";
        button.style.position = 'absolute';

        const buttonWidth = 400;
        const buttonHeight = 300;
        button.style.left = `${(canvasWidth / 2) - (buttonWidth / 2)}px`;  
        button.style.top = `${(canvasHeight / 2) - (buttonHeight / 2)}px`;  
        button.style.width = `${buttonWidth}px`;
        button.style.height = `${buttonHeight}px`;

        button.style.backgroundColor = "white";
        button.style.borderRadius = '20px';
        button.style.outlineColor = "black";

        button.style.fontSize = '24px';

        button.style.cursor = 'pointer';
    
        // Append the button to the button container, positioned relative to the canvas
        buttonContainer.appendChild(button);

        // Create the button
        const errorBackground = document.createElement('button');
        errorBackground.style.position = 'absolute';

        const errorBackgroundWidth = canvasWidth;
        const errorBackgroundHeight = canvasHeight;
        errorBackground.style.left = `${(canvasWidth / 2) - (errorBackgroundWidth / 2)}px`;  
        errorBackground.style.top = `${(canvasHeight / 2) - (errorBackgroundHeight / 2)}px`;  
        errorBackground.style.width = `${errorBackgroundWidth}px`;
        errorBackground.style.height = `${errorBackgroundHeight}px`;

        errorBackground.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
        errorBackground.style.borderRadius = '20px';
        errorBackground.style.outlineColor = "black";

        errorBackground.style.cursor = 'pointer';
    
        // Append the button to the button container, positioned relative to the canvas
        buttonContainer.appendChild(errorBackground);
        buttonContainer.appendChild(button);

        // Remove the buttons after 3 seconds
        let timeoutId = setTimeout(() => {
            removeErrorMessage();
        }, 3000);  // 3 seconds

        // Function to remove the error message
        function removeErrorMessage() {
            if (buttonContainer.contains(button)) {
                buttonContainer.removeChild(button);
            }
            if (buttonContainer.contains(errorBackground)) {
                buttonContainer.removeChild(errorBackground);
            }
            // Remove the event listener after the error message is gone
            document.removeEventListener('click', clickToRemoveErrorMessage);
        }

        // Event listener for clicking outside the button
        function clickToRemoveErrorMessage(event) {
            if (errorBackground.contains(event.target)) {
                // Remove the error message if the user clicks the background
                removeErrorMessage();
    
                // Cancel the timeout to prevent it from running
                clearTimeout(timeoutId);
            }
        }

        // Add the event listener to detect clicks outside the button
        document.addEventListener('click', clickToRemoveErrorMessage);
    }
    
    function drawRabbit(x, y) {
        const rabbitImage = new Image();  // Create a new image object
        rabbitImage.src = 'static/assets/rabbit.png';  // Set the source to the rabbit image path
    
        rabbitImage.onload = function() {
            // Get the canvas dimensions
            const canvasWidth = rabbitCanvas.width;
            const canvasHeight = rabbitCanvas.height;
    
            // Dynamically scale the rabbit's width and height
            const rabbitWidth = canvasWidth * rabbitScaleFactor;  // Rabbit width relative to canvas width
            const rabbitHeight = canvasHeight * rabbitScaleFactor; // Rabbit height relative to canvas height
    
            // Clear the previous rabbit
            rabbitCtx.clearRect(0, 0, rabbitCanvas.width, rabbitCanvas.height);
    
            // Calculate the x and y offsets to center the rabbit
            const offsetX = rabbitWidth / 2;
            const offsetY = rabbitHeight / 2;
    
            // Draw the rabbit, adjusting for the screen size and centering
            rabbitCtx.drawImage(rabbitImage, x - offsetX, y - offsetY, rabbitWidth, rabbitHeight);
        };
    }
    
    function loadRabbitToStart(puzzle) {
        const startNode = puzzle.nodes.find(node => node.label.includes("Start"));
    
        if (startNode) { // if start node found 
            drawRabbit(startNode.x, startNode.y);
            return;
        } 
        console.log("Start node not found"); // debugging purposes 
    }
    
    function isUserClickValid(nodeClicked, currIndex, path) {
        // if the user's click is the same as path[index] then true 

        // for testing purposes
        // console.log("nodeClicked.label = " + nodeClicked.label);
        // console.log("path = " + path);
        // console.log("currIndex = " + currIndex);
        // console.log("path[currIndex] = " + path[currIndex]);

        if (nodeClicked.label == path[currIndex]) {
            return true; // proceed as normal
        }
    
        return false;
    }
    
    function isCarrotReached(node) {
        // check if user has correctly reached the carrot 
        if (node.label.includes("Carrot")) {
            return true;
        }
    
        return false;
    }
    
    function carrotReached() {
        // display success message 
        calculateAndSaveMetrics();

        // show option to go the next level 
        showCongratsModal();
    }

    function showCongratsModal() {
        const modal = document.getElementById('congratulationsModal');
        modal.style.display = 'flex'; // Make the modal visible
    
        // Play Again button functionality
        document.getElementById('playAgainButton').addEventListener('click', function() {
            resetLevel();  // Call function to reset the current level
        });
    
        // Next Level button functionality
        document.getElementById('nextLevelButton').addEventListener('click', function() {
            window.location.href = 'index.html'; // Redirect to next level (index.html)
        });
    }
    
    function resetLevel() {
        // Logic to reset the level, this could reload the page for now
        window.location.reload(); 
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

    var puzzle = new TunnelSystem(nodes, edges);
    console.log(puzzle.dfsPath); // for testing purposes 
    
    drawGraph(puzzle); // draw puzzle as tunnel system 
    loadRabbitToStart(puzzle); // draw rabbit at starting point of the tunnel according to puzzle 
    var userAllClicks = [];
    var userCorrectClicks = [];
    var currIndex = 1; // start at 1 b/c dfsPath has 'Start' at index = 0 

});

// TODO: check the updateDFSPath function on other graphs 
// TODO: make error message show up above rabbit image 
// TODO: add data saving 
// TODO: add better styling overall lol 