// login elements
const login = document.querySelector(".login");
const loginForm = document.querySelector(".login_form");
const loginInput = document.querySelector(".login_input");

// chat elements
const chat = document.querySelector(".CHAT");
const chatForm = document.querySelector(".chat_form");
const chatInput = document.querySelector(".chat_input");
const chatMessages = document.querySelector(".chat_messages");

const colors = [
    "cadetblue", 
    "aqua",
    "blueviolet",
    "burlywood",
    "chocolate",
    "bisque",
    "pink",
    "royalblue",
    "goldenrod",
    "greenyellow",
    "sieena",
    "gold",
    "darkkhaki"
];
const user = {id: "", name: "", color: ""};
let webSocket;

function createMessageSelfElement(content){
    const div = document.createElement("div");
    div.classList.add("message_self");
    div.innerHTML = content

    return div;
};

function createMessageOtherement(content, sender, senderColor){
    const div = document.createElement("div");
    const span = document.createElement("span");

    div.classList.add("message_other");
    div.classList.add("message_self");
    span.classList.add("message_send");
    span.style.color = senderColor

    div.appendChild(span);
    span.innerHTML = sender;
    div.innerHTML+= content;

    return div;
};


function getColor(){
    const indexColor = Math.floor(Math.random() * colors.length);
    return colors[indexColor];
};

function scrollScreen(){
    window.scrollTo({
        top: document.body.scroll,
        behavior: "smooth"
    })
};

function processMessage({ data }){
    const { userId, userName, userColor, content} = JSON.parse(data);

    const message = 
        userId === user.id 
        ? createMessageSelfElement(content)
        :createMessageOtherement(content, userName, userColor);

    chatMessages.appendChild(message);

    scrollScreen();
};

function loginSubmit(event){
    event.preventDefault();

    user.id = crypto.randomUUID();
    user.name = loginInput.value;
    user.color = getColor();

    login.style.display = "none";
    chat.style.display = "flex";

    webSocket = new WebSocket("ws://localhost:8080");
    webSocket.onmessage = processMessage;
};

function sendMessage(event){
    event.preventDefault();

    const messages = {
        userId : user.id,
        userName : user.name,
        userColor : user.color,
        content: chatInput.value
    };

    webSocket.send(JSON.stringify(messages));

    chatInput.value = "";
};

loginForm.addEventListener("submit", loginSubmit);
chatForm.addEventListener("submit", sendMessage);