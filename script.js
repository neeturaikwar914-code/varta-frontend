// Firebase imports for chat only
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

// Firebase config (for chat only)
const firebaseConfig = {
  apiKey: "AIzaSyAiM6QdDhiQp1lOiQeY-Ox_mg2u_Oeuyk8",
  authDomain: "varta-75b84.firebaseapp.com",
  projectId: "varta-75b84",
  storageBucket: "varta-75b84.appspot.com",
  messagingSenderId: "743844712654",
  appId: "1:743844712654:web:1b951c55840b21bad4009f",
  measurementId: "G-9FBWQPXHVF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const backendURL = "https://varta-b.onrender.com"; // Backend deployed URL

// Signup via backend
window.signupUser = async function() {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const username = document.getElementById("signup-username").value;

  try {
    const res = await fetch(`${backendURL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username })
    });
    const data = await res.json();
    if(res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("uid", data.uid);
      localStorage.setItem("username", username);
      alert("Signup successful!");
      window.location.href = "chat.html";
    } else {
      alert(data.error);
    }
  } catch(err) {
    alert(err.message);
  }
}

// Login via backend
window.loginUser = async function() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const res = await fetch(`${backendURL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if(res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("uid", data.uid);
      localStorage.setItem("username", data.username);
      window.location.href = "chat.html";
    } else {
      alert(data.error);
    }
  } catch(err) {
    alert(err.message);
  }
}

// Logout
window.logoutUser = function() {
  localStorage.clear();
  window.location.href = "login.html";
}

// Chat functionality
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

  const username = localStorage.getItem("username") || "User";
  await addDoc(collection(db, "messages"), { username, text, timestamp: serverTimestamp() });
  input.value = "";
    }
