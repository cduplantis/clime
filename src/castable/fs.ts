import * as FS from 'fs';
import * as Path from 'path';

import * as v from 'villa';

import {
  Context,
  ExpectedError,
} from '../core';

export class File {
  readonly baseName: string;
  readonly fullName: string;

  private constructor(
    public readonly source: string,
    public readonly cwd: string,
  ) {
    this.baseName = Path.basename(source);
    this.fullName = Path.resolve(cwd, source);
  }

  require<T>(): T {
    try {
      return require(this.fullName);
    } catch (error) {
      throw new ExpectedError(`Error requiring file "${this.source}"`);
    }
  }

  async buffer(): Promise<Buffer> {
    await this.assert();
    return v.call<Buffer>(FS.readFile, this.fullName);
  }

  async text(encoding = 'utf-8'): Promise<string> {
    await this.assert();
    return v.call<string>(FS.readFile, this.fullName, encoding);
  }

  async json<T>(encoding?: string): Promise<T> {
    let json = await this.text(encoding);
    return JSON.parse(json);
  }

  async assert(exists = true): Promise<void> {
    let stats = await v.call(FS.stat, this.fullName).catch(v.bear);

    if (exists) {
      if (!stats) {
        throw new ExpectedError(`File "${this.source}" does not exist`);
      }

      if (!stats.isFile()) {
        throw new ExpectedError(`Object "${this.source}" is expected to be a file`);
      }
    } else if (stats) {
      throw new ExpectedError(`Object "${this.source}" already exists`);
    }
  }

  static cast(name: string, context: Context): File {
    return new this(name, context.cwd);
  }
}

export class Directory {
  readonly baseName: string;
  readonly fullName: string;

  private constructor(
    public readonly source: string,
    public readonly cwd: string,
  ) {
    this.baseName = Path.basename(source);
    this.fullName = Path.resolve(cwd, source);
  }

  async assert(exists = true): Promise<void> {
    let stats = await v.call(FS.stat, this.fullName).catch(v.bear);

    if (exists) {
      if (!stats) {
        throw new ExpectedError(`Directory "${this.source}" does not exist`);
      }

      if (!stats.isDirectory()) {
        throw new ExpectedError(`Object "${this.source}" is expected to be a directory`);
      }
    } else if (stats) {
      throw new ExpectedError(`Object "${this.source}" already exists`);
    }
  }

  static cast(name: string, context: Context): Directory {
    return new this(name, context.cwd);
  }
}
