const searchBtn = document.getElementById("searchBtn");
const usernameInput = document.getElementById("username");
const profileDiv = document.getElementById("profile");
const reposDiv = document.getElementById("repos");
const errorDiv = document.getElementById("error");
const repoTitle = document.getElementById("repoTitle");

searchBtn.addEventListener("click", fetchUser);
usernameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") fetchUser();
});

function fetchUser() {
    const username = usernameInput.value.trim();

    if (username === "") {
        alert("Please enter a GitHub username");
        return;
    }

    errorDiv.textContent = "";
    profileDiv.innerHTML = "";
    reposDiv.innerHTML = "";
    repoTitle.textContent = "";

    fetch(`https://api.github.com/users/${username}`)
        .then(res => {
            if (!res.ok) throw new Error("User not found");
            return res.json();
        })
        .then(user => displayProfile(user))
        .catch(err => errorDiv.textContent = err.message);

    fetch(`https://api.github.com/users/${username}/repos`)
        .then(res => res.json())
        .then(repos => displayRepos(repos));
}

function displayProfile(user) {
    profileDiv.innerHTML = `
        <img src="${user.avatar_url}">
        <div class="profile-info">
            <h2>${user.name || "No Name"}</h2>
            <p>@${user.login}</p>
            <p>${user.bio || "No bio available"}</p>
            <p>${user.location || "Location not specified"}</p>
            <div class="stats">
                👥 Followers: ${user.followers} |
                Following: ${user.following}
            </div>
            <a href="${user.html_url}" target="_blank">View GitHub Profile</a>
        </div>
    `;
}

function displayRepos(repos) {
    repoTitle.textContent = "📁 Public Repositories";

    repos.forEach(repo => {
        const card = document.createElement("div");
        card.className = "repo-card";

        card.innerHTML = `
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            <p>${repo.description || "No description"}</p>
            ⭐ Stars: ${repo.stargazers_count}
        `;
        reposDiv.appendChild(card);
    });
}