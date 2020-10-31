import { existsSync, writeFileSync } from 'fs';
import { Archiver } from '@wabarc/archiver';
import { Config, Context, Task } from './types';
import { createFilename } from './utils';
import { minify } from 'html-minifier';

export class Packer {
  private channel: string;
  private context: Context;

  constructor(config: Config) {
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

    if (!existsSync(this.context.dir)) {
      throw new Error(`Directory ${this.context.dir} not exists or no permission.`);
    }

    const task: Task[] = [];
    const archiver = new Archiver();

    for (let start = this.context.from; start <= this.context.to; start++) {
      const archived = await archiver.telegram({ channel: this.channel, msgid: start }).start();
      if (archived.length === 0) {
        task.push({ id: start, url: '', path: '', success: false });
      }

      archived.forEach((arc: { url: string; title: string; content: string }) => {
        const filepath = `${this.context.dir}/${createFilename(arc.url, arc.title)}`;
        if (filepath.endsWith('/')) {
          console.warn('Packer warn: filepath is directory, skip');
          return;
        }

        try {
          arc.content = minify(arc.content, {
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
          });
        } catch (_) {
          console.warn('Packer warn: minify failure.');
        }

        try {
          writeFileSync(filepath, arc.content);
        } catch (e) {
          console.warn(`Packer failure: illegal operation, code '${e.code}', open '${e.path}'`);
          arc.content = '';
          return;
        }

        task.push({ id: start, url: arc.url, path: filepath, success: true });
      });
    }

    return task;
  }
}
