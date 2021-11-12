var userFormEl = document.querySelector('#user-form');
var nameInputEl = document.querySelector('#username');
var repoContainerEl = document.querySelector('#repo-containers');
var repoSearchTerm = document.querySelector('#repo-search-term');
var languageButtonsEl = document.querySelector("#language-buttons");

var getUserRepos = function(user) {
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make request to the url
    fetch(apiUrl).then(function(response){
        // if request is successful
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data, user);
                console.log(data);
            }); 
        }else {
            alert("Error: Github User Not Found");
        }
    })
    .catch(function(error){
        // notice this '.catch()' getting chained onto the end of the '.then()'
        alert("Unable to connect to Github");
    });
};

var formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from input element
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);

        // clear old content
        repoContainerEl.textContent = "";
        nameInputEl.value = "";
    }else {
        alert("Please enter a Github username");
    }
    //console.log(event);
};

var buttonClickHandler = function(event){
    var language = event.target.getAttribute("data-language");
    
    if (language) {
        getFeaturedRepos(language);

        //clear old content
        repoContainerEl.textContent = "";
    }
}


var displayRepos = function(repos, searchTerm) {
    
    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = 'No Repositories Found.';
        console.log(repos.length);
        return;
    }

    repoSearchTerm.textContent = searchTerm;

    // loop over repos and get repo owner + login / repo names
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;
        // create a container for each repo
        var repoEl = document.createElement('a');
        // add classes to repoEl
        repoEl.classList = "list-item flex-row justify-content-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        // create a span element to hold repository name
        var titleEl = document.createElement('span');
        // add classes to repoNameEl
        titleEl.textContent = repoName;

        //append to container
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not with if statement
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        }else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }
        // append to container 
        repoEl.appendChild(statusEl);

        //append container to the dom
        repoContainerEl.appendChild(repoEl);
    }

};

var getFeaturedRepos = function(language){
    var apiUrl= "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";
    
    fetch(apiUrl).then(function(response){
        if(response.ok) {
            response.json().then(function(data){
                displayRepos(data.items, language);
            });
        } else {
            alert('Error: Github User Not Found');
        }
    });
};

// add event listeners to form
userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);