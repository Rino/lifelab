//import Sandbox from './sandbox';

const Sandbox = require('./sandbox');

test('safe coord, overflow', () => {
    expect(Sandbox.safe_coord(1, 100)).toBe(1);
});