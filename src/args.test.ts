import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getOptions } from "./args.js";

describe("getOptions", () => {
	it("returns JSON flag", () => {
		assert.deepEqual(getOptions(["--json"]), { json: true });
	});

	it("returns default value", () => {
		assert.deepEqual(getOptions([]), { json: false });
	});

	it("rejects arg values", () => {
		assert.throws(() => getOptions(["--json", "something"]));
	});

	it("rejects positional args", () => {
		assert.throws(() => getOptions(["json"]));
	});
});
