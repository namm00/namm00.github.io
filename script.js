/* =================================
   MOBILE MENU
================================= */

const menuButton =
    document.getElementById("menu-button");

const navLinks =
    document.getElementById("nav-links");


menuButton.addEventListener("click", function () {

    navLinks.classList.toggle("open");

});



/* =================================
   CLOSE MOBILE MENU
   WHEN CLICKING A LINK
================================= */

const links =
    navLinks.querySelectorAll("a");


links.forEach(function (link) {

    link.addEventListener("click", function () {

        navLinks.classList.remove("open");

    });

});



/* =================================
   DARK MODE
================================= */

const themeButton =
    document.getElementById("theme-button");


themeButton.addEventListener("click", function () {

    document.body.classList.toggle("dark");


    if (document.body.classList.contains("dark")) {

        themeButton.textContent = "☀️";

    } else {

        themeButton.textContent = "🌙";

    }

});



/* =================================
   FAQ
================================= */

const faqQuestions =
    document.querySelectorAll(".faq-question");


faqQuestions.forEach(function (question) {

    question.addEventListener("click", function () {

        const faqItem =
            question.parentElement;


        faqItem.classList.toggle("open");

    });

});