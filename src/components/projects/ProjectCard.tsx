import type { Project } from "../../types/project";

type ProjectCardProps = {
  project: Project;
  href: string;
  previewSrc?: string;
};

export default function ProjectCard({ project, href, previewSrc }: ProjectCardProps) {
  return (
    <a
      href={href}
      className="project-card group block overflow-hidden rounded-xl border border-border bg-bg no-underline transition duration-300 ease-out hover:-translate-y-0.5 hover:border-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {previewSrc ? (
        <img
          src={previewSrc}
          alt=""
          className={
            project.previewFit === "logo"
              ? "aspect-[16/10] w-full bg-bg-muted object-contain p-10"
              : project.previewFit === "contain"
                ? "aspect-[16/10] w-full bg-black object-contain"
                : "aspect-[16/10] w-full object-cover object-top"
          }
          loading="lazy"
        />
      ) : (
        <div
          className="flex aspect-[16/10] w-full items-center justify-center bg-bg-muted px-4"
          aria-hidden="true"
        >
          <span className="font-heading text-sm font-semibold tracking-tight text-fg-muted">
            {project.title}
          </span>
        </div>
      )}
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
        <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:opacity-100">
          Lire l'étude de cas
          <svg aria-hidden="true" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.69L10.72 5.53a.75.75 0 1 1 1.06-1.06l5 5a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 1 1-1.06-1.06l3.72-3.72H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
          </svg>
        </span>
      </div>
    </a>
  );
}
