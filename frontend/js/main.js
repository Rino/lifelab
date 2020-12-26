let canvas;
let sandbox;


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function animation_step(timestamp) {

    sandbox.update();
    sandbox.show(ctx, 8);
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

    sandbox = new Sandbox(100, 100);
    sandbox.spawn_cell(50, 50, { color: 'green', breed_factor: 100, breed_direction: 1});
    sandbox.spawn_cell(60, 60, { color: 'blue', breed_factor: 10, breed_direction: 1});
    sandbox.spawn_cell(40, 60, { color: 'red', breed_factor: 50, breed_direction: 2});

    // console.log(safe_coord(101, 100));


    window.requestAnimationFrame(animation_step);
});


