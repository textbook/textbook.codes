import { formatDistanceToNowStrict } from "date-fns";
import { Fact } from "./types.js";

interface GithubUser {
  created_at: string;
  html_url: string;
  login: string;
}

export async function getGithubFact(username: string): Promise<Fact | undefined> {
  const user = await fetchUserData(username);
  if (!user) {
    return;
  }
  const created = new Date(user.created_at);
  return {
    title: "GitHub",
    details: [
      `📅 ${created.toISOString().slice(0, 10)} (${formatDistanceToNowStrict(created)})`,
    ],
    url: new URL(user.html_url),
  };
}

async function fetchUserData(username: string): Promise<GithubUser | undefined> {
  const res = await fetch(`https://api.github.com/users/${username}`);
  const data = await res.json();
  if (isSuccess(data)) {
    return data;
  }
}

function isSuccess(data: unknown): data is GithubUser {
  return data !== null && typeof data === "object" && "login" in data;
}
