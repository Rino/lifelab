class Cell {
    constructor(x, y, genome) {
        this.power = 1
        this.rise = true
        this.x = x
        this.y = y
        this.genome = genome
        this.color = genome['color']
        this.breed_factor = genome['breed_factor']
        console.log(genome);
    }

    show(ctx, cell_size) {

        switch(this.color){
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
        let free_spaces = sandbox.get_free_space(this.x, this.y)
        if(free_spaces.length > 0){
            let place = free_spaces[getRandomInt(free_spaces.length)]
            sandbox.spawn_cell(place[0], place[1], this.genome)
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
            if(getRandomInt(this.breed_factor) == 1) this.breed(sandbox)
        }


        return this.power
    }


}
