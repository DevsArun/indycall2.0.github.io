let callInterval;
let seconds = 0;
let activeInput = "targetNumber";

// --- STARTUP LOGIC ---
window.onload = () => {
    updateUI();
    loadCoins();
    loadHistory();
};

// --- DYNAMIC UI TOGGLE ---
function updateUI() {
    const isLogged = localStorage.getItem("userLogged") === "true";
    const name = localStorage.getItem("userName");

    const loggedInDiv = document.getElementById("loggedInHeader");
    const loggedOutDiv = document.getElementById("loggedOutHeader");

    if (isLogged) {
        if (loggedOutDiv) loggedOutDiv.style.display = "none";
        if (loggedInDiv) loggedInDiv.style.display = "block";
        document.getElementById("userNameDisplay").innerText = "Hi, " + name;
    } else {
        if (loggedOutDiv) loggedOutDiv.style.display = "block";
        if (loggedInDiv) loggedInDiv.style.display = "none";
    }
}

// --- GOOGLE AUTH HANDLER ---
function handleCredentialResponse(response) {
    const responsePayload = decodeJwtResponse(response.credential);
    localStorage.setItem("userLogged", "true");
    localStorage.setItem("userName", responsePayload.name);
    updateUI();
    loadCoins();
    alert("Welcome " + responsePayload.name);
}

function decodeJwtResponse(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(jsonPayload);
}

function logout() {
    localStorage.removeItem("userLogged");
    localStorage.removeItem("userName");
    window.location.reload();
}

// --- DATA LOADING ---
function loadCoins() {
    let coins = localStorage.getItem("coins") || 0;
    let plan = localStorage.getItem("plan");
    const display = document.getElementById("coinBalance");
    if (!display) return;

    if (plan === "unlimited") {
        display.innerText = "Unlimited";
    } else {
        display.innerText = coins;
    }
}

function loadHistory() {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    let list = document.getElementById("historyList");
    if (!list) return;

    list.innerHTML = "";
    history.slice(-5).reverse().forEach(num => {
        let li = document.createElement("li");
        li.innerText = "📞 " + num;
        list.appendChild(li);
    });
}

// --- CALLING LOGIC ---
function checkLogin() {
    // TODO: Enable login check when auth is implemented
    return true;
}

function addNumber(num) {
    document.getElementById(activeInput).value += num;
}

function makeCall() {
    if (!checkLogin()) return;

    const target = document.getElementById("targetNumber").value;

    if (target.length < 5) {
        alert("Enter valid number");
        return;
    }

    // TODO: Enable coins check when payment system is implemented
    // let coins = parseInt(localStorage.getItem("coins") || 0);
    // let plan = localStorage.getItem("plan");
    // if (plan !== "unlimited" && coins < 100) {
    //     alert("Insufficient coins (100 required)");
    //     window.location.href = "pages/shop.html";
    //     return;
    // }

    // Show Overlay
    document.getElementById("callOverlay").style.display = "flex";
    document.getElementById("callingNumber").innerText = target;

    // Simulate Connection
    setTimeout(() => {
        document.getElementById("callingStatus").innerText = "Connected";
        startTimer();

        // TODO: Enable coin deduction when payment system is implemented
        // let coins = parseInt(localStorage.getItem("coins") || 0);
        // let plan = localStorage.getItem("plan");
        // if (plan !== "unlimited") {
        //     coins -= 100;
        //     localStorage.setItem("coins", coins);
        //     document.getElementById("coinBalance").innerText = coins;
        // }

        // Save to History
        let history = JSON.parse(localStorage.getItem("history")) || [];
        history.push(target);
        localStorage.setItem("history", JSON.stringify(history));
        loadHistory();
    }, 3000);
}

function startTimer() {
    seconds = 0;
    callInterval = setInterval(() => {
        seconds++;
        let mins = Math.floor(seconds / 60);
        let secs = seconds % 60;
        document.getElementById("callTimer").innerText =
            (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs);
    }, 1000);
}

function endCall() {
    clearInterval(callInterval);
    document.getElementById("callOverlay").style.display = "none";
    document.getElementById("callTimer").innerText = "00:00";
    document.getElementById("callingStatus").innerText = "Calling...";
}
