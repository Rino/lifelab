const Links2D8 = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]

class CellBase {

    constructor(type) {
        this.type = type
        this.power = 1
    }

    connect_links(links) {
        this.links = links
    }

    free_space() {
        return (this.links.filter(l => l.is_empty()))
    }

}


module.exports = {
    CellBase,
    Links2D8
}