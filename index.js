const express = require('express');
const { readFile } = require('fs').promises;
const app = express();
const path = require("path");
const console = require("console");
const cors = require("cors");
const bodyParser = require("body-parser");
const crypto = require("crypto");
// Expose folders
app.use(express.static(path.join(__dirname, './public/reactive-notes/build')));
app.use(express.static(path.join(__dirname, './public/')));

let notes = [
    {
        title: "Store",
        uuid: crypto.randomUUID(),
        content: "Remember to go to the store",
        status: "Done",
    },
    {
        title: "Anniversary",
        uuid: crypto.randomUUID(),
        content: "31.7",
        status: "In progress",
    }
];

// Set cors
app.use(cors({
    content: "application/json"
}));

app.use(bodyParser.json());

// Middleware for api routes
app.use((request, response, next) =>{
    // Do some checking here...
    next();
});

// Api routes
app.get("/api", (request, response) => {
    response.json({response: "Hello you, I am API.", your_headers: request.headers});
})


app.get("/api/notes", (request, response) => {
    response.json(notes);
})

app.post("/api/note", (request, response) => {
    let data = request.body;
    if(data.uuid){
        // Update existing
    } else {
        data.uuid = crypto.randomUUID();
        notes = [...notes, data];
    }
    response.json(notes);
})

// Redirect everything else to index
app.get("/*", (request, response) => {
    response.sendFile(path.join(__dirname, "/public/reactive-notes/build/index.html"));
})

app.listen(8080, () => console.log('App available on localhost'))