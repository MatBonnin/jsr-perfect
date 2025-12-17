import { describe, expect, run, test } from "@matbonnin/test";

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
