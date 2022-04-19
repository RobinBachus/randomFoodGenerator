const foodListGen = require("./modules/Generate_Order.js")
const express = require("express");
const https = require('https');
const fs = require('fs');
const cors = require('cors')
const app = express();

const port = 8000;

let foodItemList = ""
let lastRequest = ""
let lastSearch;

const corsOptions = {
    origin: "*",
    allowedHeaders: "Content-Type",
    maxAge: 86400,
    optionsSuccessStatus: 200
}

const httpsOptions = {
    key: fs.readFileSync(__dirname + '/../certs/server.key', 'utf8'),
    cert: fs.readFileSync(__dirname + '/../certs/server.crt', 'utf8')
}

app.listen(port);
app.use(express.static("public"));
app.use(express.json({
    limit: '1mb'
}))

let server = https.createServer(httpsOptions, app);

console.log(`Server running at http://localhost:${port}/`);

// enable pre-flight for json Content-Type
app.options("/api", cors(corsOptions))

// listen for post request
app.post("/api", cors(corsOptions), async (request, response) => {
    let cacheFilePath = __dirname + "/json/cache.json";
    try {
        if (request.body.type === "listRequest") {
            const data = fs.readFileSync(cacheFilePath, 'utf8');
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
                fs.writeFile(cacheFilePath, data, 'utf8', (err) => {
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
        else if (request.body.type === "connectionTest") {
            await response.json({
                statusCode: 200,
                status: '200 Success'
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
