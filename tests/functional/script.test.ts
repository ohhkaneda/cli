import { createTestHarness } from "./testUtils.ts"
import { spy } from "deno/testing/mock.ts"
import { assert, assertEquals } from "deno/testing/asserts.ts"

const fixturesDir = new URL(import.meta.url).path().parent().parent().join('fixtures')

Deno.test("run a python script", { sanitizeResources: false, sanitizeOps: false }, async () => {
  const { run, teaDir, useRunInternals } = await createTestHarness()

  const scriptFile = fixturesDir.join("script.py").cp({into: teaDir}).string

  const useRunSpy = spy(useRunInternals, "nativeRun")
  try {
    await run([scriptFile])
  } finally {
    useRunSpy.restore()
  }

  const [python, script] = [useRunSpy.calls[0].args[0], ...useRunSpy.calls[0].args[1].args!]

  assert(python.toString().startsWith("python3."))
  assertEquals(script, scriptFile)
})
