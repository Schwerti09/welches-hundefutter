export default async (request: Request) => {
  const ua = request.headers.get("user-agent") || "";
  if (/Bytespider/i.test(ua)) {
    return new Response("Not available", { status: 403 });
  }
  // alle freundlichen Bots + Menschen passieren
  return;
};

export const config = { path: "/*" };
