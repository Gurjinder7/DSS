// Function to add the latest 2 posts to the home page
async function loadLatestPosts() {
    try {
        const response = await fetch("/api/posts", {
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": getCSRFToken()
            }
        });
        const posts = await response.json();

        if (!response.ok) {
            throw new Error(posts.message || "Failed to load posts");
        }

        // Remove current posts from page
        const postList = document.getElementById('postsList');
        const articles = postList.querySelectorAll("article");
        articles.forEach(article => article.remove());

        // Get the last 2 posts (newest posts)
        const latestPosts = posts.slice(0, 2);

        // Load latest 2 posts
        latestPosts.forEach(post => {
            const postContainer = document.createElement('article');
            postContainer.classList.add("post");
            
            const fig = document.createElement('figure');
            postContainer.appendChild(fig);

            const figcap = document.createElement('figcaption');
            fig.appendChild(figcap);
            
            const titleContainer = document.createElement('h3');
            titleContainer.textContent = post.title;
            figcap.appendChild(titleContainer);
            
            const usernameContainer = document.createElement('h5');
            usernameContainer.textContent = post.username;
            figcap.appendChild(usernameContainer);

            const timeContainer = document.createElement('h5');
            timeContainer.textContent = new Date(post.created_at).toLocaleString();
            figcap.appendChild(timeContainer);

            const contentContainer = document.createElement('p');
            contentContainer.textContent = post.content;
            figcap.appendChild(contentContainer);

            const likesContainer = document.createElement('div');
            likesContainer.classList.add('likes-container');
            likesContainer.innerHTML = `<i class="fa fa-heart"></i> <span>${post.likes || 0}</span>`;
            figcap.appendChild(likesContainer);

            // Insert before the "See More Posts" link
            const seeMoreLink = postList.querySelector(".link_btn").parentElement;
            postList.insertBefore(postContainer, seeMoreLink);
        });
    } catch (error) {
        console.error("Error loading posts:", error);
        showErrorBox({ message: "Failed to load latest posts. Please try again later." });
    }
}

// Load latest posts when page loads
loadLatestPosts();

const getLastTwoPosts = async () => {
    try {
        const response = await fetch("/api/posts", {
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": getCSRFToken()
            }
        });
    
        const data = await response.json();

        console.log(data)
    
        if (response.ok) {
          // Successful login
          alert("Retrieved all posts")
    
        } else {
            console.log(data)
          // Show error message
            // listApiErrors("api_errors", data )
        }
      } catch (error) {
        console.error("Registration error:", error);
        // showError("An error occurred. Please try again later.");
        // listApiErrors("api_errors", error )

      }
}

const showErrorBox = (error) => {
    const errorBox = document.getElementById("index-error-box");
    
    errorBox.innerHTML = `<p>${error.message}</p>`;
    errorBox.style.display = 'block';

    setTimeout(() => {
        errorBox.innerHTML = "";
        errorBox.style.display = 'none';
    }, 3000);
};