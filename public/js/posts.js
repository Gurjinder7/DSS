// Function to load all posts
async function loadPosts() {
    try {
        const response = await fetch("/api/posts");
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
function searchPosts() {
    const filter = document.getElementById('search').value.toUpperCase();
    const posts = document.querySelectorAll('#postsList article');

    posts.forEach(post => {
        const content = post.querySelector('p').textContent.toUpperCase();
        const title = post.querySelector('h3').textContent.toUpperCase();
        const username = post.querySelector('h5').textContent.toUpperCase();

        if (content.includes(filter) || title.includes(filter) || username.includes(filter)) {
            post.style.display = "";
        } else {
            post.style.display = "none";
        }
    });
}

// Add search functionality
document.getElementById("search").addEventListener("keyup", searchPosts);

const showErrorBox = (error) => {
    const errorBox = document.getElementById("posts-error-box");
    
    errorBox.innerHTML = `<p>${error.message}</p>`;
    errorBox.style.display = 'block';

    setTimeout(() => {
        errorBox.innerHTML = "";
        errorBox.style.display = 'none';
    }, 3000);
};