
const Cells = require('./cell');

class Sandbox2D {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.field = []
        for (let i = 0; i < this.width; i++) {
            let row = []
            for (let j = 0; j < this.height; j++) {
                row.push(new Cells.NullCell([i, j]))
            }
            this.field.push(row)
        }
    }

    // is_free(x, y) {
    //     return (this.field[x][y] == null)
    // }

    for_each_cell(task) {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                let cell = this.field[i][j]
                if (cell) task(cell)
            }
        }
    }

    // show(ctx, cell_size) {
    //     this.for_each_cell(function (cell) {
    //         cell.show(ctx, cell_size);
    //     })
    // }

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


    set_cell(cell) {
        this.field[cell.x][cell.y] = cell
    }

    get_cell(v) {
        let x = v[0]
        let y = v[1]

        if (x < 0 || x >= this.width || y < 0 || y >= this.height)
            return new Cells.BorderCell(v)

        return this.field[x][y]
    }

}
module.exports = Sandbox2D;
// module.exports = Sandbox;