var repoNameEl = document.querySelector("#repo-name");
var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");


var getRepoIssues = function(repo){
    // format the github api url
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    // make a get request to url
    fetch(apiUrl).then(function(response){
        // request was successful
        if(response.ok){
            response.json().then(function(data){
                // pass response data to dom function
                listIssues(data);

                // check if api has paginated issues
                if (response.headers.get("link")) {
                    displayWarning(repo);
                  
                }
            });
        }else {
            // if not successful, redirect to home page
            document.location.replace("./index.html");
        }
    });
}

var getRepoName = function() {

    // grab repo name from url query string
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];

    if (repoName) {
        // display repo name on the page
        repoNameEl.textContent = repoName;
    
        getRepoIssues(repoName);
      } else {
        // if no repo was given, redirect to the homepage
        document.location.replace("./index.html");
      }

};

var displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on Github.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    // set to open in a new tab
    linkEl.setAttribute("target", "_blank");

    //append to warning container
    limitWarningEl.appendChild(linkEl);
    
};


var listIssues = function(issues) {

    if (issues.length === 0){
        issueContainerEl.textContent = "This Repo has no open issues!";
        return;
    }
    // loop over given issues
    for(var i=0; i < issues.length; i++) {
        // create a link element to take users to the issues on github
        var issueEl = document.createElement("a");

        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        // set to open link in a new tab
        issueEl.setAttribute("target", "_blank");
        
        //create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append to container
        issueEl.appendChild(titleEl);

        // create a type element
        var typeEl = document.createElement("span");

        //check if issue is an actual issue or a pull request
        if (issues[i].pull_request){
            typeEl.textContent = "(Pull Request)";
        }else {
            typeEl.textContent = "(issue)";
        }
        //append to container
        issueEl.appendChild(typeEl);

        issueContainerEl.appendChild(issueEl);
    }
};

getRepoName();