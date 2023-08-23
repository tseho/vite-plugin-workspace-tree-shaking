import tsxParser from '../src/tsxParser';

test('it extract exports from a typescript source file', async () => {
    expect(await tsxParser(
      `
import {Blush} from './Blush';

export {Blush};
`,
    ))
      .toEqual([`
import {Blush} from './Blush';

export {Blush};
`,
        [],
        [
          'Blush',
        ]
      ]);
  });
