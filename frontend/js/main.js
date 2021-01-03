const Space2D = require('./gen_003/space_2d');
const Cell1 = require('./gen_003/cell1');

let canvas;
let space;



function animation_step(timestamp) {

    space.update();
    space.show(ctx, 8);
    window.requestAnimationFrame(animation_step);
}


window.addEventListener("load", function () {


    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 800;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 800, 800);

    space = new Space2D(100, 100)
    space.connect_cell(new Cell1(1), 50, 50)
    space.connect_cell(new Cell1(2), 51, 50)
    space.connect_cell(new Cell1(3), 52, 50)
    space.connect_cell(new Cell1(4), 50, 51)
    space.connect_cell(new Cell1(5), 51, 51)
    space.connect_cell(new Cell1(6), 52, 51)
    space.connect_cell(new Cell1(7), 51, 52)


    window.requestAnimationFrame(animation_step);
});


