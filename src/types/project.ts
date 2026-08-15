export type Project = {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  tags: string[];
  previewImage: string;
  previewFit?: "cover" | "contain";
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
};
