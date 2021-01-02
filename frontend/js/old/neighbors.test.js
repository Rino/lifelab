//import Sandbox from './sandbox';

const Neighbors = require('./neighbors');
const Sandbox2D = require('./sandbox_2d');

test('get neighbors of cell in sandbox', () => {
    sandbox = new Sandbox2D(30, 30)
    let nb = new Neighbors(sandbox, [10, 10])
    expect(nb.cells[0].v).toEqual([9,9]);
    expect(nb.cells[1].v).toEqual([10,9]);
    expect(nb.cells[2].v).toEqual([11,9]);
    expect(nb.cells[3].v).toEqual([9,10]);
    expect(nb.cells[4].v).toEqual([10,10]);
    expect(nb.cells[5].v).toEqual([11,10]);
    expect(nb.cells[6].v).toEqual([9,11]);
    expect(nb.cells[7].v).toEqual([10,11]);
    expect(nb.cells[8].v).toEqual([11,11]);
});

test('get free free_space', () => {
    sandbox = new Sandbox2D(30, 30)
    sandbox.set_cell()
    let nb = new Neighbors(sandbox, [10, 10])
    expect(nb.cells[0].v).toEqual([9,9]);
    expect(nb.cells[1].v).toEqual([10,9]);
    expect(nb.cells[2].v).toEqual([11,9]);
    expect(nb.cells[3].v).toEqual([9,10]);
    expect(nb.cells[4].v).toEqual([10,10]);
    expect(nb.cells[5].v).toEqual([11,10]);
    expect(nb.cells[6].v).toEqual([9,11]);
    expect(nb.cells[7].v).toEqual([10,11]);
    expect(nb.cells[8].v).toEqual([11,11]);
});
