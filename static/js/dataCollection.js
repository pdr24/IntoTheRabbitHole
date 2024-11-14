// TODO: data collection functionality goes here 

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
    const animationData = {
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
        userData = [];
    }

    // push animation data to user array 
    userData.push(animationData);

    // Save updated data back to local storage
    localStorage.setItem(userKey, JSON.stringify(userData));

    // new addition
    localStorage.setItem('mainkey', JSON.stringify(userKey));
}

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

export { getUserKey, saveAnimationPageTimeSpent };