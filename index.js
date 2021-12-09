const express = require('express');
const { readFile } = require('fs').promises;
const app = express();
const path = require("path");
const console = require("console");
const cors = require("cors");
const bodyParser = require("body-parser");
// Expose folders
app.use(express.static(path.join(__dirname, './public/reactive-notes/build')));
app.use(express.static(path.join(__dirname, './public/')));

let notes = [
    {
        title: "Store",
        content: "Remember to go to the store",
        status: "done",
    },
    {
        title: "Anniversary",
        content: "31.7",
        status: "in_progress",
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


app.post("/api/newnote", (request, response) => {
    notes = [...notes, request.body];
    response.json(notes);
})

// Redirect everything else to index
app.get("/*", (request, response) => {
    response.sendFile(path.join(__dirname, "/public/reactive-notes/build/index.html"));
})

app.listen(8080, () => console.log('App available on localhost'))