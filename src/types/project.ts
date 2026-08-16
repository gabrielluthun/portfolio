export type Project = {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  benefits: string;
  tags: string[];
  previewImage?: string;
  previewFit?: "cover" | "contain" | "logo";
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
};
