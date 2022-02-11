// FOOD = Flavored Object Of Digestion

let food = [];
let updater = "";
const progressBar = document.getElementById("progressBarValue");

setInterval(function() {
    checkInputAvailability();
}, 100);

async function getFood() {
    const country = document.getElementById("countries").value;
    const postalCode = document.getElementById("postalCode").value;
    const searchTerm = document.getElementById("searchTerm").value;
    const openChecked = document.getElementById("openedResCheck").checked;
    const closeChecked = document.getElementById("closedResCheck").checked;
    const data = {
        type: "listRequest",
        country,
        postalCode,
        searchTerm,
        openChecked,
        closeChecked
    };
    updateProgress();
    const response = await makePOSTRequest(data);
    const json = await response.json();

    // Styling for response messages
    const Style = {
        base: [
          "color: #fff",
          "background-color: #444",
          "padding: 2px 4px",
          "border-radius: 2px"
        ],
        warning: [
          "color: #eee",
          "background-color: orange"
        ],
        error: [
            "color: #eee",
            "background-color: red"
          ],
        success: [
          "background-color: green"
        ]
      }
    const log = (text, extra = []) => {
    let style = Style.base.join(';') + ';';
    style += extra.join(';'); // Add any additional styles
    console.log(`%c${text}`, style);
    }

    clearProgressInterval();

    if (json.statusCode === 200){
        log("Request status: " + json.status, Style.success);
        if (json.foodItemList !== "") {
            food = json.foodItemList.split(";;");
        } else {
            food = "No results found";
        }
    }
    else if (json.statusCode === 304) {
        log("Request status: " + json.status, Style.warning);
        if (json.foodItemList !== "") {
            food = json.foodItemList.split(";;");
        } else {
            food = "No results found";
        }
    }
    else {
        log("Request status: " + json.status, Style.error);
        console.log("Error: %c" + json.error, 'color: #F51212');
        console.log("Error Message: %c" + json.message, 'color: #F51212');
        document.getElementById("foodItem").innerHTML = "Request status: " + json.status;
        return "Request status: " + json.status;
    }
    return getRndFoodItem();
}

function updateProgress() {
    document.getElementById("progressBar").hidden = false;
    sleep(250).then(r => {
        console.log("updater started");
        updater = setInterval(async () => {
            const data = {
                type: "progressRequest"
            }
            const response = await makePOSTRequest(data);
            const json = await response.json();
            console.log(await json.progress + "/" + await json.total);
            let progress = json.progress / json.total;
            progressBar.style.width = `${Math.round(progress * 261)}px`;
            progressBar.innerHTML = `${Math.round(progress * 100)}%`;
        }, 1000);
    });
}

async function clearProgressInterval() {
    console.log("cleared interval");
    if (updater === ""){
        await sleep(500);
    }
    clearInterval(updater);
    updater = "";
    document.getElementById("progressBar").hidden = true;
    progressBar.style.width = "0%";
    progressBar.innerHTML = "0%"
}

async function makePOSTRequest(data) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }
    console.log(data.type + " request sent, awaiting response...")
    return await fetch('/api', options);
}

async function checkInputAvailability() {
    const openChecked = document.getElementById("openedResCheck").checked;
    const closeChecked = document.getElementById("closedResCheck").checked;
    document.getElementById("noResultWarning").hidden = openChecked || closeChecked;
    document.getElementById("getNewFoodItemBtn").disabled = food.length === 0;
}

function getRndFoodItem(){
    let foodItem;
    if (food !== "No results found") {
        let rndInt = getRndInteger(0, food.length - 1);
        foodItem = food[rndInt];
    }
    else {
        foodItem = food;
    }
    document.getElementById("foodItem").innerHTML = foodItem;
    console.log(foodItem);
    return foodItem;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
