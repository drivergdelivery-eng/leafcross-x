import { getSiteContent } from "@/lib/data/getSiteContent";

export async function GET() {
  const content = await getSiteContent();
  return Response.json(content);
}
