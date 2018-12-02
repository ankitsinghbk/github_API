class GITHUB {

    constructor() {
        this.client_ID = 'efda6083885bbc9b5b7c';
        this.client_SECREAT = '08a299cd18de40b35758fdd46a350b2790e2fff3';
        this.BASE = 'https://api.github.com/users/';
    }

    async ajaxUser(userValue) {
        const userURL = `${this.BASE}${userValue}?client_id='${this.client_ID}'&client_secret='${this.client_SECREAT}'`;
        const reposURL = `${this.BASE}${userValue}/repos?client_id='${this.client_ID}'&client_secret='${this.client_SECREAT}'`;

        const userData = await fetch(userURL);
        const user = await userData.json();

        
        const reposData = await fetch(reposURL);
        const repos = await reposData.json();

        return {
            user,
            repos
        };
    }
}
class UI {

    constructor() {

    }

    showFeedBack(text) {
        const feedback = document.querySelector('.feedback');
        feedback.classList.add('showItem');
        feedback.innerHTML = `<p>${text}</p>`;

        setTimeout(() => { feedback.classList.remove('showItem') }, 3000);
    }


    getUser(user) {
        const { 
            avatar_url: image,
            html_url: link,
            public_repos: repos,
            name,
            login,
            message } = user;
            
            if(message === "Not Found"){
                this.showFeedBack('no such user exists,please enter a valid value');
            } else {
                this.displayUser(image, link, repos, name, login);
                const searchUser = document.getElementById('searchUser');
                searchUser.value = ""; 
            }
    }

    displayUser(image, link, repos, name, login){
        console.log(image, link, repos, name, login);
        const userList = document.getElementById('github-users');
        const div = document.createElement('div');
        div.classList.add('row', 'single-user', 'my-3');
        div.innerHTML = `
        <div class=" col-sm-6 col-md-4 user-photo my-2">
        <img src="${image}" class="img-fluid" alt="">
       </div>
       <div class="col-sm-6 col-md-4 user-info text-capitalize my-2">
        <h6>name : <span>${name}</span></h6>
        <h6>blog : <a href="#" class="badge badge-primary">blog</a> </h6>
        <h6>github : <a href="${link}" class="badge badge-primary">link</a> </h6>
        <h6>public repos : <span class="badge badge-success">${repos}</span> </h6>
       </div>
       <div class=" col-sm-6 col-md-4 user-repos my-2">
        <button type="button" data-id= "${login}" id="getRepos" class="btn reposBtn text-capitalize mt-3">
         get repos
        </button>
       </div>
        `
        userList.appendChild(div);
    }

    displayRepos(userID, repos){
        const resposBtn = document.querySelectorAll('[data-id]');
        resposBtn.forEach(btn => {
            if(btn.dataset.id === userID){
                const parent = btn.parentNode;

                repos.forEach( repo => {
                    const p = document.createElement('p');
                    p.innerHTML = `
                        <p><a href='${repos.html_url}'>${repo.name}</a></p>
                    `
                    parent.appendChild(p);
                });
            }
        })
    }
}





(function () {

    const ui = new UI();
    const github = new GITHUB();

    const searchForm = document.getElementById("searchForm");
    const search = document.getElementById("searchUser");
    const userList = document.getElementById("github-users");

    searchForm.addEventListener("submit", event => {
        event.preventDefault();
        const textValue = search.value;

        if (textValue == "") {
            ui.showFeedBack("Please Enter the Correct User");
        } else {
            github
            .ajaxUser(textValue)
            .then(data => ui.getUser(data.user))
            .catch(error => console.log(error));
        }
    });


    userList.addEventListener("click", event => {
        if(event.target.classList.contains("reposBtn")){
            const userID = event.target.dataset.id;
            github
            .ajaxUser(userID)
            .then(data => ui.displayRepos(userID,data.repos))
            .catch(error => console.log(error))
        }
    })

})();
