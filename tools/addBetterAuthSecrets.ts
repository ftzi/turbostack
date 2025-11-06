import { $ } from "bun";

// Based on Better Auth's: https://github.com/better-auth/better-auth/blob/main/docs/components/generate-secret.tsx
function generateRandomString(length = 32): string {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);

    result += characters[randomIndex];
  }

  return result;
}

await $`printf ${generateRandomString()} | bunx vercel env add BETTER_AUTH_SECRET development`;
await $`printf ${generateRandomString()} | bunx vercel env add BETTER_AUTH_SECRET preview`;
await $`printf ${generateRandomString()} | bunx vercel env add BETTER_AUTH_SECRET production`;
