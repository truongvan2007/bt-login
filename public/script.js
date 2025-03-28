document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/users')
        .then(response => response.json())
        .then(data => {
            const userList = document.getElementById('user-list');
            data.forEach(user => {
                const li = document.createElement('li');
                li.textContent = `${user.id} - ${user.name}`;
                userList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching users:', error));
});

function setCookie(name, value, daysToLive){
    const date = new Date();
    date.setTime(date.getTime() + (daysToLive*24*60*60*1000));
    let expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/`;

}
function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        let [key, value] = cookie.split("=");
        if (key === name) return value;
    }
    return "";
}

function showWelcome() {
    const welcomeMessage = document.getElementById("welcome-message");
    welcomeMessage.innerText = "Xin chào, " + getCookie("remembered_user") + "!";
}

document.addEventListener("DOMContentLoaded", showWelcome);
