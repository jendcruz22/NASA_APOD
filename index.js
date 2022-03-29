// Google translate
const res = require("express/lib/response");

const { Translate } = require("@google-cloud/translate").v2;
require("dotenv").config();

// Credentials from the .env file
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

// Create client by passion credentials and project id
const translate = new Translate({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.project_id,
});

// Function to translate text to given language
async function translateText(text, targetLanguage) {
  try {
    let [response] = await translate.translate(text, targetLanguage);
    // console.log(response);
    return response;
  } catch (error) {
    console.log(`Error at translateText --> ${error}`);
    return 0;
  }
}

// ================================================================================
// NASA's APOD

const exp = require("express");
const path = require("path");
const fs = require("fs");
const port = "8888";
const app = exp();
const axios = require("axios");
const { start } = require("repl");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

let key = "rS5SNNMfkBzFjw3fsx7Dog55tmoHL0czX7cu1Jo6";

app.use("/public", exp.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

app.get("/", (req, res) => {
  let startDate, endDate;
  let lang = req.query.lang;
  // IF USER HAS PROVIDED START AND END DATE, ASSIGN THEM TO START AND END DATE VARIABLES
  if (req.query.archiveEndDate) {
    if (req.query.archiveStartDate) {
      startDate = req.query.archiveStartDate;
      endDate = req.query.archiveEndDate;
    }
  } 
  // ELSE ASSIGN TODAY'S DATE AS START AND END DATE
  else {
    startDate = new Date().toISOString().slice(0, 10);
    endDate = new Date().toISOString().slice(0, 10);
  }
  let url = "https://api.nasa.gov/planetary/apod?api_key=" + key + "&start_date=" + startDate + "&end_date=" +endDate;
  multipleDays(res, url, lang);
});

async function multipleDays(res, url, lang) {
  var pageData = {
    title: "NASA APOD API",
  };
  axios(
    //the request
    {
      baseURL: url,
      method: "get",
    }
  ).then(async function (response) {
    const displayData = [];
    for (var val of response.data){
      displayData.push(val);
    }
    var olTitle, olExplanation;
    var olDisplayData=[];
    var both = {eng:displayData, ol:[]};
    // console.log(displayData);
    displayData.forEach(function (item) {
      // You must call .then on the promise to capture the results regardless of the promise state (resolved or still pending)
      translateText(item.explanation, lang).then(function(result) {
        olExplanation = result;
        olTitle = translateText(item.title, lang).then(function(result) {
          olTitle = result;
          olDisplayData = {
              date: item.date,
              explanation: olExplanation,
              hdurl: item.hdurl,
              media_type: item.media_type,
              service_version: item.service_version,
              title: olTitle,
              url: item.url
            };
          both.ol.push(olDisplayData);
          return(both);
        })
      });
    })
    setTimeout(() => {
      console.log(both);
      res.render("index", {both});
    }, 5000);
  });
}
