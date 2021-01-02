class Cell {

    constructor(type) {
        this.type = type
    }

}

class Cell1 extends  Cell{

    constructor(type) {
        super(type)
        this.rise = true
        this.power = 1
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
        let free_space = this.env.free_space()
        if (free_space.length > 0) {
            let new_cell = new Cell1(this.type)
            let new_env = free_space[0]
            new_env.cell = new_cell
            new_cell.env = new_env
        }
    }

}


//
// module.exports = {
//     Cell,
//     Cell1
// }