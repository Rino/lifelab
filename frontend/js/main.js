let power;
let canvas;
let cell_env;


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function animation_step(timestamp) {

    cell_env.update();
    cell_env.show(ctx, 8);
    window.requestAnimationFrame(animation_step);
}

function safe_coord(coord, number) {
    coord = coord % number
    if (coord < 0) return number + coord
    if (coord >= number) return coord - number
    return coord
}

window.addEventListener("load", function () {


    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 800;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 800, 800);

    cell_env = new Environment(100, 100);
    cell_env.spawn_cell(50, 50);
    cell_env.spawn_cell(60, 60);
    cell_env.spawn_cell(51, 51);

    // console.log(safe_coord(101, 100));


    window.requestAnimationFrame(animation_step);
});


