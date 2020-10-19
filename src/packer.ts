import { statSync, writeFile } from 'fs';
import { Archiver } from '@wabarc/archiver';
import { Config, Context, Task } from './types';
import { createFilename } from './utils';

export class Packer {
  private channel: string;
  private context: Context;

  constructor(private config: Config) {
    const { channel, context } = config;
    this.channel = channel;
    this.context = context;
  }

  async on(): Promise<Task[]> {
    if (
      !this.channel ||
      this.context.dir === undefined ||
      this.context.from === undefined ||
      this.context.to === undefined ||
      this.context.from > this.context.to
    ) {
      throw new Error('Missing params.');
    }

    if (!statSync(this.context.dir)) {
      throw new Error(`Directory ${this.context.dir} not exists or no permission.`);
    }

    let success = false;
    const task: Task[] = [];

    const archiver = new Archiver();

    for (let start = this.context.from; start <= this.context.to; start++) {
      const archived = await archiver.telegram({ channel: this.channel, msgid: start }).start();
      if (archived.length === 0) {
        task.push({ id: start, url: '', path: '', success: success });
      }

      archived.forEach((arc: { url: string; title: string; content: string }) => {
        const filepath = `${this.context.dir}/${createFilename(arc.url, arc.title)}`;
        writeFile(filepath, arc.content, (err) => {
          if (err) {
            console.warn(`${arc.url} => ${err}`);
            return;
          } else {
            success = arc.url.length > 0 && arc.content.length > 0;
          }
        });
        task.push({ id: start, url: arc.url, path: filepath, success: success });
      });
    }

    return task;
  }
}
