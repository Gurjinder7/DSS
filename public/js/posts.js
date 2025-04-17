

// Function to load posts made by user who is currently logged in
async function loadPosts() {

    // Load posts data
    const post_response = await fetch("../json/posts.json");
    const post_data = await post_response.json();

    const login_response = await fetch("../json/login_attempt.json");
    const login_data = await login_response.json();

    let postList = document.getElementById('postsList');

    // Remove current posts
    for(let i = 0; i < postList.children.length; i++) {
        if(postList.children[i].nodeName === "article") {
            postList.removeChild(postList.children[i]);
        }
    }

    // Add all recorded posts
    for(let i = 0; i < post_data.length; i++) {
        const author = post_data[i].username;
        const timestamp = post_data[i].timestamp;
        const title = post_data[i].title;
        const content = post_data[i].content;
        const postId = post_data[i].postId;

        const postContainer = document.createElement('article');
        postContainer.classList.add("post");
        const fig = document.createElement('figure');
        postContainer.appendChild(fig);

        const postIdContainer = document.createElement("p");
        postIdContainer.textContent = postId;
        postIdContainer.hidden = true;
        postId.id = "postId";
        postContainer.appendChild(postIdContainer);

        const img = document.createElement('img');
        const figcap = document.createElement('figcaption');
        fig.appendChild(img);
        fig.appendChild(figcap);
        
        const titleContainer = document.createElement('h3');
        titleContainer.textContent = title;
        figcap.appendChild(titleContainer);
        
        const usernameContainer = document.createElement('h5');
        usernameContainer.textContent = author;
        figcap.appendChild(usernameContainer);

        const timeContainer = document.createElement('h5');
        timeContainer.textContent = timestamp;
        figcap.appendChild(timeContainer);

        const contentContainer = document.createElement('p');
        contentContainer.textContent = content;
        figcap.appendChild(contentContainer);

        postList.insertBefore(postContainer, document.querySelectorAll("article")[0]);
    }
}

loadPosts();

// Function to filter posts on page using search bar
function searchPosts() {

    let searchBar = document.getElementById('search');

    // Get contents of search bar
    let filter = searchBar.value.toUpperCase();

    let postList = document.getElementById('postsList');
    let posts = postList.getElementsByTagName('article');

    // Loop through all posts, and hide ones that don't match the search
    for (i = 0; i < posts.length; i++) {

        // Search body of post
        let content = posts[i].getElementsByTagName('p')[0];
        let postContent = content.textContent || content.innerText;

        // Search title of post
        let title = posts[i].getElementsByTagName("h3")[0];
        let titleContent = title.textContent || title.innerText;

        // Search username of post
        let username = posts[i].getElementsByTagName("h5")[0];
        let usernameContent = username.textContent || username.innerText;

        // Change display property of post depending on if it matches search query
        if (postContent.toUpperCase().indexOf(filter) > -1 || titleContent.toUpperCase().indexOf(filter) > - 1 ||
             usernameContent.toUpperCase().indexOf(filter) > - 1) {
            posts[i].style.display = "";
        } else {
            posts[i].style.display = "none";
        }
    }
}

// Search posts whenever the user types
if(document.getElementById("search")) {
    document.getElementById("search").addEventListener("keyup", searchPosts);
}


const getPosts = async () => {
    try {
        const response = await fetch("/api/posts");
    
        const data = await response.json();

        console.log(data)
    
        if (response.ok) {
          // Successful login
          alert("Retrieved all posts")
    
        } else {
            console.log(data)
          // Show error message
            // listApiErrors("api_errors", data )
            showErrorBox('posts-error-box',data)
        }
      } catch (error) {
        console.error("Registration error:", error);
        // showError("An error occurred. Please try again later.");
        // listApiErrors("api_errors", error )

      }
}


const filterPosts = async () => {
    try {
        const response = await fetch("/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password, name, email }),
        });
    
        const data = await response.json();

        console.log(data)
    
        if (response.ok) {
          alert("Succesfully registered!")
        } else {
            console.log(data)

        }
      } catch (error) {
        console.error("Registration error:", error);

      }   
}

const searchPostsApi = async () => {
    try {
        const response = await fetch("/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password, name, email }),
        });
    
        const data = await response.json();

        console.log(data)
    
        if (response.ok) {
          alert("Succesfully registered!")
        } else {
            console.log(data)

        }
      } catch (error) {
        console.error("Registration error:", error);
      }   
}

const showErrorBox = (error) => {
    const errorBox = document.getElementById("posts-error-box");
    
    errorBox.innerHTML = `<p>${error.message}</p>`
    errorBox.style.display = 'block';

    setTimeout(() => {
    errorBox.innerHTML = "";
    errorBox.style.display = 'none';
    }, 3000)
}