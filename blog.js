import { addDoc, auth, collection, db, onAuthStateChanged , serverTimestamp } from "./firebase.config.js";

const blogForm = document.getElementById("blogForm");

// for cloudinary
const preset = "mini-hackathon";
const cloudName = "dtc8tzwkc";

const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Image upload failed");
  }

  const data = await res.json();
  return data.secure_url; 

};

// creating blogs
const createBlog = async () => {
  try {
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const category = document.getElementById("categories").value;
    const coverImgFile = document.getElementById("cover-img").files[0];

    if (!title || !description || !category || !coverImgFile) {
      alert("All fields are required");
      return;
    }

    // 1️⃣ Upload image to Cloudinary
    const coverImgURL = await uploadImageToCloudinary(coverImgFile);

    // 2️⃣ Save blog to Firestore
    await addDoc(collection(db, "blogs"), {
      title,
      description,
      category,
      coverImg: coverImgURL, // ✅ cloudinary link
      authorId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });

    await Swal.fire({
      title: "Well Done",
      text: "Blog Created Successfuly",
      icon: "success",
      timer: 1500,
    })

  } catch (error) {
    console.error("Error creating blog:", error);
    alert("Something went wrong");
  }
};

// calling on auth change

blogForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      createBlog();
    } else {
      if (window.location.pathname === "/pages/create.html") {
        window.location.replace("/pages/login.html");
      }
    }
  });
});


// get all  blogs and display it in ui
