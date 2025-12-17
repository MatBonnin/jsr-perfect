/**
 * @module
 * Mini framework de test pour Deno.
 */

/**
 * Fonction de test (synchrone ou asynchrone).
 */
export type TestFn = () => void | Promise<void>;

/**
 * Cas de test enregistre dans une suite.
 */
export type TestCase = {
  name: string;
  fn: TestFn;
};

/**
 * Suite de tests pouvant contenir des sous-suites.
 */
export type TestSuite = {
  name: string;
  tests: TestCase[];
  suites: TestSuite[];
};

/**
 * Resultat global d'une execution de tests.
 */
export type TestRunResult = {
  total: number;
  passed: number;
  failed: number;
};

/**
 * Erreur levee par une assertion.
 */
export class AssertionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AssertionError";
  }
}

type SuiteStack = {
  root: TestSuite;
  current: TestSuite;
};

const rootSuite = createSuite("(root)");
const suiteStack: SuiteStack = {
  root: rootSuite,
  current: rootSuite,
};

function createSuite(name: string): TestSuite {
  return { name, tests: [], suites: [] };
}

function resetRegistry(): void {
  suiteStack.root.tests = [];
  suiteStack.root.suites = [];
  suiteStack.current = suiteStack.root;
}

/**
 * Declare une suite de tests.
 *
 * @param name - Nom de la suite
 * @param fn - Fonction qui enregistre les tests de la suite
 */
export function describe(name: string, fn: () => void): void {
  if (!name.trim()) {
    throw new Error("describe() requiert un nom non vide.");
  }
  const parent = suiteStack.current;
  const suite = createSuite(name);
  parent.suites.push(suite);
  suiteStack.current = suite;
  try {
    fn();
  } finally {
    suiteStack.current = parent;
  }
}

/**
 * Declare un test dans la suite courante.
 *
 * @param name - Nom du test
 * @param fn - Fonction de test
 */
export function test(name: string, fn: TestFn): void {
  if (!name.trim()) {
    throw new Error("test() requiert un nom non vide.");
  }
  suiteStack.current.tests.push({ name, fn });
}

/**
 * Objet d'assertions pour comparer une valeur recue.
 *
 * @param received - Valeur obtenue lors du test
 * @returns Matchers d'assertion
 */
export function expect<T>(received: T): { toBe: (expected: T) => void } {
  return {
    toBe(expected: T) {
      if (!Object.is(received, expected)) {
        const message = `Expected ${formatValue(expected)} but received ${
          formatValue(received)
        }.`;
        throw new AssertionError(message);
      }
    },
  };
}

/**
 * Execute toutes les suites enregistrees et affiche un resume.
 *
 * @returns Resultat global de l'execution
 */
export async function run(): Promise<TestRunResult> {
  const result: TestRunResult = { total: 0, passed: 0, failed: 0 };
  try {
    await runSuite(suiteStack.root, [], result);
  } finally {
    resetRegistry();
  }

  const summary = `${result.passed}/${result.total} tests passed.`;
  if (result.failed > 0) {
    console.error(summary);
    throw new Error(`${result.failed} test(s) failed.`);
  }
  console.log(summary);
  return result;
}

async function runSuite(
  suite: TestSuite,
  path: string[],
  result: TestRunResult,
): Promise<void> {
  const nextPath = suite.name === "(root)" ? path : [...path, suite.name];

  for (const testCase of suite.tests) {
    const fullName = formatTestName(nextPath, testCase.name);
    result.total += 1;
    try {
      await testCase.fn();
      result.passed += 1;
      console.log(`ok ${fullName}`);
    } catch (error) {
      result.failed += 1;
      console.error(`fail ${fullName}`);
      console.error(error);
    }
  }

  for (const child of suite.suites) {
    await runSuite(child, nextPath, result);
  }
}

function formatTestName(path: string[], name: string): string {
  if (path.length === 0) {
    return name;
  }
  return `${path.join(" > ")} > ${name}`;
}

function formatValue(value: unknown): string {
  if (typeof value === "string") {
    return `"${value}"`;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (value === null) {
    return "null";
  }
  if (value === undefined) {
    return "undefined";
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}
