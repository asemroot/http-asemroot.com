const translations = {

ar: {
projects: "المشاريع",
contact: "تواصل معنا",
why: "لماذا ASEM؟",
start: "ابدأ مشروعك مجانًا",
contactBtn: "تواصل معنا",
description: "مشاريع رقمية مجانية وحلول برمجية مخصصة للأفراد والشركات حول العالم",
email: "البريد الرسمي"
},

en: {
projects: "Projects",
contact: "Contact Us",
why: "Why ASEM?",
start: "Start Your Free Project",
contactBtn: "Contact Us",
description: "Free digital projects and custom software solutions for individuals and companies worldwide",
email: "Official Email"
},

fr: {
projects: "Projets",
contact: "Contact",
why: "Pourquoi ASEM ?",
start: "Commencez votre projet gratuitement",
contactBtn: "Nous contacter",
description: "Projets numériques gratuits et solutions logicielles personnalisées",
email: "Email officiel"
},

ja: {
projects: "プロジェクト",
contact: "お問い合わせ",
why: "なぜASEMなのか",
start: "無料でプロジェクトを開始",
contactBtn: "お問い合わせ",
description: "個人や企業向けの無料デジタルプロジェクトとカスタムソリューション",
email: "公式メール"
}

};



function applyLanguage(lang){

const t = translations[lang] || translations.en;


document.documentElement.lang = lang;


document.documentElement.dir =
lang === "ar" ? "rtl" : "ltr";



const projectsTitle =
document.querySelector("#projects h2");

if(projectsTitle)
projectsTitle.textContent=t.projects;



const contactTitle =
document.querySelector("#contact h2");

if(contactTitle)
contactTitle.textContent=t.contact;



const heroText =
document.querySelector(".hero p");

if(heroText)
heroText.textContent=t.description;



const buttons =
document.querySelectorAll(".btn");


if(buttons[0])
buttons[0].textContent=t.start;


if(buttons[1])
buttons[1].textContent=t.contactBtn;



localStorage.setItem("lang",lang);

}



const browserLang =
navigator.language
.split("-")[0]
.toLowerCase();



let savedLang =
localStorage.getItem("lang");



let currentLang =
savedLang ||
(translations[browserLang]
? browserLang
: "en");



applyLanguage(currentLang);



const langSwitch =
document.getElementById("langSwitch");


if(langSwitch){

langSwitch.value=currentLang;


langSwitch.addEventListener(
"change",
function(){

applyLanguage(this.value);

});

}





const darkButton =
document.getElementById("dark-btn");



function updateDark(){

if(!darkButton)
return;


if(document.body.classList.contains("dark")){

darkButton.textContent="☀️";

}else{

darkButton.textContent="🌙";

}

}



if(localStorage.getItem("dark")==="true"){

document.body.classList.add("dark");

}


updateDark();



if(darkButton){

darkButton.addEventListener("click",()=>{


document.body.classList.toggle("dark");


localStorage.setItem(
"dark",
document.body.classList.contains("dark")
);


updateDark();


});

}
