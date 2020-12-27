class Sandbox {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.field = []
        for (let i = 0; i < this.width; i++) {
            let row = []
            for (let j = 0; j < this.height; j++) {
                row.push(null)
            }
            this.field.push(row)
        }
    }

    is_free(x, y){
        return (this.field[x][y] == null)
    }

    for_each_cell(task) {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                let cell = this.field[i][j]
                if (cell) task(cell)
            }
        }
    }

    show(ctx, cell_size) {
        this.for_each_cell(function (cell) {
            cell.show(ctx, cell_size);
        })
    }


    update() {
        let self = this
        this.for_each_cell(function (cell) {
            if (cell.update(self) == 0)
                self.field[cell.x][cell.y] = null;
        })
    }


    spawn_cell(x, y, genome) {
        this.field[x][y] = new Cell(x, y, genome);
    }

    get_free_space(x, y) {
        let free_space = []
        let sx
        let sy
        sx = this.safe_x(x - 1)
        sy = this.safe_y(y - 1)
        if (!this.field[sx][sy]) free_space.push([sx, sy])

        sx = x
        sy = this.safe_y(y - 1)
        if (!this.field[sx][sy]) free_space.push([sx, sy])

        sx = this.safe_x(x + 1)
        sy = this.safe_y(y - 1)
        if (!this.field[sx][sy]) free_space.push([sx, sy])

        sx = this.safe_x(x - 1)
        sy = y
        if (!this.field[sx][sy]) free_space.push([sx, sy])

        sx = this.safe_x(x + 1)
        sy = y
        if (!this.field[sx][sy]) free_space.push([sx, sy])

        sx = this.safe_x(x - 1)
        sy = this.safe_y(y + 1)
        if (!this.field[sx][sy]) free_space.push([sx, sy])

        sx = x
        sy = this.safe_y(y + 1)
        if (!this.field[sx][sy]) free_space.push([sx, sy])

        sx = this.safe_x(x + 1)
        sy = this.safe_y(y + 1)
        if (!this.field[sx][sy]) free_space.push([sx, sy])

        return free_space
    }

    safe_coord(coord, number) {
        coord = coord % number
        if (coord < 0) return number + coord
        if (coord >= number) return coord - number
        return coord
    }

    safe_x(x) {
        return this.safe_coord(x, this.width)
    }

    safe_y(y) {
        return this.safe_coord(y, this.height)
    }

}
