const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express();

const userRoute = require("./routes/user");

const PORT = process.env.PORT;

//Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use("/user", userRoute);

// Global catch
app.use((err, req, res, next) => {
    console.error(err.stack)

    res.status(500).json({
        message: "Internal server error"
    });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})