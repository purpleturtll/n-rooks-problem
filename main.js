const express = require("express");
const Logic = require("logic-solver");
const _ = require("underscore");
const app = express();
app.use(express.json());
app.use(express.static("public"));

app.get("/solver", (req, res) => {
    let R = [
        ["00", "01", "02"],
        ["10", "11", "12"],
        ["20", "21", "22"],
    ];

    let solver = new Logic.Solver();

    //przynajmnijej jedna wieża w row i col
    _.each(
        [
            // Przynajmniej jeden w rzędzie
            ["00", "01", "02"],
            [R[1][0], R[1][1], R[1][2]],
            [R[2][0], R[2][1], R[2][2]],
            //Przynajmniej jeden w kolumnach
            [R[0][0], R[1][0], R[2][0]],
            [R[0][1], R[1][1], R[2][1]],
            [R[0][2], R[1][2], R[2][2]],
        ],
        (terms) => {
            console.log(Logic.or("00", "01", "02"));
            solver.require(Logic.or(terms));
        }
    );

    //nie więcej niż jedna wieża w col i row

    _.each(
        [
            // Maksymalnie jedna w rzędzie
            // rząd 0
            [R[0][0], R[0][1]],
            [R[0][1], R[0][2]],
            // rząd 1
            [R[1][0], R[1][1]],
            [R[1][1], R[1][2]],
            // rząd 2
            [R[2][0], R[2][1]],
            [R[2][1], R[2][2]],
            // Maksymalnie jedna w kolumnie
            // kolumna 0
            [R[0][0], R[1][0]],
            [R[1][0], R[2][0]],
            // kolumna 1
            [R[0][1], R[1][1]],
            [R[1][1], R[2][1]],
            // kolumna 2
            [R[0][2], R[1][2]],
            [R[1][2], R[2][2]],
        ],
        (terms) => {
            solver.require(
                Logic.equalBits(
                    Logic.not(Logic.and(terms)),
                    Logic.constantBits(1)
                )
            );
        }
    );

    let S = solver.solve();
    let response = [
        [s.evaluate("00"), s.evaluate("01"), s.evaluate("02")],
        [s.evaluate("10"), s.evaluate("11"), s.evaluate("12")],
        [s.evaluate("20"), s.evaluate("21"), s.evaluate("22")],
    ];
    res.json(JSON.stringify(response));
});

app.listen(8080);
