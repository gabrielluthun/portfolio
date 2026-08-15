export function resolvePreviewImage(path: string, baseUrl: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const prefix = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return `${prefix}${path.replace(/^\//, "")}`;
}
