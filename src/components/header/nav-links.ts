export type NavLink = {
  href: string;
  key: string;
  label: string;
};

export function getPrimaryNavLinks(home: string): NavLink[] {
  return [
    { href: home, key: "home", label: "Accueil" },
    { href: `${home}#profil`, key: "profil", label: "Profil" },
    { href: `${home}#projets`, key: "projets", label: "Projets" },
    { href: `${home}#parcours`, key: "parcours", label: "Parcours" },
  ];
}

export function getMobileNavLinks(home: string): NavLink[] {
  return [
    ...getPrimaryNavLinks(home),
    { href: `${home}#contact`, key: "contact", label: "Discutons ensemble" },
  ];
}
