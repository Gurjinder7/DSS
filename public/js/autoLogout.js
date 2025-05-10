const timeOutInterval = 600000;

let timeHook = null;
 

// document.cookie = "test1=Hello; SameSite=None; Secure";
 

const initializeTimeHook = () => {
 
    if (timeHook === null) {
        timeHook = setTimeout(() => {
            destroyTimeHook()
            logout()
        }, timeOutInterval);
 
    }
 
}
 

const destroyTimeHook = () => {
    clearTimeout(timeHook)
    timeHook = null
}
 
const resetTimeHook = () => {
    destroyTimeHook()
    initializeTimeHook()
}
 

const setUpListeners = () => {
 
    document.addEventListener('mousemove', () => {
        resetTimeHook()
    })
}
 
const destroyListeners = () => {
    document.removeEventListener('mousemove', () => {
        resetTimeHook()
    })
 
}
 
const logout = async () => {
 
  

    try {
        const response = await fetch("/api/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": getCSRFToken()
          },
        //   body: JSON.stringify({ username, password }),
        });
    
        // const data = await response.json();
    
        if (response.ok) {
            destroyListeners()
            // clearEverything()
            alert('You are being logged out!')
            localStorage.clear()
            sessionStorage.clear()
            window.location.reload()
        
          }
            else {
             //   showError(data.message || "Logout failed.");
        }
      } catch (error) {
        console.error("Logout error:", error);
        // showError("An error occurred. Please try again later.");
      }
 
}
 

const clearEverything = () => {
 
    localStorage.clear()
    sessionStorage.clear()
    // window.location.href = '/'
}
 
(() => {
 
    destroyTimeHook()
    initializeTimeHook()
    setUpListeners()

})()