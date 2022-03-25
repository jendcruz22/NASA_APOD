// Google translate
const res = require('express/lib/response');

const {Translate} = require('@google-cloud/translate').v2;
require('dotenv').config();

// Credentials from the .env file
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

// Create client by passion credentials and project id
const translate = new Translate({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.project_id
});

// Function to translate text to given language
async function translateText(text, targetLanguage) {
  try {
      let [response] = await translate.translate(text, targetLanguage);
      console.log(response);
      return response;
  } catch (error) {
      console.log(`Error at translateText --> ${error}`);
      return 0;
  }
};

// ================================================================================
// NASA's APOD

const exp = require("express");
const path = require("path");
const fs = require("fs");

const port = "8888";
const app = exp();

const axios = require('axios');

let key = "rS5SNNMfkBzFjw3fsx7Dog55tmoHL0czX7cu1Jo6";
// let date = "2017-07-08";
// let url = "https://api.nasa.gov/planetary/apod?api_key="+key+"&date="+date;
let url = "https://api.nasa.gov/planetary/apod?api_key="+key;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use("/public", exp.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
  });

app.get("/", (req, res) => {
    getstuff(res);
}); 

// async function getAPOD() {
//     var {data} = await axios.get(url);
//     return data;
// }

async function getstuff(res) {
    var pageData = {
      title: "Popular Shows",
      shows: null,
    };
    axios(
      //the request
      {
        // url,
        baseURL: url,
        method: "get",
        // headers,
      }
    ).then(async function (response){
        console.log(response.data);
        console.log("title is: "+response.data.title+"... in english");
        var translation = await translateText(response.data.title, 'fr');
        console.log("translated title is: "+translation);
        res.render('index', response.data);
    })
}


