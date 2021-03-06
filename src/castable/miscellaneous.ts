export class CommaSeparatedStrings extends Array<string> {
  private constructor(...args: string[]) {
    super(...args);
  }

  static cast(line: string): CommaSeparatedStrings {
    let values = line
      .split(',')
      .map(str => str.trim())
      .filter(str => !!str);

    return new this(...values);
  }
}

export class CastableDate extends Date {
  private constructor(str: string) {
    super(str);
  }

  static cast(str: string): CastableDate {
    return new this(str);
  }
}

export { CastableDate as Date };
