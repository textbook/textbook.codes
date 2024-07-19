import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import { createSummary } from "./index.js";

const server = setupServer();

describe("createSummary", () => {
  before(() => server.listen({ onUnhandledRequest: "error" }));

  beforeEach(() => server.resetHandlers());

  after(() => server.close());

  function createError(description: string): HttpResponse {
    return HttpResponse.json(
      { error_id: 400, error_message: description, error_name: "bad_parameter"  },
      { status: 400 },
    );
  }

  it("gets data from Stack Overflow", async () => {
    const creation = new Date()
    creation.setDate(creation.getDate() - 29);
    const id = 123456;
    const url = "https://stackoverflow.com/users/123456/johndoe";

    server.use(
      http.get("https://api.stackexchange.com/2.3/users/:id", ({ params, request }) => {
        if (params.id !== id.toString()) {
          return HttpResponse.json({ items: [] });
        }
        const site = new URL(request.url).searchParams.get("site");
        if (!site) {
          return createError("site is required");
        }
        if (site !== "stackoverflow") {
          return createError(`No site found for name \`${site}\``);
        }
        return HttpResponse.json({ items: [{
          badge_counts: { bronze: 123, silver: 45, gold: 6 },
          creation_date: Math.round(creation.getTime() / 1_000),
          link: url,
          reputation: 12_345,
         }] });
      }),
    );

    const summary = await createSummary({ stackOverflowId: id });

    assert.deepEqual(summary, [{
      details: [
        `⭐️ 12,345 [🥇6 / 🥈45 / 🥉123]`,
        `📅 ${creation.getFullYear()}-${(creation.getMonth() + 1).toString().padStart(2, "0")}-${creation.getDate().toString().padStart(2, "0")} (29 days)`,
      ],
      title: "Stack Overflow",
      url: new URL(url),
    }]);
  });
});
