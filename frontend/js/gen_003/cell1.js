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
