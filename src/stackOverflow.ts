import type { Fact } from "./types.js";

interface Item {
  link: string;
}

interface SuccessResponse {
  items: Item[];
}

export async function getStackOverflowFact(id: number): Promise<Fact | null> {
  const res = await fetch(`https://api.stackexchange.com/2.3/users/${id}?site=stackoverflow`);
  const data = await res.json();
  if (!isSuccess(data)) {
    return null;
  }
  const [user] = data.items;
  if (!user) {
    return null;
  }
  return { url: new URL(user.link) };
}

function isSuccess(data: unknown): data is SuccessResponse {
  return data !== null && typeof data === "object" && "items" in data && Array.isArray(data.items);
}
