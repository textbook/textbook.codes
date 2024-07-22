#!/usr/bin/env node
import { getOptions } from "./args.js";
import { type Formatter, JsonFormatter, TextFormatter } from "./formatters.js";
import { createSummary } from "./index.js";

const { json } = getOptions(process.argv.slice(2));
const formatter: Formatter = json ? new JsonFormatter() : new TextFormatter();

formatter.write(await createSummary({
  description: "Software engineering consultant based in London, UK.",
  githubUsername: "textbook",
  name: "Jonathan Sharpe",
  stackOverflowId: 3001761,
}));
