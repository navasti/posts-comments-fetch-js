    const postsURL = `https://jsonplaceholder.typicode.com/posts`;
    const commentsURL = `https://jsonplaceholder.typicode.com/comments`;
    const main = document.querySelector('main')
    const input = document.querySelector('input');
    const infoSpan = document.querySelector('header span');

    // search/filter
    const filterByTitle = e => {
        const h2 = [...document.querySelectorAll('.post h2')];
        const posts = [...document.querySelectorAll('.post')];
        const value = e.target.value;
        const results = document.querySelector('.results');
        let filtered = h2.filter(h2 => h2.textContent.toLowerCase().includes(value.toLowerCase()))
        posts.forEach(post => post.classList.remove("display-none", "filtered"));
        results.classList.remove('active')
        if(value){
            posts.forEach(post => post.classList.add("display-none"))
            filtered.forEach(h2 => h2.parentNode.classList.add("filtered"))
            results.classList.add('active')
            results.textContent = `Posts found: ${filtered.length}`
        }
    }
    input.addEventListener('input', filterByTitle)

    // expand comments div
    const expandComments = e => {
        const post = e.target.parentNode.parentNode;
        const comment = [...post.querySelectorAll('.comment')];
        const arrow = post.querySelector('.fa-chevron-down');
        comment.forEach(com => com.classList.toggle('hidden'));
        arrow.classList.toggle('active');
    }

    // fetching posts
    fetch(postsURL)
    .then(response => response.json())
    .then(data => {
        const posts = data.slice(0,20)
        main.textContent = "";
        for(let i=0; i<posts.length; i++){
            const singlePost = document.createElement('article');
            const title = posts[i].title;
            const titleUppercase = title.charAt(0).toUpperCase() + title.slice(1);
            const body = posts[i].body;
            const bodyUppercase = body.charAt(0).toUpperCase() + body.slice(1);
            singlePost.className = "post";
            singlePost.innerHTML = `
            <h2>${titleUppercase}</h2>
            <p>${bodyUppercase}</p>
            <div class="show-comments">
                <span>Show comments</span>
                <i class="fas fa-chevron-down"></i>
            </div>`
            main.appendChild(singlePost); 
        }
    })
    .catch(error => console.log(error))

    // fetching comments
    const fetchComments = () => {
        fetch(commentsURL)
        .then(response => response.json())
        .then(data => {
            const posts = [...document.querySelectorAll('.post')];
            const comments = data.slice(0, 80);
            const showCommentsBtns = [...document.querySelectorAll('.show-comments')]
            for(let i=0; i<comments.length; i++){
                const singleComment = document.createElement('div');
                singleComment.className = "comment hidden";
                const name = comments[i].name;
                const nameUppercase = name.charAt(0).toUpperCase() + name.slice(1);
                const body = comments[i].body;
                const bodyUppercase = body.charAt(0).toUpperCase() + body.slice(1);
                singleComment.innerHTML = `
                    <div class="details">
                        <i class="fas fa-user"></i>
                        <div class="user">
                            <span>${comments[i].email}</span>
                            <p>${nameUppercase}</p>
                        </div>
                    </div>
                    <p class="comment-text">${bodyUppercase}</p>
                `;
                if(i < 20) posts[i].appendChild(singleComment);
                else if(i < 40) posts[i - 20].appendChild(singleComment);
                else if(i < 60) posts[i - 40].appendChild(singleComment);
                else if(i < 80) posts[i - 60].appendChild(singleComment);
            }
            showCommentsBtns.forEach(btn => btn.addEventListener('click', expandComments));
            infoSpan.innerHTML = `Posts: ${posts.length}</br> Comments: ${comments.length}`;
        })
        .catch(error => console.log(error))
    }
    setTimeout(fetchComments, 500);
    