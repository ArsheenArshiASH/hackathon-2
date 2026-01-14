import{auth , createUserWithEmailAndPassword , sendEmailVerification, signInWithEmailAndPassword , signInWithPopup, GoogleAuthProvider, db, doc, addDoc, collection, serverTimestamp} from "./firebase..config.js"

// sign up with email

const signUpForm = document.getElementById("sigUpForm") ;
const logInForm = document.getElementById("logInForm") ;

const buttonWrapper = document.querySelector("button-wrapper");

// validation function

function isValidPassword(password) {
  const minLength = 6;
  const hasNumber = /\d/;
  const hasUppercase = /[A-Z]/;

  return password.length >= minLength && hasNumber.test(password) && hasUppercase.test(password);
}

async function signUpWithEmail  (e) {
e.preventDefault() ;
console.log(e);


const name = document.getElementById("name").value ;
const email = document.getElementById("email").value ;
const password = document.getElementById("Password").value ;
const confirmPassword = document.getElementById("confirmPassword").value ;
const errorMsg = document.getElementById("errorMsg") ;

errorMsg.innerHTML = "" ;
// check one 
if(password !== confirmPassword) {
errorMsg.textContent = "Password does not match confirm again" ;
return ;}

// check two
if (!isValidPassword(password)) {
  errorMsg.textContent = "Password must be at least 8 characters long, contain 1 uppercase letter and 1 number.";
  return; 
}

try {
const userCredential =  await createUserWithEmailAndPassword(auth, email, password) ;
const user = userCredential.user;

await Swal.fire({
  title: "SIGN UP",
  text: "User Sign UP Successfuly",
  icon: "success" ,
  timer: 1500 ,
});

window.localtion.href = "/pages/create"
try {
const verification =  await sendEmailVerification(auth.currentUser) ;

 await Swal.fire({
  title: "Email Verification",
  text: "Email verification sent successfuly you can verify now or later",
  icon: "success" ,
  iconColor: "green" ,
  timer: 1500 ,
  });

} catch (error) {
 console.log(error.code)
}

console.log(user)

} catch (error) {
  console.log(error.code) ;
  if(error.code == "auth/email-already-in-use") {
  await Swal.fire({
  title: "Error",
  text: "User Already Exists Please Log In",
  icon: "error",
  timer: 2000
   });
  }

}

signUpForm.reset();
}


signUpForm?.addEventListener("submit" , signUpWithEmail) ;


// log in function

const loginUserWithEmail = async (e) => {
e.preventDefault() ;
const name = document.getElementById("name").value ;
const email = document.getElementById("email").value ;
const password = document.getElementById("Password").value ;
const errorMsgLogin = document.getElementById("errorMsgLogin") ;
errorMsgLogin.innerText = "" ;
try {
const userCredential = await signInWithEmailAndPassword(auth ,email , password) ;
const user = userCredential.user;
console.log(user) ;
await Swal.fire(
  {
  title: "Login Successfuly",
  text: "login successfuly redirecting to blog pag",
  icon: "success",
  timer: 1500 
  }
)
logInForm.reset() ;
window.location.href = "/pages/create.html";
} catch (error) {
if(error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
  errorMsgLogin.innerText = "Invalid Email or Password"
}else{
  await Swal.fire(
  {
  title: "Something Went Wrong",
  text: "Please try again later",
  icon: "question",
  iconColor: "red" ,
  timer: 1500 
  }
)
}
}

}

logInForm?.addEventListener("submit" , loginUserWithEmail) ;


// sign in with google

const provider = new GoogleAuthProvider();


const googleBtn = document.getElementById("signInWithGoogle");

provider.setCustomParameters({ prompt: "select_account" });

const signInWithGoogle = async () => {
  try {
  const result = await signInWithPopup(auth,provider);
  console.log(">>>>>>>> ", result.user);
   window.location.replace("/blogs.html");
  } catch (error) {
    console.log(error.code);
  }
};

googleBtn?.addEventListener("click" , signInWithGoogle) ;


