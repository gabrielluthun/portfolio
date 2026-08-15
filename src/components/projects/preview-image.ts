import { sitePath } from "../../lib/site-path";

export function resolvePreviewImage(path: string, baseUrl: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return sitePath(path, baseUrl);
}
