import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";

import { JsonFormatter, TextFormatter } from "./formatters.js";

describe("formatters", () => {
	describe("TextFormatter", () => {
		it("passes through the fact data", () => {
			const write = mock.fn();
			new TextFormatter(write).write([{ title: "Hello", url: new URL("https://example.com/") }]);
			assert.equal(write.mock.calls.length, 3);
			assert.deepEqual(write.mock.calls.map(({ arguments: args }) => args),  [
				['\x1B[1m\x1B[4mHello\x1B[24m\x1B[22m'],
				['🔗', '\x1B[36m\x1B[4mhttps://example.com/\x1B[24m\x1B[39m'],
				['\n'],
			]);
		});
	});

	describe("JsonFormatter", () => {
		it("stringifies the argument", () => {
			const write = mock.fn();
			new JsonFormatter(write).write([{ title: "Hello", url: new URL("https://example.com/") }]);
			assert.equal(write.mock.calls.length, 1)
			assert.deepEqual(write.mock.calls[0]?.arguments, [`[
  {
    "title": "Hello",
    "url": "https://example.com/"
  }
]`]);
		});
	});
});
