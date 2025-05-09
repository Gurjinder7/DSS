document.addEventListener('DOMContentLoaded', () => {
    sessionStorage.setItem('id', document.getElementById('id').textContent)
    sessionStorage.setItem('username', document.getElementById('username').textContent)
    window.location.href='/'

})