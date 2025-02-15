interface Project {
  title: string;
  description: string;
  technologies: string[];
  features: string[];
  details?: string;
}

export const mainProjects: Project[] = [
  {
    title: "Bot Discord",
    description: "J'ai créé un bot Discord pour un organisme de formation. Il permet de gérer l'interaction entre les utilisateurs et le serveur, en gamifiant les utilisateurs avec des récompenses et des niveaux.",
    technologies: ["Node.js", "discord.js", "TypeScript", "PostgreSQL"],
    features: [
      "Gestion des récompenses et des niveaux",
      "Gestion des commandes",
      "Gestion des événements",
      "Gestion des rôles",
      "Gestion des salons",
      "Gestion des messages"
    ]
  }
];

export const getProjectResponse = (query: string): string => {
  if (query.toLowerCase().includes('projets') || query.toLowerCase().includes('projects')) {
    return mainProjects
      .map(project => 
        `${project.title}:
- ${project.description}
- Technologies: ${project.technologies.join(', ')}
- Fonctionnalités principales: ${project.features.join(', ')}`
      )
      .join('\n\n');
  }

  // Recherche d'un projet spécifique
  const searchProject = mainProjects.find(project => 
    query.toLowerCase().includes(project.title.toLowerCase())
  );

  if (searchProject) {
    return `${searchProject.title}:
- ${searchProject.description}
- Technologies utilisées: ${searchProject.technologies.join(', ')}
- Fonctionnalités principales: ${searchProject.features.join(', ')}`;
  }

  return "Je vous invite à me poser une question plus précise sur mes projets, ou à consulter mon GitHub pour plus de détails !";
}; 