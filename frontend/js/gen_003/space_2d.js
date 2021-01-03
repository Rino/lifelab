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
