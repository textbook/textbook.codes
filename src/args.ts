import { parseArgs } from "node:util";

import type { Options } from "./types.js";

export function getOptions(args: string[]): Options {
	const { values } = parseArgs({
		args,
		options: {
			json: {
				short: "j",
				type: "boolean",
			},
		}
	});
	return {
		json: values.json ?? false,
	};
}
