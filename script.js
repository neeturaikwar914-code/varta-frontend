// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAiM6QdDhiQp1lOiQeY-Ox_mg2u_Oeuyk8",
  authDomain: "varta-75b84.firebaseapp.com",
  projectId: "varta-75b84",
  storageBucket: "varta-75b84.appspot.com",
  messagingSenderId: "743844712654",
  appId: "1:743844712654:web:1b951c55840b21bad4009f",
  measurementId: "G-9FBWQPXHVF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Signup function
window.signupUser = async function() {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const username = document.getElementById("signup-username").value;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await addDoc(collection(db, "users"), { uid: user.uid, username, email });
    alert("Account created successfully!");
    window.location.href = "login.html";
  } catch (error) {
    alert(error.message);
  }
}

// Login function
window.loginUser = async function() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "chat.html";
  } catch (error) {
    alert(error.message);
  }
}

// Logout
window.logoutUser = function() {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
}

// Chat functions
const messagesDiv = document.getElementById("messages");
const messagesCol = collection(db, "messages");
const q = query(messagesCol, orderBy("timestamp"));

if(messagesDiv) {
  onSnapshot(q, (snapshot) => {
    messagesDiv.innerHTML = "";
    snapshot.forEach((doc) => {
      const msg = doc.data();
      messagesDiv.innerHTML += `<p><b>${msg.username}:</b> ${msg.text}</p>`;
    });
  });
}

window.sendMessage = async function() {
  const input = document.getElementById("message-input");
  const text = input.value.trim();
  if(!text) return;
  const user = auth.currentUser;
  if(!user) return alert("Not logged in");
  const username = "User"; // Optional: fetch from Firestore if needed
  await addDoc(collection(db, "messages"), { uid: user.uid, username, text, timestamp: serverTimestamp() });
  input.value = "";
}
