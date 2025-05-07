// Function to load all posts
async function loadPosts() {
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

        // Remove current posts
        const postList = document.getElementById('postsList');
        const articles = postList.querySelectorAll("article");
        articles.forEach(article => article.remove());

        // Add all posts
        posts.forEach(post => {
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

            postList.insertBefore(postContainer, postList.querySelector("article:first-child"));
        });
    } catch (error) {
        console.error("Error loading posts:", error);
        showErrorBox({ message: "Failed to load posts. Please try again later." });
    }
}

// Load posts when page loads
loadPosts();

// Function to filter posts on page using search bar
async function searchPosts() {
    try {
        const searchTerm = document.getElementById('search').value;
        
        if (!searchTerm.trim()) {
            return loadPosts(); // If search is empty, load all posts
        }

        const response = await fetch(`/api/posts/search?searchTerm=${encodeURIComponent(searchTerm)}`, {
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": getCSRFToken()
            }
        });

        const posts = await response.json();

        if (!response.ok) {
            throw new Error(posts.message || "Failed to search posts");
        }

        // Remove current posts
        const postList = document.getElementById('postsList');
        const articles = postList.querySelectorAll("article");
        articles.forEach(article => article.remove());

        // Add filtered posts
        posts.forEach(post => {
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

            postList.insertBefore(postContainer, postList.querySelector("article:first-child"));
        });
    } catch (error) {
        console.error("Error searching posts:", error);
        showErrorBox({ message: "Failed to search posts. Please try again later." });
    }
}

// Add search functionality with debounce
let searchTimeout;
document.getElementById("search").addEventListener("keyup", (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        searchPosts();
    }, 300); // Wait 300ms after user stops typing
});

const showErrorBox = (error) => {
    const errorBox = document.getElementById("posts-error-box");
    
    errorBox.innerHTML = `<p>${error.message}</p>`;
    errorBox.style.display = 'block';

    setTimeout(() => {
        errorBox.innerHTML = "";
        errorBox.style.display = 'none';
    }, 3000);
};