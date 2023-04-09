const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({extended:false}));




//  ==============  using router =============
const router = require("../route/route");
app.use("/", router);


// ==============  setting template engine ===============
const path = require('path');
const viewsPath = path.join(__dirname, '../templates/views');
app.set('view engine', 'ejs');
app.set('views', viewsPath);


// ================ DB Connection Code ============
require("dotenv").config();
const url = process.env.MONGOOSE_URL
// console.log(url);

const Connection = require("./db/Connection");
const DBConnection = async () => {
    try {
        const result = await Connection(url);
        if(result !== "undefined"){
            app.listen(port, console.log(`Listening to port at ${port}`));
        }
    } catch (error) {
        console.log(error);
    }
}

DBConnection();