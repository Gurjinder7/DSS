# DSS Food Blog
This is the front-end for your DSS Blog. It has a "Login" page, a "Home" page, a "Posts" page, and a "My Posts" page. It includes
functional login, plus search, add, edit and delete of posts using local JSON files. You will update the functionality through the completion of your assignment.

# Logging In
At the moment, logins are hardcoded. The username is "username" and the password is "password" in plaintext.

# Handling Posts
Posts can be searched using the search bar. See my_posts.js or posts.js for the function that handles this.
Posts can be edited or deleted from the "My Posts" page. Editing posts is handled by deleting the original post and inserting the new post in its place. See app.js for the POST request which handles this.

# Loading Posts
Posts are loaded from a local JSON file called posts.json. Posts are loaded on three different pages: "Home", "Posts", and "My Posts".

# Security Considerations
## Passwords
- Hashing with SHA-256 or better
- Unique salt for each password (stored separately from passwords)
- Pepper - same for all passwords (stored separately from passwords and salts)
- NIST password guidelines
  - Check against list of common passwords
  - Recommended length
  - Check if personal info (name, DoB etc.) is in password

## SQL Injection
- Sanitise inputs
- Search boxes
- Login form
- Post creation

## Authentication
- OAuth?
- 2-Factor Auth

# CSRF
- Double-submitted cookies
- Tokens

# XSS
- Whitelisting/allowlisting
- Escaping characters

# Account Enumeration
- Don’t give different feedback for invalid username or password, make it the same message
- Authentication should take the same amount of time with an incorrect username or password
