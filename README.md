# packer

🚨 **This package is deprecated! Please use [wabarc/archiver](https://github.com/wabarc/archiver), instead.**

Read this in other languages: English | [简体中文](./README_zh-CN.md)

Pack and store webpages from Telegram channel.

## Installation

Using npm:

```bash
npm install @wabarc/packer
```

Using yarn:

```bash
yarn add @wabarc/packer
```

## Example

```javascript
import { Packer } from '@wabarc/packer';

const packer = new Packer({ channel: 'telegram_channel_name', context: { dir: process.cwd(), from: 1, to: 3 } });
const pack = await packer.on();
console.log(pack)
```

## Instance methods

The available instance methods are listed below.

- packer({ channel: string, context: { dir: string, from: number, to: number } })
- packer#on()

## Request Params

### Telegram

These are the available options for archival webpage from Telegram channel. `channel` and `context` are required.

```javascript
{
  // `channel` is the Telegram channel name
  channel: 'wabarc_testing',

  // `context` is use to fetch webpages and store directory
  context: {
    dir: 'directory-to-store-webpages',
    from: 1,
    to: 3
  }
}
```

## Response Schema

```javascript
[
  { id: 1, url: '', success: false },
  { id: 2, url: 'https://www.google.com', success: false },
  { id: 3, url: 'https://www.google.com', success: true }
]
```

## License

This software is released under the terms of the GNU General Public License v3.0. See the [LICENSE](https://github.com/wabarc/packer/blob/main/LICENSE) file for details.
