export declare type Task = {
  id: number;
  url: string;
  path: string;
  success: boolean;
};

export declare type Context = {
  dir: string;
  from: number;
  to: number;
};

export declare type Config = {
  channel: string;
  context: Context;
};
