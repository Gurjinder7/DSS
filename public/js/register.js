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

    try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password, name, email }),
        });
    
        const data = await response.json();

        console.log(data)
    
        if (response.ok) {
          // Successful login
          alert("Succesfully registered!")
          window.location.href = "/";
        } else {
            console.log(data)
          // Show error message
            listApiErrors("api_errors", data )

        }
      } catch (error) {
        console.error("Registration error:", error);
        // showError("An error occurred. Please try again later.");
        listApiErrors("api_errors", error )

      }
})



const showError = (element) => {
    document.getElementById(element).style.display = 'block';
}

const hideAllError = () => {
    // document.querySelectorAll('.error').forEach(elem => {
    //     elem.style.display = 'None';
    // })

    const errorElements = document.querySelectorAll('.error')

    for (const element of errorElements) {
        element.style.display = 'None';   
    }

    const apiErrors = document.getElementById('api_errors');
    while (apiErrors.firstChild) {
        apiErrors.removeChild(apiErrors.firstChild)
    }
}


const listApiErrors = (id, apiError) => {
    
    for (const error of apiError) {
        const list =  document.createElement("li")
        list.textContent = `${error.message}`
        list.classList.add("error")
        document.getElementById(id).appendChild(list)

    }
}

