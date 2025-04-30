// Function to load posts made by user who is currently logged in
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
        let postList = document.getElementById('myPosts');
        const articles = postList.querySelectorAll("article");
        articles.forEach(article => article.remove());

        // Add posts made by current user
        posts.forEach(post => {
            const postContainer = document.createElement('article');
            postContainer.classList.add("post");
            postContainer.dataset.postId = post.id; // Store post ID in data attribute

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
            contentContainer.id = "content";
            contentContainer.textContent = post.content;
            figcap.appendChild(contentContainer);

            const editBtn = document.createElement('button');
            editBtn.classList.add('editBtn');
            editBtn.textContent = "Edit";
            editBtn.addEventListener("click", editPost);
            postContainer.appendChild(editBtn);

            const delBtn = document.createElement('button');
            delBtn.classList.add('delBtn');
            delBtn.textContent = "Delete";
            delBtn.addEventListener("click", deletePost);
            postContainer.appendChild(delBtn);

            postList.insertBefore(postContainer, postList.querySelector("article:first-child"));
        });
    } catch (error) {
        console.error("Error loading posts:", error);
        showErrorBox({ message: "Failed to load posts. Please try again later." });
    }
}

// Load posts when page loads
loadPosts();

// Function to remove a post
async function deletePost(e) {
    try {
        const postContainer = e.target.closest('article');
        const postId = postContainer.dataset.postId;

        const response = await fetch(`/api/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": getCSRFToken()
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to delete post");
        }

        // Remove post from DOM only after successful deletion
        postContainer.remove();
    } catch (error) {
        console.error("Error deleting post:", error);
        showErrorBox({ message: error.message || "Failed to delete post. Please try again later." });
    }
}

// Function to edit post
function editPost(e) {
    const postContainer = e.target.closest('article');
    
    // Fill out form fields with data from post
    document.getElementById("title_field").value = postContainer.querySelector('h3').textContent;
    document.getElementById("content_field").value = postContainer.querySelector('p').textContent;
    document.getElementById("postId").value = postContainer.dataset.postId;

    // Change button text to Update
    document.getElementById("post_button").textContent = "Update";

    // Scroll user to post form
    document.getElementById("postForm").scrollIntoView({behavior: "smooth"});
}

// Handle form submission for creating/editing posts
document.getElementById("postForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const title = document.getElementById("title_field").value;
    const content = document.getElementById("content_field").value;
    const postId = document.getElementById("postId").value;

    try {
        let url = '/api/posts';
        let method = 'POST';

        // If postId exists, we're editing an existing post
        if (postId) {
            url = `/api/posts/${postId}`;
            method = 'PUT';
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": getCSRFToken()
            },
            body: JSON.stringify({ title, content })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to save post");
        }

        // Clear form
        document.getElementById("postForm").reset();
        document.getElementById("postId").value = '';
        // Reset button text to Post
        document.getElementById("post_button").textContent = "Post";

        // Reload posts to show the new/updated post
        await loadPosts();
    } catch (error) {
        console.error("Error saving post:", error);
        showErrorBox({ message: error.message || "Failed to save post. Please try again later." });
    }
});

// Function to filter posts on page using search bar
function searchPosts() {
    const filter = document.getElementById('search').value.toUpperCase();
    const posts = document.querySelectorAll('#myPosts article');

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
    const errorBox = document.getElementById("mypost-error-box");
    
    errorBox.innerHTML = `<p>${error.message}</p>`;
    errorBox.style.display = 'block';

    setTimeout(() => {
        errorBox.innerHTML = "";
        errorBox.style.display = 'none';
    }, 3000);
};