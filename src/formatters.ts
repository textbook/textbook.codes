import chalk from "chalk";

import type { Fact } from "./types.js";

export abstract class Formatter {
	constructor(protected log: Console["log"] = console.log) {}
	abstract write(facts: Fact[]): void;
}

export class JsonFormatter extends Formatter {
	write(facts: Fact[]) {
		this.log(JSON.stringify(facts, null, 2));
	}
}

export class TextFormatter extends Formatter {
	write(facts: Fact[]) {
		for (const fact of facts) {
			this.log(chalk.bold.underline(fact.title));
			if (fact.details) {
				for (const line of fact.details) {
					this.log(line);
				}
			}
			this.log("🔗", chalk.cyan.underline(fact.url.toString()));
			this.log("\n");
		}
	}
}
