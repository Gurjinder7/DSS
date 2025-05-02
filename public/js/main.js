
(() => {
    document.querySelector("#login_link").textContent = sessionStorage.getItem('username');
})()