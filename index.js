let tile_size = 64
let board_size = 8
let spacing = 0
let rook_img;
let rooks = []
let speed = 0.1

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

function Rook(x, y){
    this.index_pos = {x: x, y: y}
    this.pos = {x: Math.round((spacing * (this.index_pos.x + 1)) + (tile_size * this.index_pos.x)), y: Math.round((spacing * (this.index_pos.y + 1)) + (tile_size * this.index_pos.y))}
    this.index_destination = {x: this.index_pos.x, y: this.index_pos.y}
    this.destination = {x: this.pos.x, y: this.pos.y}

    Rook.prototype.set_destination = (x, y) => {
        this.index_destination = {x: x, y: y}
        this.destination = {x: Math.round((spacing * (this.index_destination.x + 1)) + (tile_size * this.index_destination.x)), y: Math.round((spacing * (this.index_destination.y + 1)) + (tile_size * this.index_destination.y))}
    }

    Rook.prototype.animate = () => {
        if(Math.round(this.pos.x) != Math.round(this.destination.x)){
            this.pos.x += (this.destination.x - this.pos.x) * speed
        }else{
            if(this.pos.y != this.destination.y){
                this.pos.y += (this.destination.y - this.pos.y) * speed
            }
        }
    }

    Rook.prototype.atDestination = () => {
        return Math.round(this.pos.x) == Math.round(this.destination.x) && Math.round(this.pos.y) == Math.round(this.destination.y)
    }
}

function preload() {
    rook_img = loadImage('rook.png');
}

function draw_board(){
    let white = true
    noStroke()
    for(let i = 0; i < board_size; i++){
        if(i % 2 == 0){
            white = true
        }else{
            white = false
        }
        for(let j = 0; j < board_size; j++){
            if(white){
                fill(color("#EEEED2"))
            }else{
                fill(color("#769656"))
            }
            white = !white
            square((spacing * (i + 1)) + (tile_size * i), (spacing * (j + 1)) + (tile_size * j) , tile_size)
        }
    }
}

function draw_pieces(){
    for(let i = 0; i < rooks.length; i++){
        image(rook_img, rooks[i].pos.x, rooks[i].pos.y, tile_size, tile_size)
    }
}

function animatePieces(){
    for(let i = 0; i < rooks.length; i++){
        if(!rooks[i].atDestination()){
            rooks[i].animate()
        }
    }
}

function setup() {
    createCanvas((tile_size * board_size) + (spacing * (board_size + 1)), (tile_size * board_size) + (spacing * (board_size + 1)), "WEBGL");
    //               [col][row]
    rooks.push(new Rook(1, 2))
}

function draw() {
    background(220);
    animatePieces()
    draw_board()
    draw_pieces()
    for(let i = 0; i < rooks.length; i++){
        if(rooks[i].atDestination()){
            rooks[i].set_destination(getRandomInt(0, board_size), getRandomInt(0, board_size))
        }
    }
}