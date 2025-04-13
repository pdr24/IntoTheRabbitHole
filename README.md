# IntoTheRabbitHole 

__Link to live version:__ https://pdr24.github.io/IntoTheRabbitHole/

__Post-Survey Link:__  https://utsa.az1.qualtrics.com/jfe/form/SV_81eYGUcKmOSXXjE

__Paper Link:__ *Coming soon to* https://doi.org/10.1145/3724363.3729080


## Overview

IntoTheRabbitHole was developed by Pragathi Durga Rajarajan in the Engaging Computing Group at the University of Texas at San Antonio under the guidance of Dr. Fred Martin. It is a software tool for teaching middle school children about Depth First Search (DFS) and Breadth First Search (BFS) in an interactive format. It introduces children to DFS and BFS through animations, and then has the children help a character rabbit find its hidden carrot using DFS and BFS. 

IntoTheRabbitHole's graphs represent real-world tunnels so the rabbit (as agent) adheres to real-world logic. For instance, in IntoTheRabbitHole's DFS/BFS traversal, the rabbit can only move between nodes directly connected by an edge. The backtracking the rabbit must follow in IntoTheRabbitHole adds complexity to DFS/BFS paths but was retained as a useful abstraction to introduce DFS/BFS at a high-level.

*A full paper on IntoTheRabbitHole has been accepted to ITiCSE 2025*

## Using IntoTheRabbitHole

IntoTheRabbitHole can be accessed through the live link at the top of this README. Alternatively, our repository can be cloned and opened in Visual Studio Code, where you can then open index.html in a browser using the 'Live Server' extension. IntoTheRabbitHole works best on computers.

## Limitations 

IntoTheRabbitHole only displays one graph throughout the game. In future work, it will be expanded to display different graphs for the graph traversal puzzles. Also, IntoTheRabbitHole does not demonstrate canonical DFS/BFS exactly. Instead, it includes backtracking in order to introduce DFS/BFS concepts at a high-level. 
