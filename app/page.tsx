import { V3Page } from "@/components/v3/V3Page";
import { DEFAULT_CONTENT, fetchContent } from "@/lib/content";

export default async function Home() {
  let content = DEFAULT_CONTENT;
  try {
    // Dynamic import to avoid breaking local dev
    const { getRequestContext } = await import("@cloudflare/next-on-pages");
    const { env } = getRequestContext();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((env as any).DB) content = await fetchContent((env as any).DB);
  } catch {
    // local dev — use defaults
  }
  return <V3Page content={content} />;
}
