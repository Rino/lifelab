class Neighbors {

    constructor(sandbox, v) {
        const offsets = [[-1, -1], [0, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]
        this.cells = offsets.map(offset => sandbox.get_cell([v[0] + offset[0], v[1] + offset[1]]))
    }



    free_space() {
        return this.cells.filter(cell => cell instanceof NullCell)
    }

}


module.exports = Neighbors;