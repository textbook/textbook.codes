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
        return HttpResponse.json({ items: [{ link: url }] });
      }),
    );

    const summary = await createSummary({ stackOverflowId: id });

    assert.equal(summary[0]?.url.toString(), url);
  });
});
