import type { Project } from "../../types/project";
import type { Locale } from "../../i18n/locales";
import ProjectCard from "./ProjectCard";
import { resolvePreviewImage } from "./preview-image";

type ProjectGridProps = {
  projects: Project[];
  baseUrl: string;
  locale?: Locale;
  projectsBasePath?: string;
};

export default function ProjectGrid({
  projects,
  baseUrl,
  locale = "fr",
  projectsBasePath = "projets",
}: ProjectGridProps) {
  const prefix = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

  return (
    <ul className="project-grid group/grid m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2">
      {projects.map((project) => (
        <li
          key={project.id}
          className="min-w-0 transition duration-300 ease-out group-hover/grid:opacity-40 group-hover/grid:blur-[2px] hover:!opacity-100 hover:!blur-none motion-reduce:group-hover/grid:blur-none"
        >
          <ProjectCard
            project={project}
            href={`${prefix}${projectsBasePath}/${project.id}`}
            previewSrc={
              project.previewImage
                ? resolvePreviewImage(project.previewImage, prefix)
                : undefined
            }
            locale={locale}
          />
        </li>
      ))}
    </ul>
  );
}
