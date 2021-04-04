let board_state = []
let tile_size = 32
let board_size = 8
let spacing = 0

let state = {
    "empty": 0,
    "rook": 1
}

function setup_board(){
    for(let i = 0; i < board_size; i++){
        board_state.push([])
        for(let j = 0; j < board_size; j++){
            board_state[i].push(state.empty)
        }
    }
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
            square((spacing * (i + 1)) + (tile_size * i), (spacing * (j + 1)) + (tile_size * j), tile_size)
        }
    }
}

function setup() {
    createCanvas((tile_size * board_size) + (spacing * (board_size + 1)), (tile_size * board_size) + (spacing * (board_size + 1)));
    setup_board()
}

function draw() {
    background(220);
    draw_board()
}