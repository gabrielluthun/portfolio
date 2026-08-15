import { submitContactMessage } from "../data/repositories/contact.repository";
import type { ContactPayload } from "../types/contact";

export type ContactFieldErrors = Partial<Record<keyof ContactPayload, string>>;

export type ContactServiceResult =
  | { ok: true; message: string }
  | { ok: false; message: string; fields?: ContactFieldErrors };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function trimPayload(payload: ContactPayload): ContactPayload {
  return {
    name: payload.name.trim(),
    email: payload.email.trim(),
    subject: payload.subject.trim(),
    message: payload.message.trim(),
  };
}

export function validateContactPayload(payload: ContactPayload): ContactFieldErrors {
  const fields: ContactFieldErrors = {};
  const data = trimPayload(payload);

  if (data.name.length < 2) {
    fields.name = "Le nom doit contenir au moins 2 caractères.";
  }

  if (!EMAIL_PATTERN.test(data.email)) {
    fields.email = "Saisissez une adresse e-mail valide.";
  }

  if (data.subject.length < 3) {
    fields.subject = "Le sujet doit contenir au moins 3 caractères.";
  }

  if (data.message.length < 10) {
    fields.message = "Le message doit contenir au moins 10 caractères.";
  }

  return fields;
}

export async function submitContact(
  payload: ContactPayload,
): Promise<ContactServiceResult> {
  const data = trimPayload(payload);
  const fields = validateContactPayload(data);

  if (Object.keys(fields).length > 0) {
    return {
      ok: false,
      message: "Veuillez corriger les champs indiqués.",
      fields,
    };
  }

  const result = await submitContactMessage(data);

  if (result.ok) {
    return { ok: true, message: "Votre message a bien été envoyé." };
  }

  if (result.code === "MISSING_KEY") {
    return {
      ok: false,
      message: "L'envoi est indisponible : clé Web3Forms absente.",
    };
  }

  if (result.code === "NETWORK") {
    return {
      ok: false,
      message: "Impossible de joindre le service. Réessayez plus tard.",
    };
  }

  return {
    ok: false,
    message: "Le message n'a pas pu être envoyé.",
  };
}
