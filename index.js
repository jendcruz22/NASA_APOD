// VARIABLES: GOOGLE TRANSLATE API 
const res = require("express/lib/response");
const { Translate } = require("@google-cloud/translate").v2;

require("dotenv").config();

// CREDENTIALS FROM THE .ENV FILE
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

// CREATE CLIENT BY PASSION CREDENTIALS AND PROJECT ID
const translate = new Translate({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.project_id,
});

// FUNCTION: TO TRANSLATE TEXT TO GIVEN LANGUAGE
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
// VARIABLES: NASA's APOD API
const exp = require("express");
const path = require("path");
const port = "8888";
const app = exp();
const axios = require("axios");

let startDate, endDate, lang;
var olTitle, olExplanation;
var olDisplayData=[];

// API KEY FOR NASA's APOD
let key = "rS5SNNMfkBzFjw3fsx7Dog55tmoHL0czX7cu1Jo6";

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use("/public", exp.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

app.get("/", (req, res) => {

  // IF USER HAS PROVIDED LANGUAGE TO DISPLAY DATA IN, ASSIGN IT TO VARIABLE LANG
  if(req.query.lang){
    lang = req.query.lang;
  }

  // ELSE BY DEFAULT, LET THE LANGUAGE BE ENGLISH
  else {
    lang = 'en';
  }

  // IF USER HAS PROVIDED START AND END DATE, ASSIGN THEM TO START AND END DATE VARIABLES
  if (req.query.archiveStartDate) {
    if (req.query.archiveEndDate) {
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
  displayAPODData(res, url, lang);

});

async function displayAPODData(res, url, lang) {
  axios(
    // REQUEST
    {
      baseURL: url,
      method: "get",
    }
  ).then(async function (response) {
    const displayData = [];
    for (var val of response.data){
      displayData.push(val);
    }
    
    // THE 'both' OBJECT STORES THE ORIGINAL DATA IN ENGLISH UNDER 'eng' AND HOLDS THE 'other language' TRANSLATED DATA
    var both = {eng:displayData, ol:[]};

    displayData.forEach(function (item) {
      // YOU MUST CALL .then ON THE PROMISE TO CAPTURE THE RESULTS REGARDLESS OF THE PROMISE STATE (RESOLVED OR STILL PENDING)
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
    
    // SET A TIMEOUT SO THAT THE PAGE IS RENDERED ONLY AFTER THE DATA IS AVAILABLE. 
    setTimeout(() => {
      res.render("index", {both});
    }, 3000);

  });
}
