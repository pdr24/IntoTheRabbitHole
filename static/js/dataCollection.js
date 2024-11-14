// TODO: data collection functionality goes here 

// get user key for the current user based on user info 
function getUserKey() {
    let userInfo = JSON.parse(localStorage.getItem('userinfo'));
    let firstName = userInfo.fname;
    let lastInitial = userInfo.linitial;
    let gradeLevel = userInfo.gradelevel;
    let loginTime = userInfo.logintime;

    var key = `${firstName}_${lastInitial}_${gradeLevel}_${loginTime}`;
    console.log('key is ' + key); // testing purposes 

    return key;
}

// save the time spent on an animation page to local storage 
function saveAnimationPageTimeSpent(startTime, algorithm) {
    // calculate time spent on animation page 
    var timeSpentOnAnimationPage = Math.floor(Date.now() / 1000) - startTime;

    var isDFS = false;
    var isBFS = false;

    if (algorithm.toLowerCase() == 'dfs') {
        isDFS = true;
        isBFS = false;
    }
    else {
        isDFS = false;
        isBFS = true;
    }

    // set animation data that will be saved 
    const data = {
        dfs : isDFS,
        bfs : isBFS,
        timespent : timeSpentOnAnimationPage
    }

    // get user key 
    var userKey = getUserKey();

    // Retrieve existing data for this user
    let userData = localStorage.getItem(userKey);
    if (userData) {
        userData = JSON.parse(userData);
    } else {
        userData = {};
    }

    // push animation data to user array 
    //userData.push(animationData);
    if (algorithm.toLowerCase() == 'dfs') {
        userData['dfs_animation'] = data;
    }
    else {
        userData['bfs_animation'] = data;
    }

    // Save updated data back to local storage
    localStorage.setItem(userKey, JSON.stringify(userData));

    // new addition
    localStorage.setItem('mainkey', JSON.stringify(userKey));
}

// save puzzle data as object 
function createPuzzleDataObject(algorithm, isChallengeLevel, startTime, allUserClicks, numCorrectClicks, numIncorrectClicks, carrotLocation) {
    // calculate time spent on animation page 
    var timeSpentOnPuzzle = Math.floor(Date.now() / 1000) - startTime;

    var isDFS = false;
    var isBFS = false;

    if (algorithm.toLowerCase() == 'dfs') {
        isDFS = true;
        isBFS = false;
    }
    else {
        isDFS = false;
        isBFS = true;
    }

    return {
        is_dfs : isDFS,
        is_bfs : isBFS,
        is_challenge_level : isChallengeLevel,
        time_spent : timeSpentOnPuzzle,
        all_user_clicks : allUserClicks,
        num_correct_clicks : numCorrectClicks,
        num_incorrect_clicks : numIncorrectClicks,
        carrot_location : carrotLocation
    }
}

function savePuzzleData(algorithm, isChallengeLevel, startTime, allUserClicks, numCorrectClicks, numIncorrectClicks, carrotLocation) {
    // create object containing puzzle data 
    var puzzleData = createPuzzleDataObject(algorithm, isChallengeLevel, startTime, allUserClicks, numCorrectClicks, numIncorrectClicks, carrotLocation);

    // get user key 
    var userKey = getUserKey();

    // Retrieve existing data for this user
    let userData = localStorage.getItem(userKey);
    if (userData) {
        userData = JSON.parse(userData);
    } else {
        userData = {};
    }

    // Initialize puzzles array if it doesn't exist in userData 
    if (!userData.puzzles) {
        userData.puzzles = [];
    }

    // push puzzle data to userData puzzles array  
    userData.puzzles.push(puzzleData);

    // Save updated data back to local storage
    localStorage.setItem(userKey, JSON.stringify(userData));

    // new addition
    localStorage.setItem('mainkey', JSON.stringify(userKey));
}

export { getUserKey, saveAnimationPageTimeSpent, savePuzzleData };