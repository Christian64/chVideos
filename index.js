const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "/.env") });
const express = require("express");
const app = express();

const cors = require("cors");
const helmet = require("helmet");

const bot = require('./bot.js')



app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


bot()
