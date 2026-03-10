const API = "https://varta-b.onrender.com"

async function loginUser(){

let username=document.getElementById("username").value
let password=document.getElementById("password").value

let res=await fetch(API+"/login",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
username:username,
password:password
})
})

let data=await res.json()

alert(data.message)

if(data.status=="success"){
window.location="chat.html"
}

}


async function signupUser(){

let username=document.getElementById("signup_username").value
let password=document.getElementById("signup_password").value

let res=await fetch(API+"/signup",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
username:username,
password:password
})
})

let data=await res.json()

alert(data.message)

  }
