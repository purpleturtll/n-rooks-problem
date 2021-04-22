let tile_size = 64;
let board_size = 3;
let spacing = 0;
let rook_img;
let rooks = [];
let speed = 0.1;
let solutions = [];
let animate = true;
let auto = false;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

class Rook {
    constructor(x, y) {
        this.index_pos = { x: x, y: y };
        this.pos = {
            x: Math.round(
                spacing * (this.index_pos.x + 1) + tile_size * this.index_pos.x
            ),
            y: Math.round(
                spacing * (this.index_pos.y + 1) + tile_size * this.index_pos.y
            ),
        };
        this.index_destination = { x: this.index_pos.x, y: this.index_pos.y };
        this.destination = { x: this.pos.x, y: this.pos.y };
    }

    set_destination = (x, y) => {
        this.index_destination = { x: x, y: y };
        this.destination = {
            x: Math.round(
                spacing * (this.index_destination.x + 1) +
                    tile_size * this.index_destination.x
            ),
            y: Math.round(
                spacing * (this.index_destination.y + 1) +
                    tile_size * this.index_destination.y
            ),
        };
    };

    animate = () => {
        if (Math.round(this.pos.x) != Math.round(this.destination.x)) {
            this.pos.x += (this.destination.x - this.pos.x) * speed;
        } else {
            if (this.pos.y != this.destination.y) {
                this.pos.y += (this.destination.y - this.pos.y) * speed;
            }
        }
        this.index_pos.x = Math.round(this.pos.x / tile_size);
        this.index_pos.y = Math.round(this.pos.y / tile_size);
    };

    atDestination = () => {
        return (
            Math.round(this.pos.x) == Math.round(this.destination.x) &&
            Math.round(this.pos.y) == Math.round(this.destination.y)
        );
    };
}

function preload() {
    rook_img = loadImage("rook.png");
}

function draw_board() {
    let white = true;
    noStroke();
    for (let i = 0; i < board_size; i++) {
        if (i % 2 == 0) {
            white = true;
        } else {
            white = false;
        }
        for (let j = 0; j < board_size; j++) {
            if (white) {
                fill(color("#EEEED2"));
            } else {
                fill(color("#769656"));
            }
            white = !white;
            square(
                spacing * (i + 1) + tile_size * i,
                spacing * (j + 1) + tile_size * j,
                tile_size
            );
        }
    }
}

function draw_pieces() {
    for (let i = 0; i < rooks.length; i++) {
        image(rook_img, rooks[i].pos.x, rooks[i].pos.y, tile_size, tile_size);
    }
}

function animatePieces() {
    for (let i = 0; i < rooks.length; i++) {
        if (!rooks[i].atDestination()) {
            rooks[i].animate();
        }
    }
}

function createSolver() {
    fetch("http://localhost:8080/new_solver/" + board_size.toString());
    fetch("http://localhost:8080/solution")
        .then((res) => res.json())
        .then((data) => {
            solutions = JSON.parse(data);
        });
}

function onChangeN() {
    board_size = parseInt(this.value()) <= 0xf ? this.value() : 8;
    resizeCanvas(
        tile_size * board_size + spacing * (board_size + 1),
        tile_size * board_size + spacing * (board_size + 1)
    );
    rooks = [];
    solutions = [];
    for (let i = 0; i < board_size; i++) {
        rooks.push(new Rook(i, i));
    }
}

function nextSolution() {
    if (
        solutions.length > 0 &&
        rooks.filter((r) => r.atDestination()).length == rooks.length
    ) {
        for (let i = 0; i < rooks.length; i++) {
            if (rooks[i].atDestination()) {
                rooks[i].set_destination(
                    parseInt("0x" + solutions[0][i][2]),
                    parseInt("0x" + solutions[0][i][1])
                );
            }
        }
        solutions.shift();
    }
}

function setup() {
    createCanvas(
        tile_size * board_size + spacing * (board_size + 1),
        tile_size * board_size + spacing * (board_size + 1)
    );

    for (let i = 0; i < board_size; i++) {
        rooks.push(new Rook(i, i));
    }

    let inp = createInput(board_size.toString());
    inp.position(0, 0);
    inp.size(50);
    inp.input(onChangeN);

    let button = createButton("Start solver");
    button.position(0, 25);
    button.mousePressed(createSolver);

    let btn = createButton("next");
    btn.position(0, 50);
    btn.mousePressed(() => {
        auto = false;
        nextSolution();
    });

    let autoBtn = createButton("auto");
    autoBtn.position(0, 75);
    autoBtn.mousePressed(() => (auto = !auto));
}

function draw() {
    background(220);
    if (auto) {
        nextSolution();
    }
    if (animate) {
        animatePieces();
    }
    draw_board();
    draw_pieces();
}
