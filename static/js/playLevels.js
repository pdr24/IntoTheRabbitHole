var curr_level = 0; // keeps track of current level for use with game logic 
var rabbitScaleFactor = 0.4; // scale factor to size rabbit image according to screen size
var algorithm = ''; // stores the algorithm that should be used in the level 
var path = null; // stores path for the current level 
var next_level_page = null; // stores the next page to redirect to 

document.addEventListener("DOMContentLoaded", function() {

    const pageBody = document.body;
    const pageId = pageBody.getAttribute('data-page-id');  // Get the page-specific id value 

    // update variables as needed based on the page id 
    if (pageId === 'dfs_level1') {
        console.log("This is DFS Level 1");
        curr_level = 1;
        algorithm = 'dfs';
        next_level_page = 'dfs_level2.html';
    } 
    else if (pageId == "dfs_level2") {
        console.log("This is DFS Level 2");
        curr_level = 2;
        algorithm = 'dfs';
        next_level_page = 'dfs_level3.html';
    }
    else if (pageId == "dfs_level3") {
        console.log("This is DFS Level 3");
        curr_level = 3;
        algorithm = 'dfs';
        next_level_page = 'bfs_animation.html';
    }
    else if (pageId === 'bfs_level1') {
        console.log("This is BFS Level 1");
        curr_level = 4;
        algorithm = 'bfs';
        next_level_page = 'bfs_level2.html';
    }
    else if (pageId == "bfs_level2") {
        console.log("This is BFS Level 2");
        curr_level = 5;
        algorithm = 'bfs';
        next_level_page = 'bfs_level3.html';
    }
    else if (pageId == "bfs_level3") {
        console.log("This is BFS Level 3");
        curr_level = 6;
        algorithm = 'bfs';
        next_level_page = 'challenge_level.html';
    }
    else if (pageId == "challenge_level") {
        console.log("This is the challenge level");
        curr_level = 7;

        // pick algorithm at random
        let randAlgNum = Math.round(Math.random());
        let algorithms = ['dfs', 'bfs']
        algorithm = algorithms[randAlgNum]
        console.log("Randomly selected algorithm: " + algorithm)
        
        next_level_page = 'index.html';
    }
    else {
        // error message if page id is not recognized 
        console.log("Error: the page id " + pageId + " is not handled in playLevels.js")
    }

    const canvas = document.getElementById('tunnelsystem');
    const buttonContainer = document.querySelector('.button-container'); // Get button container
    const ctx = canvas.getContext('2d');

    const rabbitCanvas = document.getElementById('rabbit-canvas'); // get rabbit canvas for drawing the rabbit
    const rabbitCtx = rabbitCanvas.getContext('2d');

    const errorContainer = document.querySelector('.error-message-div'); // Get button container

    canvas.width = 800;
    canvas.height = 600;

    const pathColor = "orange";

    const nodeStyle = {
        radius: 27,
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
            this.updateBFSPath(); // update bfs path based on nodes and edges 
        }

        updateDFSPathOLD() {
            // TODO: change this to be hard coded since i;ll only be working with 1 tunnel 

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
            console.log("PROCESSED DFS PATH OLD: " + pathLabels);
        }

        updateDFSPath() {
            var dfs = ['Start', 'B', 'C', 'D', 'C', 'B', 'Start', 'E', 'F', 'G', 'F', 'H', 'F', 'I', 'F', 'E', 'J'];

            // add 'carrot' label to dfs path as needed based on the location of the carrot 
            for (let i = 0; i < this._nodes.length; i++) {
                if (this._nodes[i].label.includes("Carrot")) {
                    for (let j = 0; j < dfs.length; j++) {
                        if (dfs[j] == this._nodes[i].label.substring(0,1)) {
                            dfs[j] = dfs[j] + " (Carrot)";
                        }
                    }
                }
            }
            console.log("PROCESSED DFS PATH: " + dfs);

            this._dfsPath = dfs;
        }

        updateBFSPath() {
            // hard coded for now: 
            // var bfs = ['Start', 'B', 'Start', 'E', 'Start', 'B', 'C', 'B', 'Start', 'E', 'F', 'E', 'J', 'E', 'Start', 'B', 'C', 'D', 'C', 'B', 'Start', 'E', 'F', 'G', 'F', 'H (Carrot)', 'F', 'I', 'E', 'J'];
            
            // bfs path disregarding the location of the carrot 
            var bfs = ['Start', 'B', 'Start', 'E', 'Start', 'B', 'C', 'B', 'Start', 'E', 'F', 'E', 'J', 'E', 'Start', 'B', 'C', 'D', 'C', 'B', 'Start', 'E', 'F', 'G', 'F', 'H', 'F', 'I', 'E', 'J'];
            
            // add 'carrot' label to bfs path as needed based on the location of the carrot 
            for (let i = 0; i < this._nodes.length; i++) {
                if (this._nodes[i].label.includes("Carrot")) {
                    for (let j = 0; j < bfs.length; j++) {
                        if (bfs[j] == this._nodes[i].label.substring(0,1)) {
                            bfs[j] = bfs[j] + " (Carrot)";
                        }
                    }
                }
            }
            console.log("PROCESSED BFS PATH: " + bfs);
            
            this._bfsPath = bfs;
        }

        addNode(x, y, label) {
            this.nodes.push({ x, y, label });
            this.updateDFSPath();
            this.updateBFSPath();
        }

        addEdge(node1Index, node2Index) {
            if (node1Index < this.nodes.length && node2Index < this.nodes.length) {
                this.edges.push([node1Index, node2Index]);
                this.updateDFSPath();
                this.updateBFSPath();
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

        get bfsPath() {
            return this._bfsPath;
        }

        set bfsPath(newPath) {
            this.bfsPath = newPath;
        }
    }

    var nodes = [
        {x: 100, y: 100, label: 'Start'},  
        {x: 300, y: 100, label: 'B'},
        {x: 500, y: 150, label: 'C'},
        {x: 700, y: 100, label: 'D'},  
        {x: 300, y: 300, label: 'E'},
        {x: 500, y: 300, label: 'F'},  
        {x: 700, y: 300, label: 'G'},  
        {x: 400, y: 500, label: 'H'},  
        {x: 600, y: 500, label: 'I'},  
        {x: 100, y: 300, label: 'J'}
    ];

    var edges = [
        [0, 1], [1, 2], [2, 3],
        [0, 4], [4, 5], [5, 6],
        [5, 7], [5, 8], [4, 9]
    ];

    // draws nodes of tunnel system as buttons
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
            // button.style.backgroundColor = nodeStyle.fillColor;
            button.style.backgroundImage = 'linear-gradient(to bottom, rgba(97, 73, 57, 1), rgba(97, 73, 57, 0.95))';  // Gradient with rgba
            
            // temporary: recolor option if you want more contrast 
            // button.style.backgroundImage = 'linear-gradient(to bottom, rgba(196, 164, 140, 1), rgba(196, 164, 140, 0.95))';  // Gradient with rgba

            button.addEventListener('mouseover', function() {
                button.style.backgroundImage = 'linear-gradient(to bottom, rgba(97, 73, 57, 0.95), rgba(97, 73, 57, 1.0))';  // Hover color
            });
            
            button.addEventListener('mouseout', function() {
                button.style.backgroundImage = 'linear-gradient(to bottom, rgba(97, 73, 57, 1), rgba(97, 73, 57, 0.95))';  // Revert to original
            });

            button.style.border = 'none';
            button.style.cursor = 'pointer';
            if (node.label != "Start") {
                button.textContent = node.label[0];
            }
            else {
                button.textContent = node.label;
            }

            button.style.fontSize = "30px";
            button.style.fontFamily = "DynaPuff";

            button.onclick = () => {
                nodeClicked(node, puzzle);
            };

            // Append button to the button-container
            buttonContainer.appendChild(button);
        });
    }

    // draws edges of tunnel system 
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

    // draws tunnel system using drawButtons() and drawEdges() 
    function drawGraph(puzzle) {
        // clear canvas and button container in case something was already there 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        buttonContainer.innerHTML = '';

        // draw buttons and edges for the tunnel system 
        drawButtons(puzzle);
        drawEdges(puzzle);
    }
    
    // on click function for the nodes 
    // has important game-play logic 
    function nodeClicked(node, puzzleObj) {
        console.log(`Node ${node.label} clicked!`);

        var path = null;

        if (algorithm == 'dfs') {
            path = puzzleObj.dfsPath;
        }
        else {
            path = puzzleObj.bfsPath;
        }

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
            // console.log("prevNode x and y: " + prevNode.x + ", " + prevNode.y); // testing purposes 
            ctx.beginPath();
            ctx.moveTo(prevNode.x, prevNode.y); // Move to the previous node's position
            ctx.lineTo(node.x, node.y); // Draw a line to the current node's position
            ctx.strokeStyle = pathColor; // Set path color
            ctx.lineWidth = 20; // Set path width
            ctx.stroke(); // Render the line

            // check if carrot reached 
            if (isCarrotReached(node)) {
                console.log("carrot has been reached");
                carrotReached();

                // add logic for when the carrot has been reached 
            }

        }
        else { // user click was incorrect 
            showErrorOnCanvas(node.label);
            // TODO: update required vars to track user correctness and progress as needed 
        }

    }

    // displays error message when wrong node is clicked 
    function showErrorOnCanvas(label) {
        const canvasRect = canvas.getBoundingClientRect();  // Get the actual size and position of the canvas
        const canvasWidth = canvasRect.width;
        const canvasHeight = canvasRect.height;
    
        // Create the button
        const button = document.createElement('button');
        if (label != 'Start') {
            button.innerHTML = label[0] + " was the wrong node.<br><br>Click to try again";
        }
        else {
            button.innerHTML = label + " was the wrong node.<br><br>Click to try again";
        }
        button.style.fontFamily = "DynaPuff, system-ui";
        button.style.fontSize = "40px";
        button.style.position = 'absolute';

        const buttonWidth = 600;
        const buttonHeight = 400;
        button.style.left = `${(canvasWidth / 2) - (buttonWidth / 2)}px`;  
        button.style.top = `${(canvasHeight / 2) - (buttonHeight / 2)}px`;  
        button.style.width = `${buttonWidth}px`;
        button.style.height = `${buttonHeight}px`;

        button.style.backgroundColor = "white";
        button.style.backgroundColor = "rgb(255,182,104, 0.9)";
        button.style.borderRadius = '20px';
        button.style.outlineColor = "black";

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
        errorBackground.style.borderRadius = '5%';
        errorBackground.style.outlineColor = "black";

        errorBackground.style.cursor = 'pointer';
    
        // Append the button to the button container, positioned relative to the canvas
        errorContainer.appendChild(errorBackground);
        errorContainer.appendChild(button);
        errorContainer.style.display = "block";
        

        // Remove the buttons after 3 seconds
        let timeoutId = setTimeout(() => {
            removeErrorMessage();
        }, 3000);  // 3 seconds

        // Function to remove the error message
        function removeErrorMessage() {
            if (errorContainer.contains(button)) {
                errorContainer.removeChild(button);
                errorContainer.style.display = "none";
            }
            if (errorContainer.contains(errorBackground)) {
                errorContainer.removeChild(errorBackground);
                errorContainer.style.display = "none";
            }
            // Remove the event listener after the error message is gone
            document.removeEventListener('click', clickToRemoveErrorMessage);
        }

        // Event listener for clicking outside the button
        function clickToRemoveErrorMessage(event) {
            if (errorContainer.contains(event.target)) {
                // Remove the error message if the user clicks the background
                removeErrorMessage();
    
                // Cancel the timeout to prevent it from running
                clearTimeout(timeoutId);
            }
        }

        // Add the event listener to detect clicks outside the button
        document.addEventListener('click', clickToRemoveErrorMessage);
    }
    
    // draw rabbit on canvas 
    function drawRabbit(x, y) {
        const rabbitImage = new Image();  // Create a new image object
        rabbitImage.src = 'static/assets/2rabbit.png';  // Set the source to the rabbit image path
    
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
    
    // draws rabbit at starting node of puzzle 
    function loadRabbitToStart(puzzle) {
        const startNode = puzzle.nodes.find(node => node.label.includes("Start"));
    
        if (startNode) { // if start node found 
            drawRabbit(startNode.x, startNode.y);
            return;
        } 
        console.log("Start node not found"); // debugging purposes 
    }
    
    // checks if the node the user clicked was correct 
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
    
    // checks if the carrot node has been reached 
    function isCarrotReached(node) {
        // check if user has correctly reached the carrot 
        if (node.label.includes("Carrot")) {
            return true;
        }
    
        return false;
    }
    
    // displays good job message and shows play again and next level buttons 
    function carrotReached() {
        // display success message 
        calculateAndSaveMetrics();

        // show option to go the next level 
        showCongratsModal();
    }

    // displays good job modal on screen 
    function showCongratsModal() {
        
        // TODO: show carrot found (either on the congrats message or separately beforehand)
        
        const modal = document.getElementById('congratulationsModal');
        modal.style.display = 'flex'; // Make the modal visible
    
        if (curr_level == 3 || curr_level == 6) {
            // Play Again button functionality
            document.getElementById('playAgainButton').addEventListener('click', function() {
                resetLevel();  // Call function to reset the current level
            });
        }
    
        
        // Next Level button functionality
        document.getElementById('nextLevelButton').addEventListener('click', function() {
            window.location.href = next_level_page; // Redirect to next level 

        });
        
    }
    
    // restarts the level 
    function resetLevel() {
        // Logic to reset the level, this could reload the page for now
        window.location.reload(); 
    }
    
    // TODO: implement this 
    // saves data 
    function calculateAndSaveMetrics() {
        // calculate any metrics (like accuracy, time on puzzle, etc)
        // save to browser cookies 
    }

    function randomlySelectCarrotPosition(nodes) {
        // generate random index to place the carrot at
        // excluding the start index 
        var num_nodes = nodes.length;
        var randIndex = Math.floor(Math.random() * (num_nodes - 1)) + 1;

        // assign the carrot to the node label of the random index 
        console.log("Randomly selected node for carrot: " + nodes[randIndex].label);
        nodes[randIndex].label = nodes[randIndex].label + ' (Carrot)';

        return nodes; 
    }

    // TODO: do all of these and implement the methods above 
    // randomly select the carrot position 

    // randomly select the carrot's position among the nodes 
    nodes = randomlySelectCarrotPosition(nodes);

    // create TunnelSystem object storing the puzzle 
    var puzzle = new TunnelSystem(nodes, edges);

    // update path depending on the algorithm for the current level 
    if (curr_level == 1) {
        path = puzzle.dfsPath;
    }
    else {
        path = puzzle.bfsPath;
    }
    console.log("PATH: " + path); // for testing purposes 
    
    // draw puzzle as tunnel system on the UI
    drawGraph(puzzle); 

    // draw rabbit at starting point of the tunnel according to puzzle 
    loadRabbitToStart(puzzle);  

    // store some user data before it is loaded into the browser's cookies 
    var userAllClicks = []; // stores all the clicks the user has made 
    var userCorrectClicks = []; // stores the correct clicks (for comparison with the path to see what the user's next click should be)
    var currIndex = 1; // start at 1 b/c path has 'Start' at index = 0 

});


// TODO: add data saving 

// TODO: ADD MESSAGE OR CARROT IMAGE TO SHOW ONCE THE CARROT HAS BEEN REACHED!!!!!!!


/** 
 * organization considerations: 
 *  - use jsx modules like in HealthSift for better organization 
 *  - allows importing functions and stuff from one file to another 
 *  - could do like tunnelsystem.jsx, visualization.jsx, playGame.jsx maybe 
 */