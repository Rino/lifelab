class Socket {
    constructor(space, v) {
        this.space = space
        this.v = v
        this.cell = null
    }

    is_empty() {
        return (this.cell === null)
    }

    connect_cell(cell) {
        this.cell = cell
        let links = this.space.get_sockets_by_pattern(this, cell.connection_pattern)
        cell.connect_links(links)
    }
}

module.exports = Socket