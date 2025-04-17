// Function to load posts made by user who is currently logged in
async function loadPosts() {

    // Load posts data
    const post_response = await fetch("../json/posts.json");
    const post_data = await post_response.json();

    // Load login data
    const login_response = await fetch("../json/login_attempt.json");
    const login_data = await login_response.json();

    // Remove current posts
    let postList = document.getElementById('myPosts');

    for(let i = 0; i < postList.children.length; i++) {
        if(postList.children[i].nodeName == "article") {
            postList.removeChild(postList.children[i]);
        }
    }

    // Add posts made by current user
    for(let i = 0; i < post_data.length; i++) {
        
        let author = post_data[i].username;

        // Check usernames match on each post
        if(author === login_data.username) {
            let timestamp = post_data[i].timestamp;
            let title = post_data[i].title;
            let content = post_data[i].content;
            let postId = post_data[i].postId;

            let postContainer = document.createElement('article');
            postContainer.classList.add("post");
            let fig = document.createElement('figure');
            postContainer.appendChild(fig);

            let postIdContainer = document.createElement("h6");
            postIdContainer.textContent = postId;
            postIdContainer.hidden = true;
            postId.id = "postId";
            postContainer.appendChild(postIdContainer);

            let img = document.createElement('img');
            let figcap = document.createElement('figcaption');
            fig.appendChild(img);
            fig.appendChild(figcap);
            
            let titleContainer = document.createElement('h3');
            titleContainer.textContent = title;
            figcap.appendChild(titleContainer);
            
            let usernameContainer = document.createElement('h5');
            usernameContainer.textContent = author;
            figcap.appendChild(usernameContainer);

            let timeContainer = document.createElement('h5');
            timeContainer.textContent = timestamp;
            figcap.appendChild(timeContainer);

            let contentContainer = document.createElement('p');
            contentContainer.id = "content";
            contentContainer.textContent = content;
            figcap.appendChild(contentContainer);

            let editBtn = document.createElement('button');
            editBtn.classList.add('editBtn');
            editBtn.textContent = "Edit";
            editBtn.addEventListener("click", editPost);
            postContainer.appendChild(editBtn);

            let delBtn = document.createElement('button');
            delBtn.classList.add('delBtn');
            delBtn.textContent = "Delete";
            delBtn.addEventListener("click", deletePost);
            postContainer.appendChild(delBtn);

            postList.insertBefore(postContainer, document.querySelectorAll("article")[0]);
        }
    }
}

loadPosts();

// Function to remove a post from the page after clicking delete - this is also reflected on the server side
function deletePost(e) {

    // Put post in object to be the body of fetch request
    const post = {
        postId:document.getElementsByTagName('h6')[0].textContent, 
    };

    const requestHeaders = {
        "Content-Type": "application/json"
    };

    // Delete post
  fetch('/deletepost', {
    method: 'POST',
    headers: requestHeaders,
    body:JSON.stringify(post)
  });

  // Hide element on button click so deletion appears immediate
  e.target.parentNode.hidden = true;
}

// Function to edit post
function editPost(e) {

    // Get post that the user clicked on
    let post = e.target.parentNode;
   
    // Fill out form fields with data grabbed from post
    document.getElementById("title_field").value = post.getElementsByTagName('h3')[0].textContent;
    document.getElementById("content_field").value = post.getElementsByTagName('p')[0].textContent;
    document.getElementById("postId").value = post.getElementsByTagName('h6')[0].textContent;

    // Scroll user to post form
    document.getElementById("postForm").scrollIntoView({behavior: "smooth"});

}

// Function to filter posts on page using search bar
function searchPosts() {

    let searchBar = document.getElementById('search');

    // Get contents of search bar
    let filter = searchBar.value.toUpperCase();

    let postList = document.getElementById('myPosts');
    let posts = postList.getElementsByTagName('article');

    // Loop through all posts, and hide ones that don't match the search
    for (i = 0; i < posts.length; i++) {

        // Search body of post
        let content = posts[i].getElementsByTagName('p')[0];
        let postContent = content.textContent || content.innerText;

        // Search title of post
        let title = posts[i].getElementsByTagName("h3")[0];
        let titleContent = title.textContent || title.innerText;

        // Search username
        let username = posts[i].getElementsByTagName("h5")[0];
        let usernameContent = username.textContent || username.innerText;

        // Change display property of posts depending on whether it matches the search or not
        if (postContent.toUpperCase().indexOf(filter) > -1 || titleContent.toUpperCase().indexOf(filter) > - 1 ||
             usernameContent.toUpperCase().indexOf(filter) > - 1) {
            posts[i].style.display = "";
        } else {
            posts[i].style.display = "none";
        }
    }
}

document.getElementById("search").addEventListener("keyup", searchPosts);

const searchPostsApi = async () => {
    try {
        const response = await fetch("/api/posts/id", {
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

const getUserPosts = async () => {
    try {
        const response = await fetch("/api/posts/id");
    
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

const editUserPost = async () => {
    try {
        const response = await fetch("/api/posts/id", {
          method: "PUT",
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

const deleteUserPost = async () => {
    try {
        const response = await fetch("/api/posts/id", {
          method: "DELETE",
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

const createUserPost = async () => {
    try {
        const response = await fetch("/api/posts/id", {
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
    const errorBox = document.getElementById("mypost-error-box");
    
    errorBox.innerHTML = `<p>${error.message}</p>`
    errorBox.style.display = 'block';

    setTimeout(() => {
    errorBox.innerHTML = "";
    errorBox.style.display = 'none';
    }, 3000)
}