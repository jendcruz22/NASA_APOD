alert("Hi");

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
        document.getElementById("demo").innerHTML = response;
        console.log(response);
        // return response;
    } catch (error) {
        console.log(`Error at translateText --> ${error}`);
        return 0;
    }
};

translateText('mes amis', 'en')
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });
    