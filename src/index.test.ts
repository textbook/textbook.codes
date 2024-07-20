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
        `📅 ${toISODateString(creation)} (29 days)`,
      ],
      title: "Stack Overflow",
      url: new URL(url),
    }]);
  });

  it("gets data from GitHub", async () => {
    const creation = new Date()
    creation.setDate(creation.getDate() - 29);
    const username = "johndoe";
    server.use(
      http.get("https://api.github.com/users/:id", ({ params, request }) => {
        if (params.id !== username) {
          return HttpResponse.json({ message: "Not Found", status: 404 }, { status: 404 });
        }
        return HttpResponse.json({
          html_url: `https://github.com/${username}`,
          login: username,
          created_at: creation.toISOString(),
        });
      })
    );

    const summary = await createSummary({ githubUsername: username });

    assert.deepEqual(summary, [{
      title: "GitHub",
      details: [
        `📅 ${toISODateString(creation)} (29 days)`,
      ],
      url: new URL("https://github.com/johndoe"),
    }]);
  });
});

function toISODateString(date: Date): string {
  return [
    date.getFullYear(),
    (date.getMonth() + 1).toString().padStart(2, "0"),
    date.getDate().toString().padStart(2, "0"),
  ].join("-");
}
