// Error message handling
function showError(message) {
  const errorBox = document.getElementById("login-error-box");
  errorBox.innerHTML = `<p>${message}</p>`;
  errorBox.style.display = "block";

  setTimeout(() => {
    errorBox.innerHTML = "";
    errorBox.style.display = "none";
  }, 3000);
}

let userId = null;
let verificationTimer = null;

function startVerificationTimer() {
  let timeLeft = 300; // 5 minutes in seconds
  const timerElement = document.getElementById("codeTimer");

  if (verificationTimer) {
    clearInterval(verificationTimer);
  }

  verificationTimer = setInterval(() => {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `Code expires in: ${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;

    if (timeLeft <= 0) {
      clearInterval(verificationTimer);
      showError("Verification code has expired. Please login again.");
      hideVerificationForm();
    }
  }, 1000);
}

function showVerificationForm() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("verificationForm").style.display = "block";
  document.getElementById("verificationCode").value = "";
  startVerificationTimer();
}

function hideVerificationForm() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("verificationForm").style.display = "none";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  if (verificationTimer) {
    clearInterval(verificationTimer);
  }
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
        "X-CSRF-Token": getCSRFToken(),
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.requiresVerification) {
        // 2FA is enabled and verification is required
        userId = data.userId;
        showVerificationForm();
      } else {
        // 2FA is disabled or verification is not required
        window.location.href = "/";
      }
    } else {
      showError(data.message || "Login failed. Please check your credentials.");
    }
  } catch (error) {
    console.error("Login error:", error);
    showError("An error occurred. Please try again later.");
  }
});

// 2FA Verification form submission handler
document
  .getElementById("verificationForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const code = document.getElementById("verificationCode").value.trim();

    if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
      showError("Please enter a valid 6-digit verification code.");
      return;
    }

    try {
      const response = await fetch("/api/verify-2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": getCSRFToken(),
        },
        body: JSON.stringify({ userId, code }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = "/";
      } else {
        showError(data.message || "Invalid verification code.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      showError("An error occurred. Please try again later.");
    }
  });
