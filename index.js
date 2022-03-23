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

async function getAPOD() {
    var {data} = await axios.get(url);
    return data;
}

function getstuff(res) {
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
    ).then(function (response){
        console.log(response.data);
        res.render('index', response.data)
    })
}


