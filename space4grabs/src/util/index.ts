export const arrayWithSize = <T, R = T extends void ? null : T>(size: number, fillWith?: T): R[] =>
    Array(size).fill(fillWith === undefined ? null : fillWith);

export const arrayShuffle = <T extends any[]>(arr: T) =>
    arr.map(value => ({rand: Math.random(), value}))
        .sort((a, b) => a.rand - b.rand)
        .map(({value}) => value);

export const arrayCount = <T>(arr: T[], op: (item: T) => boolean = (item: T) => true) =>
    arr.filter(op).length;

export const arrayCountAggregate = <T>(arr: T[], op: (item: T) => number = (item: T) => 1) =>
    arr.reduce((r, a) => r + op(a), 0);

export const numberRange = (from: number, to: number) =>
    arrayWithSize(to - from + 1).map((_, ix) => from + ix);
