import type { Project } from "../../types/project";

type ProjectCardProps = {
  project: Project;
  href: string;
};

export default function ProjectCard({ project, href }: ProjectCardProps) {
  return (
    <a
      href={href}
      className="project-card block overflow-hidden rounded-xl border border-border bg-bg no-underline transition duration-300 ease-out hover:-translate-y-0.5 hover:border-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <img
        src={project.previewImage}
        alt=""
        className="aspect-[16/10] w-full object-cover"
        loading="lazy"
      />
      <div className="flex flex-col gap-3 p-5">
        <h3 className="m-0 text-lg text-fg">{project.title}</h3>
        <p className="m-0 text-sm text-fg-muted">{project.shortDescription}</p>
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md bg-bg-muted px-2 py-1 text-xs font-medium text-fg"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </a>
  );
}
