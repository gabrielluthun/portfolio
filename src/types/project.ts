export type Project = {
  id: string;
  title: string;
  shortDescription: string;
  problem: string;
  solution: string;
  impact: string;
  tags: string[];
  previewImage?: string;
  previewFit?: "cover" | "contain" | "logo";
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
};
