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
