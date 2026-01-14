const blogForm = document.getElementById("blogForm");

blogForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("categories").value;
    const coverImgFile = document.getElementById("cover-img").files[0];

    console.log({ title, description, category, coverImgFile });

    // You can now send this object to Firebase
});