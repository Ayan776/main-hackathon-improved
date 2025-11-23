const signingUpUser = () => {
    const userName = document.getElementById("name").value;
    const userEmail = document.getElementById("email").value;
    const userPass = document.getElementById("pass").value;

    if (!userName || !userEmail || !userPass) return alert("Fill all fields!");

    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("pass").value = "";

    localStorage.setItem("email", userEmail);
    localStorage.setItem("pass", userPass);
    alert("Signup successful!");
}

const loginUser = () => {
    const log_email = document.getElementById("log_email").value;
    const log_pass = document.getElementById("log_pass").value;

    const userEmailStored = localStorage.getItem("email");
    const userPassStored = localStorage.getItem("pass");

    if (log_email === userEmailStored && log_pass === userPassStored) {
        alert("Correct information! Redirecting...");
        window.location.href = "post.html";
    } else {
        alert("Information does not match");
    }

    document.getElementById("log_email").value = "";
    document.getElementById("log_pass").value = "";
}

let posts = JSON.parse(localStorage.getItem("posts")) || [];
const posting_feed = document.getElementById("posting_feed");
const userEmailStored = localStorage.getItem("email");

const renderPosts = (postsArray, prepend = true) => {
    posting_feed.innerHTML = "";
    postsArray.forEach(post => {
        const post_card = document.createElement("div");
        post_card.className = "post_card";
        post_card.dataset.id = post.id;

        post_card.innerHTML = `
            <span class="time">${new Date(post.time).toLocaleString()}</span>
            <p class="post_text">${post.text}</p>
            <button class="like_btn">Like</button>
            <span class="like_counter">Likes: ${post.likes.length}</span>
            <button class="del_btn">Delete</button>
        `;

        if (prepend) posting_feed.prepend(post_card);
        else posting_feed.append(post_card);
    });
}

renderPosts(posts);

const postingLogic = () => {
    const postData = document.getElementById("post_area").value;
    if (!postData) return;

    const postID = Date.now();
    const time = new Date().toISOString();
    const post = {
        id: postID,
        text: postData,
        time: time,
        likes: []
    };

    posts.push(post);
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts(posts);

    document.getElementById("post_area").value = "";
};

posting_feed.addEventListener("click", (event) => {
    const postCard = event.target.closest(".post_card");
    if (!postCard) return;
    const postId = +postCard.dataset.id;
    const post = posts.find(p => p.id === postId);

    if (event.target.classList.contains("like_btn")) {
        if (!post.likes.includes(userEmailStored)) {
            post.likes.push(userEmailStored);
            event.target.nextElementSibling.innerText = "Likes: " + post.likes.length;
            localStorage.setItem("posts", JSON.stringify(posts));
        }
    }

    if (event.target.classList.contains("del_btn")) {
        posts = posts.filter(p => p.id !== postId);
        localStorage.setItem("posts", JSON.stringify(posts));
        postCard.remove();
    }
});

const search_posts = document.getElementById("search_posts");
search_posts.addEventListener("input", () => {
    const search_value = search_posts.value.toLowerCase();
    const filtered_posts = posts.filter(post => post.text.toLowerCase().includes(search_value));
    renderPosts(filtered_posts);
});

const old_btn = document.getElementById("old_btn");
old_btn.addEventListener("click", () => {
    const sortedOldest = [...posts].sort((a, b) => a.id - b.id);
    renderPosts(sortedOldest, false);
});

const new_btn = document.getElementById("new_btn");
new_btn.addEventListener("click", () => {
    renderPosts(posts);
});
