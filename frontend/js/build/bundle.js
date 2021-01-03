(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Base = require('./cell_base')

class Cell1 extends Base.CellBase {

    constructor(type) {
        super(type)
        this.rise = true
        this.connection_pattern = Base.Links2D8
    }

    update(){

        if (this.rise)
            this.power++;
        else
            this.power--;

        if (this.power > 255) {
            this.power = 255;
            this.rise = false;
        }

        if (this.power > 50) {
            if (this.power % 10 == 0) this.breed()
        }

        return this.power

    }

    breed(){
        let free_space = this.free_space()
        if (free_space.length > 0) {
            let new_cell = new Cell1(this.type)
            let socket = free_space[0]
            socket.connect_cell(new_cell)
        }
    }

}


module.exports = Cell1

},{"./cell_base":2}],2:[function(require,module,exports){
const Links2D8 = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]

class CellBase {

    constructor(type) {
        this.type = type
        this.power = 1
    }

    connect_links(links) {
        this.links = links
    }

    free_space() {
        return (this.links.filter(l => l.is_empty()))
    }

}


module.exports = {
    CellBase,
    Links2D8
}
},{}],3:[function(require,module,exports){
class Socket {
    constructor(space, v) {
        this.space = space
        this.v = v
        this.cell = null
    }

    is_empty() {
        return (this.cell === null)
    }

    connect_cell(cell) {
        this.cell = cell
        let links = this.space.get_sockets_by_pattern(this, cell.connection_pattern)
        cell.connect_links(links)
    }
}

module.exports = Socket
},{}],4:[function(require,module,exports){
const Socket = require('./socket');

class Space2D {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.space = []
        for (let y = 0; y < this.height; y++) {
            let row = []
            for (let x = 0; x < this.width; x++) {
                row.push(new Socket(this,[x, y]))
            }
            this.space.push(row)
        }
    }

    connect_cell(cell, x, y) {
        let socket = this.space[x][y]
        socket.connect_cell(cell)
    }

    get_sockets_by_pattern(socket, pattern) {

        let x = socket.v[0]
        let y = socket.v[1]

        let sockets = []
        pattern.forEach(offset => {
            let nx = x + offset[0]
            let ny = y + offset[1]
            if (!(nx < 0 || nx >= this.width || ny < 0 || ny >= this.height))
                sockets.push(this.space[nx][ny])

        })

        return sockets
    }


    for_each_socket(task) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                task(this.space[x][y], x, y)
            }
        }
    }

    update() {
        this.for_each_socket(function (socket, x, y) {
            if (!socket.is_empty()) {
                if (socket.cell.update() == 0)
                    socket.cell = null
            }
        })
    }

    show(ctx, cell_size) {
        this.for_each_socket(function (socket, x, y) {
            if (!socket.is_empty()) {
                let cell = socket.cell
                ctx.fillStyle = 'rgb(' + cell.power + ',0,0)'
                ctx.fillRect(x * cell_size, y * cell_size, cell_size, cell_size);
            }
        })
    }


    set_cell(cell, x, y) {
        let env = this.space[x][y]
        env.cell = cell
        cell.env = env
    }

}

module.exports = Space2D

},{"./socket":3}],5:[function(require,module,exports){
const Space2D = require('./gen_003/space_2d');
const Cell1 = require('./gen_003/cell1');

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
    space.connect_cell(new Cell1(0), 12, 12)
    // space.set_cell(new Cells.Cell1(0), 12, 12)

    //sandbox.set_cell(new Cell(50, 50, { color: 'green', breed_factor: 10, breed_direction: 1}))
    // sandbox.spawn_cell(50, 50, { color: 'green', breed_factor: 100, breed_direction: 1});
    // #sandbox.spawn_cell(60, 60, { color: 'blue', breed_factor: 10, breed_schema: 2});
    //sandbox.spawn_cell(40, 60, { color: 'red', breed_factor: 10, breed_schema: 2});

    //sandbox.spawn_cell(60, 60, { color: 'green', breed_factor: 10, breed_schema: 3, breed_direction: [-1, -1], mutation_period: 10});

    // console.log(safe_coord(101, 100));


    window.requestAnimationFrame(animation_step);
});



},{"./gen_003/cell1":1,"./gen_003/space_2d":4}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImdlbl8wMDMvY2VsbDEuanMiLCJnZW5fMDAzL2NlbGxfYmFzZS5qcyIsImdlbl8wMDMvc29ja2V0LmpzIiwiZ2VuXzAwMy9zcGFjZV8yZC5qcyIsIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgQmFzZSA9IHJlcXVpcmUoJy4vY2VsbF9iYXNlJylcclxuXHJcbmNsYXNzIENlbGwxIGV4dGVuZHMgQmFzZS5DZWxsQmFzZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IodHlwZSkge1xyXG4gICAgICAgIHN1cGVyKHR5cGUpXHJcbiAgICAgICAgdGhpcy5yaXNlID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbl9wYXR0ZXJuID0gQmFzZS5MaW5rczJEOFxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSgpe1xyXG5cclxuICAgICAgICBpZiAodGhpcy5yaXNlKVxyXG4gICAgICAgICAgICB0aGlzLnBvd2VyKys7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLnBvd2VyLS07XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBvd2VyID4gMjU1KSB7XHJcbiAgICAgICAgICAgIHRoaXMucG93ZXIgPSAyNTU7XHJcbiAgICAgICAgICAgIHRoaXMucmlzZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMucG93ZXIgPiA1MCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wb3dlciAlIDEwID09IDApIHRoaXMuYnJlZWQoKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG93ZXJcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYnJlZWQoKXtcclxuICAgICAgICBsZXQgZnJlZV9zcGFjZSA9IHRoaXMuZnJlZV9zcGFjZSgpXHJcbiAgICAgICAgaWYgKGZyZWVfc3BhY2UubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBsZXQgbmV3X2NlbGwgPSBuZXcgQ2VsbDEodGhpcy50eXBlKVxyXG4gICAgICAgICAgICBsZXQgc29ja2V0ID0gZnJlZV9zcGFjZVswXVxyXG4gICAgICAgICAgICBzb2NrZXQuY29ubmVjdF9jZWxsKG5ld19jZWxsKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENlbGwxXHJcbiIsImNvbnN0IExpbmtzMkQ4ID0gW1stMSwgLTFdLCBbMCwgLTFdLCBbMSwgLTFdLCBbLTEsIDBdLCBbMSwgMF0sIFstMSwgMV0sIFswLCAxXSwgWzEsIDFdXVxyXG5cclxuY2xhc3MgQ2VsbEJhc2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHR5cGUpIHtcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlXHJcbiAgICAgICAgdGhpcy5wb3dlciA9IDFcclxuICAgIH1cclxuXHJcbiAgICBjb25uZWN0X2xpbmtzKGxpbmtzKSB7XHJcbiAgICAgICAgdGhpcy5saW5rcyA9IGxpbmtzXHJcbiAgICB9XHJcblxyXG4gICAgZnJlZV9zcGFjZSgpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMubGlua3MuZmlsdGVyKGwgPT4gbC5pc19lbXB0eSgpKSlcclxuICAgIH1cclxuXHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIENlbGxCYXNlLFxyXG4gICAgTGlua3MyRDhcclxufSIsImNsYXNzIFNvY2tldCB7XHJcbiAgICBjb25zdHJ1Y3RvcihzcGFjZSwgdikge1xyXG4gICAgICAgIHRoaXMuc3BhY2UgPSBzcGFjZVxyXG4gICAgICAgIHRoaXMudiA9IHZcclxuICAgICAgICB0aGlzLmNlbGwgPSBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgaXNfZW1wdHkoKSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLmNlbGwgPT09IG51bGwpXHJcbiAgICB9XHJcblxyXG4gICAgY29ubmVjdF9jZWxsKGNlbGwpIHtcclxuICAgICAgICB0aGlzLmNlbGwgPSBjZWxsXHJcbiAgICAgICAgbGV0IGxpbmtzID0gdGhpcy5zcGFjZS5nZXRfc29ja2V0c19ieV9wYXR0ZXJuKHRoaXMsIGNlbGwuY29ubmVjdGlvbl9wYXR0ZXJuKVxyXG4gICAgICAgIGNlbGwuY29ubmVjdF9saW5rcyhsaW5rcylcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTb2NrZXQiLCJjb25zdCBTb2NrZXQgPSByZXF1aXJlKCcuL3NvY2tldCcpO1xyXG5cclxuY2xhc3MgU3BhY2UyRCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuc3BhY2UgPSBbXVxyXG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5oZWlnaHQ7IHkrKykge1xyXG4gICAgICAgICAgICBsZXQgcm93ID0gW11cclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLndpZHRoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHJvdy5wdXNoKG5ldyBTb2NrZXQodGhpcyxbeCwgeV0pKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc3BhY2UucHVzaChyb3cpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbm5lY3RfY2VsbChjZWxsLCB4LCB5KSB7XHJcbiAgICAgICAgbGV0IHNvY2tldCA9IHRoaXMuc3BhY2VbeF1beV1cclxuICAgICAgICBzb2NrZXQuY29ubmVjdF9jZWxsKGNlbGwpXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0X3NvY2tldHNfYnlfcGF0dGVybihzb2NrZXQsIHBhdHRlcm4pIHtcclxuXHJcbiAgICAgICAgbGV0IHggPSBzb2NrZXQudlswXVxyXG4gICAgICAgIGxldCB5ID0gc29ja2V0LnZbMV1cclxuXHJcbiAgICAgICAgbGV0IHNvY2tldHMgPSBbXVxyXG4gICAgICAgIHBhdHRlcm4uZm9yRWFjaChvZmZzZXQgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbnggPSB4ICsgb2Zmc2V0WzBdXHJcbiAgICAgICAgICAgIGxldCBueSA9IHkgKyBvZmZzZXRbMV1cclxuICAgICAgICAgICAgaWYgKCEobnggPCAwIHx8IG54ID49IHRoaXMud2lkdGggfHwgbnkgPCAwIHx8IG55ID49IHRoaXMuaGVpZ2h0KSlcclxuICAgICAgICAgICAgICAgIHNvY2tldHMucHVzaCh0aGlzLnNwYWNlW254XVtueV0pXHJcblxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHJldHVybiBzb2NrZXRzXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGZvcl9lYWNoX3NvY2tldCh0YXNrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLmhlaWdodDsgeSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy53aWR0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB0YXNrKHRoaXMuc3BhY2VbeF1beV0sIHgsIHkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgIHRoaXMuZm9yX2VhY2hfc29ja2V0KGZ1bmN0aW9uIChzb2NrZXQsIHgsIHkpIHtcclxuICAgICAgICAgICAgaWYgKCFzb2NrZXQuaXNfZW1wdHkoKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNvY2tldC5jZWxsLnVwZGF0ZSgpID09IDApXHJcbiAgICAgICAgICAgICAgICAgICAgc29ja2V0LmNlbGwgPSBudWxsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHNob3coY3R4LCBjZWxsX3NpemUpIHtcclxuICAgICAgICB0aGlzLmZvcl9lYWNoX3NvY2tldChmdW5jdGlvbiAoc29ja2V0LCB4LCB5KSB7XHJcbiAgICAgICAgICAgIGlmICghc29ja2V0LmlzX2VtcHR5KCkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjZWxsID0gc29ja2V0LmNlbGxcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiKCcgKyBjZWxsLnBvd2VyICsgJywwLDApJ1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0KHggKiBjZWxsX3NpemUsIHkgKiBjZWxsX3NpemUsIGNlbGxfc2l6ZSwgY2VsbF9zaXplKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHNldF9jZWxsKGNlbGwsIHgsIHkpIHtcclxuICAgICAgICBsZXQgZW52ID0gdGhpcy5zcGFjZVt4XVt5XVxyXG4gICAgICAgIGVudi5jZWxsID0gY2VsbFxyXG4gICAgICAgIGNlbGwuZW52ID0gZW52XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNwYWNlMkRcclxuIiwiY29uc3QgU3BhY2UyRCA9IHJlcXVpcmUoJy4vZ2VuXzAwMy9zcGFjZV8yZCcpO1xyXG5jb25zdCBDZWxsMSA9IHJlcXVpcmUoJy4vZ2VuXzAwMy9jZWxsMScpO1xyXG5cclxubGV0IGNhbnZhcztcclxubGV0IHNwYWNlO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFJhbmRvbUludChtYXgpIHtcclxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBNYXRoLmZsb29yKG1heCkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhbmltYXRpb25fc3RlcCh0aW1lc3RhbXApIHtcclxuXHJcbiAgICBzcGFjZS51cGRhdGUoKTtcclxuICAgIHNwYWNlLnNob3coY3R4LCAzMik7XHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGlvbl9zdGVwKTtcclxufVxyXG5cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbiAoKSB7XHJcblxyXG5cclxuICAgIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpO1xyXG4gICAgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuXHJcbiAgICBjYW52YXMud2lkdGggPSA4MDA7XHJcbiAgICBjYW52YXMuaGVpZ2h0ID0gODAwO1xyXG5cclxuICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICBjdHguZmlsbFJlY3QoMCwgMCwgODAwLCA4MDApO1xyXG5cclxuICAgIHNwYWNlID0gbmV3IFNwYWNlMkQoMjUsIDI1KVxyXG4gICAgc3BhY2UuY29ubmVjdF9jZWxsKG5ldyBDZWxsMSgwKSwgMTIsIDEyKVxyXG4gICAgLy8gc3BhY2Uuc2V0X2NlbGwobmV3IENlbGxzLkNlbGwxKDApLCAxMiwgMTIpXHJcblxyXG4gICAgLy9zYW5kYm94LnNldF9jZWxsKG5ldyBDZWxsKDUwLCA1MCwgeyBjb2xvcjogJ2dyZWVuJywgYnJlZWRfZmFjdG9yOiAxMCwgYnJlZWRfZGlyZWN0aW9uOiAxfSkpXHJcbiAgICAvLyBzYW5kYm94LnNwYXduX2NlbGwoNTAsIDUwLCB7IGNvbG9yOiAnZ3JlZW4nLCBicmVlZF9mYWN0b3I6IDEwMCwgYnJlZWRfZGlyZWN0aW9uOiAxfSk7XHJcbiAgICAvLyAjc2FuZGJveC5zcGF3bl9jZWxsKDYwLCA2MCwgeyBjb2xvcjogJ2JsdWUnLCBicmVlZF9mYWN0b3I6IDEwLCBicmVlZF9zY2hlbWE6IDJ9KTtcclxuICAgIC8vc2FuZGJveC5zcGF3bl9jZWxsKDQwLCA2MCwgeyBjb2xvcjogJ3JlZCcsIGJyZWVkX2ZhY3RvcjogMTAsIGJyZWVkX3NjaGVtYTogMn0pO1xyXG5cclxuICAgIC8vc2FuZGJveC5zcGF3bl9jZWxsKDYwLCA2MCwgeyBjb2xvcjogJ2dyZWVuJywgYnJlZWRfZmFjdG9yOiAxMCwgYnJlZWRfc2NoZW1hOiAzLCBicmVlZF9kaXJlY3Rpb246IFstMSwgLTFdLCBtdXRhdGlvbl9wZXJpb2Q6IDEwfSk7XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coc2FmZV9jb29yZCgxMDEsIDEwMCkpO1xyXG5cclxuXHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGlvbl9zdGVwKTtcclxufSk7XHJcblxyXG5cclxuIl19
