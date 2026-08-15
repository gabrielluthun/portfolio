export function sitePath(path: string, baseUrl: string): string {
  const prefix = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const suffix = path.replace(/^\//, "");
  return suffix ? `${prefix}${suffix}` : prefix;
}
