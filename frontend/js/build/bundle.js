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
                row.push(new Socket(this, [x, y]))
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
                ctx.fillStyle = cell2color(cell.type, cell.power)
                ctx.fillRect(x * cell_size, y * cell_size, cell_size, cell_size);
            }
        })
    }


}

function  cell2color(cell_type, cell_power) {
    switch (cell_type) {
        case 1:
            return 'rgb(' + cell_power + ',0,0)'
        case 2:
            return 'rgb(0,' + cell_power + ',0)'
        case 3:
            return 'rgb(0,0,' + cell_power + ')'
        case 4:
            return 'rgb(' + cell_power + ',' + cell_power + ',0)'
        case 5:
            return 'rgb(' + cell_power + ',0,' + cell_power + ')'
        case 6:
            return 'rgb(0,' + cell_power +', '+ cell_power + ')'
        case 7:
            return 'rgb('+ cell_power +',' + cell_power +', '+ cell_power + ')'

    }
}


module.exports = Space2D

},{"./socket":3}],5:[function(require,module,exports){
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



},{"./gen_003/cell1":1,"./gen_003/space_2d":4}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImdlbl8wMDMvY2VsbDEuanMiLCJnZW5fMDAzL2NlbGxfYmFzZS5qcyIsImdlbl8wMDMvc29ja2V0LmpzIiwiZ2VuXzAwMy9zcGFjZV8yZC5qcyIsIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IEJhc2UgPSByZXF1aXJlKCcuL2NlbGxfYmFzZScpXHJcblxyXG5jbGFzcyBDZWxsMSBleHRlbmRzIEJhc2UuQ2VsbEJhc2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHR5cGUpIHtcclxuICAgICAgICBzdXBlcih0eXBlKVxyXG4gICAgICAgIHRoaXMucmlzZSA9IHRydWVcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25fcGF0dGVybiA9IEJhc2UuTGlua3MyRDhcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoKXtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucmlzZSlcclxuICAgICAgICAgICAgdGhpcy5wb3dlcisrO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5wb3dlci0tO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5wb3dlciA+IDI1NSkge1xyXG4gICAgICAgICAgICB0aGlzLnBvd2VyID0gMjU1O1xyXG4gICAgICAgICAgICB0aGlzLnJpc2UgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBvd2VyID4gNTApIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucG93ZXIgJSAxMCA9PSAwKSB0aGlzLmJyZWVkKClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnBvd2VyXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGJyZWVkKCl7XHJcbiAgICAgICAgbGV0IGZyZWVfc3BhY2UgPSB0aGlzLmZyZWVfc3BhY2UoKVxyXG4gICAgICAgIGlmIChmcmVlX3NwYWNlLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbGV0IG5ld19jZWxsID0gbmV3IENlbGwxKHRoaXMudHlwZSlcclxuICAgICAgICAgICAgbGV0IHNvY2tldCA9IGZyZWVfc3BhY2VbMF1cclxuICAgICAgICAgICAgc29ja2V0LmNvbm5lY3RfY2VsbChuZXdfY2VsbClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDZWxsMVxyXG4iLCJjb25zdCBMaW5rczJEOCA9IFtbLTEsIC0xXSwgWzAsIC0xXSwgWzEsIC0xXSwgWy0xLCAwXSwgWzEsIDBdLCBbLTEsIDFdLCBbMCwgMV0sIFsxLCAxXV1cclxuXHJcbmNsYXNzIENlbGxCYXNlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0eXBlKSB7XHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZVxyXG4gICAgICAgIHRoaXMucG93ZXIgPSAxXHJcbiAgICB9XHJcblxyXG4gICAgY29ubmVjdF9saW5rcyhsaW5rcykge1xyXG4gICAgICAgIHRoaXMubGlua3MgPSBsaW5rc1xyXG4gICAgfVxyXG5cclxuICAgIGZyZWVfc3BhY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLmxpbmtzLmZpbHRlcihsID0+IGwuaXNfZW1wdHkoKSkpXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBDZWxsQmFzZSxcclxuICAgIExpbmtzMkQ4XHJcbn0iLCJjbGFzcyBTb2NrZXQge1xyXG4gICAgY29uc3RydWN0b3Ioc3BhY2UsIHYpIHtcclxuICAgICAgICB0aGlzLnNwYWNlID0gc3BhY2VcclxuICAgICAgICB0aGlzLnYgPSB2XHJcbiAgICAgICAgdGhpcy5jZWxsID0gbnVsbFxyXG4gICAgfVxyXG5cclxuICAgIGlzX2VtcHR5KCkge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5jZWxsID09PSBudWxsKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbm5lY3RfY2VsbChjZWxsKSB7XHJcbiAgICAgICAgdGhpcy5jZWxsID0gY2VsbFxyXG4gICAgICAgIGxldCBsaW5rcyA9IHRoaXMuc3BhY2UuZ2V0X3NvY2tldHNfYnlfcGF0dGVybih0aGlzLCBjZWxsLmNvbm5lY3Rpb25fcGF0dGVybilcclxuICAgICAgICBjZWxsLmNvbm5lY3RfbGlua3MobGlua3MpXHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU29ja2V0IiwiY29uc3QgU29ja2V0ID0gcmVxdWlyZSgnLi9zb2NrZXQnKTtcclxuXHJcbmNsYXNzIFNwYWNlMkQge1xyXG4gICAgY29uc3RydWN0b3Iod2lkdGgsIGhlaWdodCkge1xyXG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICB0aGlzLnNwYWNlID0gW11cclxuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuaGVpZ2h0OyB5KyspIHtcclxuICAgICAgICAgICAgbGV0IHJvdyA9IFtdXHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy53aWR0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICByb3cucHVzaChuZXcgU29ja2V0KHRoaXMsIFt4LCB5XSkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5zcGFjZS5wdXNoKHJvdylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29ubmVjdF9jZWxsKGNlbGwsIHgsIHkpIHtcclxuICAgICAgICBsZXQgc29ja2V0ID0gdGhpcy5zcGFjZVt4XVt5XVxyXG4gICAgICAgIHNvY2tldC5jb25uZWN0X2NlbGwoY2VsbClcclxuICAgIH1cclxuXHJcbiAgICBnZXRfc29ja2V0c19ieV9wYXR0ZXJuKHNvY2tldCwgcGF0dGVybikge1xyXG5cclxuICAgICAgICBsZXQgeCA9IHNvY2tldC52WzBdXHJcbiAgICAgICAgbGV0IHkgPSBzb2NrZXQudlsxXVxyXG5cclxuICAgICAgICBsZXQgc29ja2V0cyA9IFtdXHJcbiAgICAgICAgcGF0dGVybi5mb3JFYWNoKG9mZnNldCA9PiB7XHJcbiAgICAgICAgICAgIGxldCBueCA9IHggKyBvZmZzZXRbMF1cclxuICAgICAgICAgICAgbGV0IG55ID0geSArIG9mZnNldFsxXVxyXG4gICAgICAgICAgICBpZiAoIShueCA8IDAgfHwgbnggPj0gdGhpcy53aWR0aCB8fCBueSA8IDAgfHwgbnkgPj0gdGhpcy5oZWlnaHQpKVxyXG4gICAgICAgICAgICAgICAgc29ja2V0cy5wdXNoKHRoaXMuc3BhY2VbbnhdW255XSlcclxuXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgcmV0dXJuIHNvY2tldHNcclxuICAgIH1cclxuXHJcblxyXG4gICAgZm9yX2VhY2hfc29ja2V0KHRhc2spIHtcclxuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuaGVpZ2h0OyB5KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLndpZHRoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHRhc2sodGhpcy5zcGFjZVt4XVt5XSwgeCwgeSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoKSB7XHJcbiAgICAgICAgdGhpcy5mb3JfZWFjaF9zb2NrZXQoZnVuY3Rpb24gKHNvY2tldCwgeCwgeSkge1xyXG4gICAgICAgICAgICBpZiAoIXNvY2tldC5pc19lbXB0eSgpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc29ja2V0LmNlbGwudXBkYXRlKCkgPT0gMClcclxuICAgICAgICAgICAgICAgICAgICBzb2NrZXQuY2VsbCA9IG51bGxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgc2hvdyhjdHgsIGNlbGxfc2l6ZSkge1xyXG4gICAgICAgIHRoaXMuZm9yX2VhY2hfc29ja2V0KGZ1bmN0aW9uIChzb2NrZXQsIHgsIHkpIHtcclxuICAgICAgICAgICAgaWYgKCFzb2NrZXQuaXNfZW1wdHkoKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNlbGwgPSBzb2NrZXQuY2VsbFxyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGNlbGwyY29sb3IoY2VsbC50eXBlLCBjZWxsLnBvd2VyKVxyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0KHggKiBjZWxsX3NpemUsIHkgKiBjZWxsX3NpemUsIGNlbGxfc2l6ZSwgY2VsbF9zaXplKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gIGNlbGwyY29sb3IoY2VsbF90eXBlLCBjZWxsX3Bvd2VyKSB7XHJcbiAgICBzd2l0Y2ggKGNlbGxfdHlwZSkge1xyXG4gICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgcmV0dXJuICdyZ2IoJyArIGNlbGxfcG93ZXIgKyAnLDAsMCknXHJcbiAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICByZXR1cm4gJ3JnYigwLCcgKyBjZWxsX3Bvd2VyICsgJywwKSdcclxuICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgIHJldHVybiAncmdiKDAsMCwnICsgY2VsbF9wb3dlciArICcpJ1xyXG4gICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgcmV0dXJuICdyZ2IoJyArIGNlbGxfcG93ZXIgKyAnLCcgKyBjZWxsX3Bvd2VyICsgJywwKSdcclxuICAgICAgICBjYXNlIDU6XHJcbiAgICAgICAgICAgIHJldHVybiAncmdiKCcgKyBjZWxsX3Bvd2VyICsgJywwLCcgKyBjZWxsX3Bvd2VyICsgJyknXHJcbiAgICAgICAgY2FzZSA2OlxyXG4gICAgICAgICAgICByZXR1cm4gJ3JnYigwLCcgKyBjZWxsX3Bvd2VyICsnLCAnKyBjZWxsX3Bvd2VyICsgJyknXHJcbiAgICAgICAgY2FzZSA3OlxyXG4gICAgICAgICAgICByZXR1cm4gJ3JnYignKyBjZWxsX3Bvd2VyICsnLCcgKyBjZWxsX3Bvd2VyICsnLCAnKyBjZWxsX3Bvd2VyICsgJyknXHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTcGFjZTJEXHJcbiIsImNvbnN0IFNwYWNlMkQgPSByZXF1aXJlKCcuL2dlbl8wMDMvc3BhY2VfMmQnKTtcclxuY29uc3QgQ2VsbDEgPSByZXF1aXJlKCcuL2dlbl8wMDMvY2VsbDEnKTtcclxuXHJcbmxldCBjYW52YXM7XHJcbmxldCBzcGFjZTtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gYW5pbWF0aW9uX3N0ZXAodGltZXN0YW1wKSB7XHJcblxyXG4gICAgc3BhY2UudXBkYXRlKCk7XHJcbiAgICBzcGFjZS5zaG93KGN0eCwgOCk7XHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGlvbl9zdGVwKTtcclxufVxyXG5cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbiAoKSB7XHJcblxyXG5cclxuICAgIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpO1xyXG4gICAgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuXHJcbiAgICBjYW52YXMud2lkdGggPSA4MDA7XHJcbiAgICBjYW52YXMuaGVpZ2h0ID0gODAwO1xyXG5cclxuICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICBjdHguZmlsbFJlY3QoMCwgMCwgODAwLCA4MDApO1xyXG5cclxuICAgIHNwYWNlID0gbmV3IFNwYWNlMkQoMTAwLCAxMDApXHJcbiAgICBzcGFjZS5jb25uZWN0X2NlbGwobmV3IENlbGwxKDEpLCA1MCwgNTApXHJcbiAgICBzcGFjZS5jb25uZWN0X2NlbGwobmV3IENlbGwxKDIpLCA1MSwgNTApXHJcbiAgICBzcGFjZS5jb25uZWN0X2NlbGwobmV3IENlbGwxKDMpLCA1MiwgNTApXHJcbiAgICBzcGFjZS5jb25uZWN0X2NlbGwobmV3IENlbGwxKDQpLCA1MCwgNTEpXHJcbiAgICBzcGFjZS5jb25uZWN0X2NlbGwobmV3IENlbGwxKDUpLCA1MSwgNTEpXHJcbiAgICBzcGFjZS5jb25uZWN0X2NlbGwobmV3IENlbGwxKDYpLCA1MiwgNTEpXHJcbiAgICBzcGFjZS5jb25uZWN0X2NlbGwobmV3IENlbGwxKDcpLCA1MSwgNTIpXHJcblxyXG5cclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0aW9uX3N0ZXApO1xyXG59KTtcclxuXHJcblxyXG4iXX0=
