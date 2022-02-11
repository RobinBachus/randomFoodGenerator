const foodListGen = require("./Generate_Order.js")
const express = require("express");
const fs = require('fs');
const app = express();

const port = 8000;

let foodItemList = ""
let lastRequest = ""
let lastSearch;

app.listen(port);
app.use(express.static("public"));
app.use(express.json({
    limit: '1mb'
}))

console.log(`Server running at http://localhost:${port}/`);

app.post("/api", async (request, response) => {
    try {
        if (request.body.type === "listRequest") {
            const data = fs.readFileSync('./cache.json', 'utf8');
            lastSearch = JSON.parse(data);
            if (lastSearch.request !== JSON.stringify(request.body)) {
                lastRequest = JSON.stringify(request.body)
                foodItemList = await getFoodItemList(request.body);

                // save last search in file
                let searchJSON = {
                    request: lastRequest,
                    statusCode: 200,
                    foodList: foodItemList
                };
                const data = JSON.stringify(searchJSON);
                fs.writeFile('./cache.json', data, 'utf8', (err) => {
                    if (err) {
                        console.log(`Error writing file: ${err}`);
                    } else {
                        console.log(`File is written successfully!`);
                    }
                });
                // Send list of food items to browser
                await response.json({
                    statusCode: 200,
                    status: '200 Success',
                    foodItemList: foodItemList
                });

            } else {
                foodItemList = lastSearch.foodList;
                await response.json({
                    statusCode: 304,
                    status: '304 Not Modified',
                    foodItemList: foodItemList
                });
            }
        }
        else if (request.body.type === "progressRequest") {
            console.log("sending progress")
            await response.json({
                statusCode: 200,
                status: '200 Success',
                progress: foodListGen.progress,
                total: foodListGen.total
            });
        }
    } catch (err) {
        console.log(err);
        await response.json({
            statusCode: 500,
            status: '500 Internal Server Error',
            error: err.name,
            message: err.message
        });
        lastRequest = "Error"
    }
})

async function getFoodItemList(response) {
    foodItemList = await foodListGen.getFoodItem(response);
    return foodItemList;
}
