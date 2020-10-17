import { Packer } from '../src';

it('should process packer', async () => {
  const packer = new Packer({ channel: 'wabarc_testing', context: { dir: process.cwd(), from: 1, to: 3 } });
  expect(packer).toBeInstanceOf(Packer);

  const pack = await packer.on();
  expect(pack.filter((pck) => pck.success === true).length).toEqual(1);
  expect(pack.filter((pck) => pck.success === false).length).toEqual(2);
  expect(pack.filter((pck) => pck.url === '').length).toEqual(1);
});
