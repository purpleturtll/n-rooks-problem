const express = require("express");
const Logic = require("logic-solver");
const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/solver", (req, res) => {
    let state = req.body;

    //tutaj kod solvera

    res.json(JSON.stringify(state));
});

app.listen(8080);
