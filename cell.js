class Cell {
    constructor(x, y) {
        this.power = 1;
        this.rise = true;
        this.x = x;
        this.y = y;
    }

    show(ctx, cell_size) {
        ctx.fillStyle = 'rgb(0,' + this.power + ', 0)';
        ctx.fillRect(this.x * cell_size, this.y * cell_size, cell_size, cell_size);
    }

    breed(env) {
        let free_spaces = env.get_free_space(this.x, this.y)
        if(free_spaces.length > 0){
            let place = free_spaces[getRandomInt(free_spaces.length)]
            env.spawn_cell(place[0], place[1])
        }
    }

    update(env) {
        if (this.rise)
            this.power++;
        else
            this.power--;

        if (this.power > 255) {
            this.power = 255;
            this.rise = false;
        }

        if (this.power > 150) {
            if(getRandomInt(80) == 1) this.breed(env)
        }


        return this.power
    }


}
