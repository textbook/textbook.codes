#!/usr/bin/env node
import { getOptions } from "./args.js";
import { type Formatter, JsonFormatter, TextFormatter } from "./formatters.js";
import { createSummary } from "./index.js";

const { json } = getOptions(process.argv.slice(2));
const formatter: Formatter = json ? new JsonFormatter() : new TextFormatter();

formatter.write(await createSummary({
  githubUsername: "textbook",
  stackOverflowId: 3001761,
}));
