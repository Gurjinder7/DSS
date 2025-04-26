// Error message handling
function showError(message) {
  const existingError = document.getElementById("login_error");
  if (existingError) {
    existingError.remove();
  }

  const errorMsg = document.createElement("p");
  errorMsg.id = "login_error";
  errorMsg.textContent = message;
  errorMsg.classList.add("error");

  const form = document.getElementById("loginForm");
  const submitButton = form.querySelector('button[type="submit"]');
  form.insertBefore(errorMsg, submitButton);
}

// Form submission handler
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  // Input validation
  if (!username || !password) {
    showError("Please fill in both username and password fields.");
    return;
  }

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Successful login
      window.location.href = "/";
    } else {
      // Show error message
      showError(data.message || "Login failed. Please check your credentials.");
    }
  } catch (error) {
    console.error("Login error:", error);
    showError("An error occurred. Please try again later.");
  }
});

const showErrorBox = (error) => {
  const errorBox = document.getElementById("login-error-box");

  errorBox.innerHTML = `<p>${error.message}</p>`;
  errorBox.style.display = "block";

  setTimeout(() => {
    errorBox.innerHTML = "";
    errorBox.style.display = "none";
  }, 3000);
};
