var issueContainerEl = document.querySelector("#issues-container");

var getRepoIssues = function(repo){
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    fetch(apiUrl).then(function(response){
        // request was successful
        if(response.ok){
            response.json().then(function(data){
                // pass response data to dom function
                listIssues(data);
            });
        }else {
            alert("There was a problem with your request!");
        }
    });
}


var listIssues = function(issues) {

    if (issues.length === 0){
        issueContainerEl.textContent = "This Repo has no open issues!";
        return;
    }

    for(var i=0; i < issues.length; i++) {
        // create a link element to take users to the issues on github
        var issueEl = document.querySelector("a");
        
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

        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        // set to open link in a new tab
        issueEl.setAttribute("target", "_blank");

        issueContainerEl.appendChild(issueEl);

    }
};

getRepoIssues("facebook/react");