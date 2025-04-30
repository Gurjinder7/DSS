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
          },
        //   body: JSON.stringify({ username, password }),
        });
    
        const data = await response.json();
    
        if (response.ok) {
            destroyListeners()
            // clearEverything()
            alert('You are being logged out!')
            localStorage.clear()
            sessionStorage.clear()
            window.location.href = "/login";
        
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
 
    const cookies = document.cookie.split("; ");
    for (let c = 0; c < cookies.length; c++) {
 
        const d = window.location.hostname.split(".");
 
        while (d.length > 0) {
            const cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
            const p = location.pathname.split('/');
 
            document.cookie = cookieBase + '/';
 
            while (p.length > 0) {
                document.cookie = cookieBase + p.join('/');
                p.pop();
            };
 
            d.shift();
 
        }
 
    }
 

    localStorage.clear()
    sessionStorage.clear()
    // window.location.href = '/'
}
 
(() => {
 
    destroyTimeHook()
    initializeTimeHook()
    setUpListeners()

})()