import { formatDistanceToNowStrict } from "date-fns";

import type { Fact } from "./types.js";

interface Item {
  badge_counts: { bronze: number; gold: number; silver: number };
  creation_date: number;
  reputation: number,
  link: string;
}

interface SuccessResponse {
  items: Item[];
}

export async function getStackOverflowFact(id: number): Promise<Fact | undefined> {
  const user = await fetchUserData(id);
  if (!user) {
    return;
  }
  const badges = [
    `🥇${user.badge_counts.gold.toLocaleString()}`,
    `🥈${user.badge_counts.silver.toLocaleString()}`,
    `🥉${user.badge_counts.bronze.toLocaleString()}`,
  ].join(" / ");
  const created = new Date(user.creation_date * 1000);
  return {
    details: [
      `⭐️ ${user.reputation.toLocaleString()} [${badges}]`,
      `📅 ${created.toISOString().slice(0, 10)} (${formatDistanceToNowStrict(created)})`,
    ],
    title: "Stack Overflow",
    url: new URL(user.link),
  };
}

async function fetchUserData(id: number): Promise<Item | undefined> {
  const res = await fetch(`https://api.stackexchange.com/2.3/users/${id}?site=stackoverflow`);
  const data = await res.json();
  if (!isSuccess(data)) {
    return;
  }
  return data.items[0];
}

function isSuccess(data: unknown): data is SuccessResponse {
  return data !== null && typeof data === "object" && "items" in data && Array.isArray(data.items);
}
