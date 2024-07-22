import chalk from "chalk";

import type { Fact, Summary } from "./types.js";

export abstract class Formatter {
	constructor(protected log: Console["log"] = console.log) {}
	abstract write(summary: Summary): void;
}

export class JsonFormatter extends Formatter {
	write(summary: Summary) {
		this.log(JSON.stringify(summary, null, 2));
	}
}

export class TextFormatter extends Formatter {
	write({ description, facts, name }: Summary) {
		this.log("👤", chalk.bold(name), "\n");
		if (description) {
			this.log(chalk.italic(description), "\n");
		}
		for (const fact of facts) {
			this.log(chalk.bold.underline(fact.title));
			if (fact.details) {
				for (const line of fact.details) {
					this.log(line);
				}
			}
			this.log("🔗", chalk.cyan.underline(fact.url.toString()), "\n");
		}
	}
}
