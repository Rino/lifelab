const Space2D = require('./space_2d');
const Cell1 = require('./cell1');


test('creates space with connected cells', () => {
    let space = new Space2D(2, 2)
    space.connect_cell(new Cell1(0), 0, 0)
    //console.log(space)
    //let free_space = space.space[0][0].free_space()
    //console.log(free_space)
    // let nb = new Neighbors(sandbox, [10, 10])
    // expect(nb.cells[0].v).toEqual([9,9]);
    // expect(nb.cells[1].v).toEqual([10,9]);
    // expect(nb.cells[2].v).toEqual([11,9]);
    // expect(nb.cells[3].v).toEqual([9,10]);
    // expect(nb.cells[4].v).toEqual([10,10]);
    // expect(nb.cells[5].v).toEqual([11,10]);
    // expect(nb.cells[6].v).toEqual([9,11]);
    // expect(nb.cells[7].v).toEqual([10,11]);
    // expect(nb.cells[8].v).toEqual([11,11]);
});
