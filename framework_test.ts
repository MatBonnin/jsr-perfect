import {
  AssertionError,
  describe,
  expect,
  run,
  test,
} from "./mod.ts";
import { assertEquals, assertRejects, assertThrows } from "jsr:@std/assert";

Deno.test("mini framework de test", async () => {
  expect(4).toBe(4);
  assertThrows(() => expect(4).toBe(5), AssertionError);

  describe("suite simple", () => {
    test("addition", () => {
      expect(2 + 2).toBe(4);
    });
  });

  const result = await run();
  assertEquals(result, { total: 1, passed: 1, failed: 0 });

  describe("suite en echec", () => {
    test("faux", () => {
      expect("a").toBe("b");
    });
  });

  await assertRejects(() => run(), Error);
});
