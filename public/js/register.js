document.getElementById("regForm").addEventListener("submit", async (e) => {
    e.preventDefault(); 

    hideAllError();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    console.log(name, email, username, password)

    // TODO: Add validations for each field
    // length checks on each
    // pattern check on name for numbers
    // email check for pattern
    showError('password_error')
})



const showError = (element) => {
    document.getElementById(element).style.display = 'block';
}

const hideAllError = () => {
    document.querySelectorAll('.error').forEach(elem => {
        elem.style.display = 'None';
    })
}

