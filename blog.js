import { addDoc, auth, collection, db, doc, getDoc, onAuthStateChanged , onSnapshot, orderBy, query, serverTimestamp } from "./firebase.config.js";

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
    const authorName = document.getElementById("authorName").value ;
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
      authorName,
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


const blogsContainer = document.getElementById("blogsContainer");
const filterButtons = document.querySelectorAll(".category-filters button");

let allBlogs = [];

// format firestore timestamp
const formatDate = (timestamp) => {
  if (!timestamp) return "";
  return timestamp.toDate().toLocaleDateString();
};

// render blogs
// cut description
function truncateWords(text, wordLimit = 20) {
  if (!text) return "";
  const words = text.split(/\s+/); // split by spaces
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "...";
}


const renderBlogs = (blogs) => {
  if (!blogsContainer) return;
  blogsContainer.innerHTML = "";

  blogs.forEach((blog) => {
    const shortDescription = truncateWords(blog.description, 40); // first 40 words

    blogsContainer.innerHTML += `
      <div class="blog-card">
        <img src="${blog.coverImg}" alt="${blog.title}">
        <div class="content">
          <h3>${blog.title}</h3>
          <div class="blog-meta">By ${blog.authorName} • ${formatDate(blog.createdAt)}</div>
          <p>${shortDescription}</p>
          <button onclick="viewDetails('${blog.id}')">View Details</button>
        </div>
      </div>
    `;
  });
};



// live listener
const q = query(
  collection(db, "blogs"),
  orderBy("createdAt", "desc")
);

onSnapshot(q, (snapshot) => {
  allBlogs = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  renderBlogs(allBlogs);
});

// filter logic
filterButtons?.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const category = btn.dataset.category;

    if (category === "all") {
      renderBlogs(allBlogs);
    } else {
      const filtered = allBlogs.filter(
        blog => blog.category === category
      );
      renderBlogs(filtered);
    }
  });
});

// navigate to detail page
window.viewDetails = (id) => {
  window.location.href = `./blog-detail.html?id=${id}`;
};



// blog details



const blogDetail = document.getElementById("blogDetail");

if (blogDetail) {
  const params = new URLSearchParams(window.location.search);
  const blogId = params.get("id");

  if (!blogId) {
    console.error("Blog ID missing in URL");
    blogDetail.innerHTML = "<p>Blog not found</p>";
  } else {
    const getBlog = async () => {
      try {
        const docRef = doc(db, "blogs", blogId);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const blog = snap.data();
          blogDetail.innerHTML = `
            <h1>${blog.title}</h1>
            <p>By ${blog.authorName}</p>
            <img src="${blog.coverImg}">
            <p>${blog.description}</p>
          `;
        } else {
          blogDetail.innerHTML = "<p>Blog not found</p>";
        }
      } catch (err) {
        console.error(err);
        blogDetail.innerHTML = "<p>Error loading blog</p>";
      }
    };

    getBlog();
  }
}

