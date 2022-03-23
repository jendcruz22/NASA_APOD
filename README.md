# NASA_APOD
This is a project that uses NASA's APOD API and Google Translate API to display NASA's Astronomic picture of the day in French and English.

## Setup:
Run the following commands to run the code
* npm init
* npm install
* Installing Express, a small, robust tool for HTTP servers: npm i express
* Pug installation: npm i pug
* To securely pass the Google Translate API's credential to the Node.JS script: npm install dotenv @google-cloud/translate --save

As an optional step, you can also install nodemon using the following command: npm i --save-dev nodemon

To use nodemon, replace "test": "echo \"Error: no test specified\" && exit 1" with "dev": "nodemon ./index.js" in package.json

Then run the following comand:
 npm run dev

