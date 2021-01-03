class CellEnv {

    constructor(cell = null) {
        this.cell = null
    }

    is_empty() {
        return (this.cell === null)
    }

    free_space() {
        return (this.links.filter(l => l.is_empty()))
    }

}


class Space2D {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.space = []
        for (let y = 0; y < this.height; y++) {
            let row = []
            for (let x = 0; x < this.width; x++) {
                row.push(new CellEnv)
            }
            this.space.push(row)
        }
        this.connect_all()
    }


    connect_all() {
        let self = this
        this.for_each_env(function (env, x, y) {
            self.connect_env(x, y)
        })
    }

    connect_env(x, y) {
        const offsets = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]

        let env = this.space[x][y]
        let links = []
        offsets.forEach(offset => {
            let nx = x + offset[0]
            let ny = y + offset[1]
            if (!(nx < 0 || nx >= this.width || ny < 0 || ny >= this.height))
                links.push(this.space[nx][ny])

        })

        env.links = links
    }


    for_each_env(task) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                task(this.space[x][y], x, y)
            }
        }
    }

    update() {
        this.for_each_env(function (env, x, y) {
            if (!env.is_empty()) {
                if(env.cell.update() == 0)
                    env.cell = null
            }
        })
    }

    show(ctx, cell_size) {
        this.for_each_env(function (env, x, y) {
            if (!env.is_empty()) {
                let cell = env.cell
                ctx.fillStyle = 'rgb(' + cell.power + ',0,0)'
                // ctx.fillStyle = 'rgb(255,0,0)';
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

module.exports = {
    Space2D
}