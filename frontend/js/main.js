// requirejs(["space"], function(space) {
//     console.log(space)
// })
//
//
// requirejs(["cell"], function (cell) {
//     console.log(cell)
// })
//
// const Spaces = require('./space')
//
//
// const Cells = require('./cell')
//

// const Spaces = require('./space');
// const Cells = require('./cell');

let canvas;
let space;


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function animation_step(timestamp) {

    space.update();
    space.show(ctx, 32);
    window.requestAnimationFrame(animation_step);
}


window.addEventListener("load", function () {


    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 800;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 800, 800);

    space = new Space2D(25, 25)
    space.set_cell(new Cell1(0), 12, 12)

    //sandbox.set_cell(new Cell(50, 50, { color: 'green', breed_factor: 10, breed_direction: 1}))
    // sandbox.spawn_cell(50, 50, { color: 'green', breed_factor: 100, breed_direction: 1});
    // #sandbox.spawn_cell(60, 60, { color: 'blue', breed_factor: 10, breed_schema: 2});
    //sandbox.spawn_cell(40, 60, { color: 'red', breed_factor: 10, breed_schema: 2});

    //sandbox.spawn_cell(60, 60, { color: 'green', breed_factor: 10, breed_schema: 3, breed_direction: [-1, -1], mutation_period: 10});

    // console.log(safe_coord(101, 100));


    window.requestAnimationFrame(animation_step);
});


