export type ExperienceSection = {
  heading: string;
  items: string[];
};

export type Experience = {
  id: string;
  period: string;
  title: string;
  organization: string;
  description?: string;
  sections?: ExperienceSection[];
  tags: string[];
};
