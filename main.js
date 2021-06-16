const express = require("express");
const Logic = require("logic-solver");
const _ = require("underscore");
const app = express();
app.use(express.json());
app.use(express.static("public"));

let solver = new Logic.Solver();

Array.prototype.pairs = function (arr) {
    return this.map((v, i) => this.slice(i + 1).map((w) => [v, w])).flat();
};

app.get("/new_solver/:n", (req, res) => {
    solver = new Logic.Solver();

    let R = [];

    for (let i = 0; i < req.params.n; i++) {
        R.push([]);
        for (let j = 0; j < req.params.n; j++) {
            R[i].push("R" + i.toString(16) + j.toString(16));
        }
    }

    // T = po transpozycji
    let T = _.zip(...R);

    //przynajmnijej jedna wieża w row i col
    _.each(
        [
            // Przynajmniej jeden w rzędzie
            ...R,
            //Przynajmniej jeden w kolumnach
            ...T,
        ],
        (terms) => {
            solver.require(Logic.or(terms));
        }
    );

    //nie więcej niż jedna wieża w col i row
    _.each(
        [
            // Maksymalnie jedna w rzędzie
            ...R.map((v) => v.pairs()).flat(),
            // Maksymalnie jedna w kolumnie
            ...T.map((v) => v.pairs()).flat(),
        ],
        (terms) => {
            solver.require(Logic.not(Logic.and(terms)));
        }
    );
    console.log("Setup completed for N =", req.params.n);
});

app.get("/solution", (req, res) => {
    let solutions = [];
    while ((solution = solver.solve())) {
        solutions.push(solution.getTrueVars());
        solver.forbid(solution.getFormula());
    }
    console.log("Solutions sent.");
    res.json(JSON.stringify(solutions));
});

app.listen(8080);
