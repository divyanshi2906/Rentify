document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       MOBILE NAVBAR TOGGLE
    ========================== */

    const toggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    if (toggle && navLinks) {
        toggle.addEventListener("click", function () {
            navLinks.classList.toggle("active");
        });
    }


    /* =========================
       SEARCH TOGGLE (ICON EXPAND)
    ========================== */

    const searchWrapper = document.querySelector(".search-wrapper");
    const searchIcon = document.getElementById("search-icon");
    const searchInput = document.getElementById("search-input");

    if (searchWrapper && searchIcon && searchInput) {

        searchIcon.addEventListener("click", function () {
            searchWrapper.classList.toggle("active");
            searchInput.focus();
        });

    }


    /* =========================
       LIVE BOOK SEARCH FILTER
    ========================== */

    if (searchInput) {

        searchInput.addEventListener("keyup", function () {

            let filter = searchInput.value.toLowerCase();
            let books = document.querySelectorAll(".book-card");

            books.forEach(function (book) {

                let titleElement = book.querySelector("h4");

                if (titleElement) {
                    let title = titleElement.textContent.toLowerCase();

                    if (title.includes(filter)) {
                        book.style.display = "block";
                    } else {
                        book.style.display = "none";
                    }
                }

            });

        });

    }

});
/* =========================
   LOAD BOOKS FROM BACKEND
========================= */

async function loadBooksFromBackend() {

    const container = document.getElementById("book-container");

    if (!container) return;

    try {

        const response = await fetch("http://localhost:5000/books");

        const books = await response.json();

        books.forEach(book => {

            const card = document.createElement("div");
            card.classList.add("book-card");

            card.innerHTML = `
                <img src="${book.image}">
                <h4>${book.title}</h4>
                <p>₹${book.price} / week</p>
                <button>Rent Now</button>
            `;

            container.appendChild(card);

        });

    } catch (error) {

        console.log("Backend not connected yet");

    }

}

loadBooksFromBackend();

/* =========================
   CHECK LOGIN BEFORE BROWSING
========================= */

function checkLogin(){

    let user = localStorage.getItem("userLoggedIn");

    if(user === "true"){
        window.location.href = "browser.html";
    }
    else{
        alert("Please login first");
        window.location.href = "login.html";
    }

}
// login

// document.addEventListener("DOMContentLoaded", function () {

//     const login = document.getElementById("loginForm");
//     const signup = document.getElementById("signupForm");
//     const title = document.getElementById("title");
//     const subtitle = document.getElementById("subtitle");
//     const btn = document.getElementById("toggleBtn");

//     btn.addEventListener("click", function () {

//         login.classList.toggle("active");
//         signup.classList.toggle("active");

//         if (signup.classList.contains("active")) {
//             title.innerText = "Join Rentify!";
//             subtitle.innerText = "Already have an account?";
//             btn.innerText = "Go to Login";
//         } else {
//             title.innerText = "Welcome to Rentify";
//             subtitle.innerText = "Don't have an account?";
//             btn.innerText = "Sign Up";
//         }

//     });

// });
const login = document.getElementById("loginForm");
const signup = document.getElementById("signupForm");
const btn = document.getElementById("toggleBtn");

btn.addEventListener("click", function(){

if(login.classList.contains("active")){
login.classList.remove("active");
signup.classList.add("active");

btn.textContent = "Login";   // ADD THIS LINE

}
else{
signup.classList.remove("active");
login.classList.add("active");

btn.textContent = "Signup";  // ADD THIS LINE

}

});

/* =========================
   LOGIN CHECK
========================= */

function loginUser(){

let id = document.getElementById("userid").value;
let pass = document.getElementById("password").value;

if(id === "admin" && pass === "1234"){

localStorage.setItem("userLoggedIn","true");

alert("Login Successful");

window.location.href = "browser.html";

}
else{
alert("Wrong ID or Password");
}

}


// browser


const API_URL = "http://localhost:3000/api";


// LOAD BOOKS FROM BACKEND
async function loadBooks(){

try{

let response = await fetch(API_URL + "/books");
let books = await response.json();

displayBooks(books);

}
catch(error){
console.log("Error loading books", error);
}

}



// DISPLAY BOOKS
function displayBooks(books){

let container = document.getElementById("bookContainer");

container.innerHTML = "";

books.forEach(book => {

let card = document.createElement("div");

card.classList.add("book-card");

card.innerHTML = `
<img src="${book.image}">
<h3>${book.title}</h3>
<p>${book.author}</p>
<p>₹${book.price}</p>
`;

container.appendChild(card);

});

}


// OPEN PROFILE
function openProfile(){

let user = JSON.parse(localStorage.getItem("user"));

if(!user){
alert("Please login first");
return;
}

document.getElementById("profileModal").style.display="block";

document.getElementById("profileInfo").innerHTML = `
<p>Name: ${user.name}</p>
<p>Email: ${user.email}</p>
`;

loadUserBooks();

}



// OPEN SELL MODAL
function openSell(){
document.getElementById("sellModal").style.display="block";
}



// OPEN DONATE MODAL
function openDonate(){
document.getElementById("donateModal").style.display="block";
}



// SELL BOOK
async function sellBook(){

let user = JSON.parse(localStorage.getItem("user"));

let title = document.getElementById("sellTitle").value;
let author = document.getElementById("sellAuthor").value;
let price = document.getElementById("sellPrice").value;

try{

await fetch(API_URL + "/books",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
title:title,
author:author,
price:price,
type:"sell",
user_id:user.id
})

});

alert("Book added");

document.getElementById("sellModal").style.display="none";

loadBooks();

}
catch(error){
console.log("Error adding book", error);
}

}



// DONATE BOOK
async function donateBook(){

let user = JSON.parse(localStorage.getItem("user"));

let title = document.getElementById("donateTitle").value;
let author = document.getElementById("donateAuthor").value;

try{

await fetch(API_URL + "/books",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
title:title,
author:author,
price:0,
type:"donate",
user_id:user.id
})

});

alert("Book donated");

document.getElementById("donateModal").style.display="none";

loadBooks();

}
catch(error){
console.log("Donation error", error);
}

}



// LOAD USER BOOKS
async function loadUserBooks(){

let user = JSON.parse(localStorage.getItem("user"));

try{

let response = await fetch(API_URL + "/users/" + user.id + "/books");

let books = await response.json();

let container = document.getElementById("userBooks");

container.innerHTML = "";

books.forEach(book => {

container.innerHTML += `<p>${book.title}</p>`;

});

}
catch(error){
console.log("Error loading user books", error);
}

}



// SEARCH BOOK
document.getElementById("searchBar").addEventListener("input", async function(){

let query = this.value;

try{

let response = await fetch(API_URL + "/books/search?q=" + query);

let books = await response.json();

displayBooks(books);

}
catch(error){
console.log("Search error", error);
}

});



// LOAD BOOKS WHEN PAGE LOADS
loadBooks();