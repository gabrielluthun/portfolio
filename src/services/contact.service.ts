import { submitContactMessage } from "../data/repositories/contact.repository";
import type { ContactPayload } from "../types/contact";

export type ContactFieldErrors = Partial<Record<keyof ContactPayload, string>>;

export type ContactServiceResult =
  | { ok: true; message: string }
  | { ok: false; message: string; fields?: ContactFieldErrors };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CONTACT_FIELD_LIMITS = {
  name: 100,
  email: 254,
  subject: 120,
  message: 2000,
} as const;

export const CONTACT_SUBMIT_COOLDOWN_MS = 30_000;

let lastSubmitAttemptAt = 0;

function trimPayload(payload: ContactPayload): ContactPayload {
  return {
    name: payload.name.trim(),
    email: payload.email.trim(),
    subject: payload.subject.trim(),
    message: payload.message.trim(),
    consent: payload.consent,
  };
}

export function validateContactPayload(payload: ContactPayload): ContactFieldErrors {
  const fields: ContactFieldErrors = {};
  const data = trimPayload(payload);

  if (data.name.length < 2) {
    fields.name = "Le nom doit contenir au moins 2 caractères.";
  } else if (data.name.length > CONTACT_FIELD_LIMITS.name) {
    fields.name = `Le nom ne peut pas dépasser ${CONTACT_FIELD_LIMITS.name} caractères.`;
  }

  if (!EMAIL_PATTERN.test(data.email)) {
    fields.email = "Saisissez une adresse e-mail valide.";
  } else if (data.email.length > CONTACT_FIELD_LIMITS.email) {
    fields.email = `L'e-mail ne peut pas dépasser ${CONTACT_FIELD_LIMITS.email} caractères.`;
  }

  if (data.subject.length < 3) {
    fields.subject = "Le sujet doit contenir au moins 3 caractères.";
  } else if (data.subject.length > CONTACT_FIELD_LIMITS.subject) {
    fields.subject = `Le sujet ne peut pas dépasser ${CONTACT_FIELD_LIMITS.subject} caractères.`;
  }

  if (data.message.length < 10) {
    fields.message = "Le message doit contenir au moins 10 caractères.";
  } else if (data.message.length > CONTACT_FIELD_LIMITS.message) {
    fields.message = `Le message ne peut pas dépasser ${CONTACT_FIELD_LIMITS.message} caractères.`;
  }

  if (!data.consent) {
    fields.consent = "Veuillez accepter le traitement de vos données pour envoyer le message.";
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

  const now = Date.now();
  if (now - lastSubmitAttemptAt < CONTACT_SUBMIT_COOLDOWN_MS) {
    return {
      ok: false,
      message: "Veuillez patienter quelques secondes avant un nouvel envoi.",
    };
  }
  lastSubmitAttemptAt = now;

  const result = await submitContactMessage(data);

  if (result.ok) {
    return { ok: true, message: "Votre message a bien été envoyé." };
  }

  if (result.code === "MISSING_KEY") {
    return {
      ok: false,
      message: "L'envoi est temporairement indisponible.",
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
