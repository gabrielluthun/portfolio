import type { ContactPayload } from "../../src/types/contact";

export const validContactPayload: ContactPayload = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  subject: "Projet web",
  message: "Bonjour, je souhaite discuter d'un projet.",
  consent: true,
};
