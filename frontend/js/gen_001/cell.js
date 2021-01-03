class NullCell{
    constructor(v) {
        this.v = v
    }

    update(){

    }

    show(){

    }
}

class BorderCell{
    constructor(v) {
        this.v = v
    }
}

class Cell {
    constructor(x, y, genome) {
        this.power = 1
        this.rise = true
        this.x = x
        this.y = y
        this.genome = genome
        this.color = genome['color']
        this.breed_factor = genome['breed_factor']
        this.breed_schema = genome['breed_schema']
        this.breed_direction = genome['breed_direction']
        this.mutation_period = genome['mutation_period']

    }

    show(ctx, cell_size) {

        switch (this.color) {
            case 'red':
                ctx.fillStyle = 'rgb(' + this.power + ', 0 , 0)';
                break;
            case 'green':
                ctx.fillStyle = 'rgb(0,' + this.power + ', 0)';
                break;
            case 'blue':
                ctx.fillStyle = 'rgb(0, 0,' + this.power + ' )';
                break;
        }
        ctx.fillRect(this.x * cell_size, this.y * cell_size, cell_size, cell_size);
    }

    breed(sandbox) {
        let free_spaces
        switch (this.breed_schema) {
            case 1:
                let neighbors =  new Neighbors(sandbox, [this.x, this.y])
                free_spaces = neighbors.free_space
                if (free_spaces.length > 0) {
                    let place = free_spaces[getRandomInt(free_spaces.length)]
                    sandbox.spawn_cell(place[0], place[1], this.genome)
                }
                break;
            case 2:
                free_spaces = sandbox.get_free_space(this.x, this.y)
                let deep_free_spaces = free_spaces.map(space => [space[0], space[1], sandbox.get_free_space(space[0], space[1])]);

                const reducer = (max_len, current) => Math.max(max_len, current[2].length)

                let max_free_space = deep_free_spaces.reduce(reducer, 0)
                if (max_free_space > 0) {
                    let candidates = deep_free_spaces.filter(space => space[2].length == max_free_space);
                    let place = candidates[getRandomInt(candidates.length)]
                    sandbox.spawn_cell(place[0], place[1], this.genome)
                }
                break;
            case 3:
                console.log("breed")
                let breed_direction = []
                Object.assign(breed_direction, this.breed_direction);

                if (getRandomInt(this.mutation_period) == 0) {
                    breed_direction[0] = (1 - getRandomInt(2)) * breed_direction[0]
                }
                if (getRandomInt(this.mutation_period) == 0) {
                    breed_direction[1] = (1 - getRandomInt(2)) * breed_direction[1]
                }

                let new_x = sandbox.safe_x(this.x + breed_direction[0])
                let new_y = sandbox.safe_y(this.y + breed_direction[1])

                if (sandbox.is_free(new_x, new_y)) {
                    console.log("free!")
                    sandbox.spawn_cell(new_x, new_y, this.genome)
                }
                break;

        }
    }

    update(sandbox) {
        if (this.rise)
            this.power++;
        else
            this.power--;

        if (this.power > 255) {
            this.power = 255;
            this.rise = false;
        }

        if (this.power > 150) {
            if (getRandomInt(this.breed_factor) == 1) this.breed(sandbox)
        }


        return this.power
    }


}

module.exports = {
    NullCell,
    BorderCell,
    Cell
}
