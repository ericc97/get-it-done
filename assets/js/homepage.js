var getUserRepo = function() {
    fetch("https://api.github.com/user/octocat/repos");
}

getUserRepo();