#!/usr/bin/env node
import { createSummary } from "./index.js";

const facts = await createSummary({
  stackOverflowId: 3001761,
});

for (const fact of facts) {
  console.log(`Link: ${fact.url}`);
}

process.exitCode = 0;
