# @matbonnin/test

Mini framework de test pour Deno avec `describe`, `test`, `expect` et `run`.

## Installation

```ts
import { describe, test, expect, run } from "jsr:@matbonnin/test";
```

## Utilisation

```ts
import { describe, test, expect, run } from "jsr:@matbonnin/test";

describe("Arithmetic Operations", () => {
  test("should add two numbers correctly", () => {
    const result = 2 + 3;
    expect(result).toBe(5);
  });

  test("should multiply two numbers correctly", () => {
    const result = 4 * 4;
    expect(result).toBe(16);
  });
});

describe("String Operations", () => {
  test("should concatenate strings", () => {
    const str = "Hello " + "World";
    expect(str).toBe("Hello World");
  });
});

await run();
```

## Demo locale

Un projet de demonstration se trouve dans `examples/demo`.

## API

```ts
describe(name: string, fn: () => void): void
test(name: string, fn: () => void | Promise<void>): void
expect<T>(received: T): { toBe: (expected: T) => void }
run(): Promise<{ total: number; passed: number; failed: number }>
```
