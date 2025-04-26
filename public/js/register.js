// import { showErrorBox } from "../../src/utils/api-error-notification";

document.getElementById("regForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  hideAllError();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  // Validate inputs
  let hasError = false;

  // Name validation
  if (name.length < 2) {
    showError("name_error", "Name must be at least 2 characters long");
    hasError = true;
  }
  if (/\d/.test(name)) {
    showError("name_error", "Name should not contain numbers");
    hasError = true;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError("email_error", "Please enter a valid email address");
    hasError = true;
  }

  // Username validation
  if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(username)) {
    showError(
      "username_error",
      "Username must start with a letter and contain only letters and numbers"
    );
    hasError = true;
  }
  if (username.length < 3) {
    showError("username_error", "Username must be at least 3 characters long");
    hasError = true;
  }

  // Password validation
  if (password.length < 8) {
    showError("password_error", "Password must be at least 8 characters long");
    hasError = true;
  }
  if (!/[A-Z]/.test(password)) {
    showError(
      "password_error",
      "Password must contain at least one uppercase letter"
    );
    hasError = true;
  }
  if (!/[a-z]/.test(password)) {
    showError(
      "password_error",
      "Password must contain at least one lowercase letter"
    );
    hasError = true;
  }
  if (!/[0-9]/.test(password)) {
    showError("password_error", "Password must contain at least one number");
    hasError = true;
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    showError(
      "password_error",
      "Password must contain at least one special character"
    );
    hasError = true;
  }

  if (hasError) return;

  try {
    showLoader();
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, name, email }),
    });

    const data = await response.json();

    if (response.ok) {
      showSuccessMessage(
        "Registration successful! Redirecting to login page..."
      );
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } else {
      if (response.status === 400) {
        // Handle validation errors (like username/email already exists)
        showErrorBox(data.message);
      } else {
        showErrorBox("An unexpected error occurred. Please try again later.");
      }
      hideLoader();
    }
  } catch (error) {
    console.error("Registration error:", error);
    showErrorBox("An error occurred. Please try again later.");
    hideLoader();
  }
});

const showError = (elementId, message) => {
  const element = document.getElementById(elementId);
  element.textContent = message;
  element.style.display = "block";
};

const hideAllError = () => {
  const errorElements = document.querySelectorAll(".error");
  errorElements.forEach((element) => {
    element.style.display = "none";
    element.textContent = "";
  });

  const apiErrors = document.getElementById("api_errors");
  apiErrors.innerHTML = "";
};

const listApiErrors = (id, errors) => {
  const container = document.getElementById(id);
  container.innerHTML = "";

  errors.forEach((error) => {
    const list = document.createElement("li");
    list.textContent = error.message || error;
    list.classList.add("error");
    container.appendChild(list);
  });
};

const showErrorBox = (message) => {
  const errorBox = document.getElementById("register-error-box");
  errorBox.innerHTML = `<p>${message}</p>`;
  errorBox.style.display = "block";

  setTimeout(() => {
    errorBox.innerHTML = "";
    errorBox.style.display = "none";
  }, 3000);
};

const showSuccessMessage = (message) => {
  const errorBox = document.getElementById("register-error-box");
  errorBox.style.backgroundColor = "#4CAF50";
  errorBox.innerHTML = `<p>${message}</p>`;
  errorBox.style.display = "block";

  setTimeout(() => {
    errorBox.innerHTML = "";
    errorBox.style.display = "none";
    errorBox.style.backgroundColor = "";
  }, 3000);
};
