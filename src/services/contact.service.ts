import { submitContactMessage, WEB3FORMS_ENDPOINT } from "../data/repositories/contact.repository";
import type { ContactPayload } from "../types/contact";
import type { Locale } from "../i18n/locales";
import { t, tf } from "../i18n/t";

export { WEB3FORMS_ENDPOINT };

export type ContactFieldName = "name" | "email" | "subject" | "message" | "consent";

export type ContactFieldErrors = Partial<Record<ContactFieldName, string>>;

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

export function resetContactSubmitCooldown(): void {
  lastSubmitAttemptAt = 0;
}

function trimPayload(payload: ContactPayload): ContactPayload {
  return {
    name: payload.name.trim(),
    email: payload.email.trim(),
    subject: payload.subject.trim(),
    message: payload.message.trim(),
    consent: payload.consent,
  };
}

export function validateContactPayload(
  payload: ContactPayload,
  locale: Locale = "fr",
): ContactFieldErrors {
  const fields: ContactFieldErrors = {};
  const data = trimPayload(payload);

  if (data.name.length < 2) {
    fields.name = t(locale, "contact.validation.name.min");
  } else if (data.name.length > CONTACT_FIELD_LIMITS.name) {
    fields.name = tf(locale, "contact.validation.name.max", {
      max: CONTACT_FIELD_LIMITS.name,
    });
  }

  if (!EMAIL_PATTERN.test(data.email)) {
    fields.email = t(locale, "contact.validation.email.invalid");
  } else if (data.email.length > CONTACT_FIELD_LIMITS.email) {
    fields.email = tf(locale, "contact.validation.email.max", {
      max: CONTACT_FIELD_LIMITS.email,
    });
  }

  if (data.subject.length < 3) {
    fields.subject = t(locale, "contact.validation.subject.min");
  } else if (data.subject.length > CONTACT_FIELD_LIMITS.subject) {
    fields.subject = tf(locale, "contact.validation.subject.max", {
      max: CONTACT_FIELD_LIMITS.subject,
    });
  }

  if (data.message.length < 10) {
    fields.message = t(locale, "contact.validation.message.min");
  } else if (data.message.length > CONTACT_FIELD_LIMITS.message) {
    fields.message = tf(locale, "contact.validation.message.max", {
      max: CONTACT_FIELD_LIMITS.message,
    });
  }

  if (!data.consent) {
    fields.consent = t(locale, "contact.validation.consent");
  }

  return fields;
}

export type SubmitContactInput = ContactPayload & {
  botcheck?: boolean;
};

export async function submitContact(
  payload: SubmitContactInput,
  locale: Locale = "fr",
): Promise<ContactServiceResult> {
  if (payload.botcheck) {
    return { ok: true, message: t(locale, "contact.response.ok") };
  }

  const data = trimPayload(payload);
  const fields = validateContactPayload(data, locale);

  if (Object.keys(fields).length > 0) {
    return {
      ok: false,
      message: t(locale, "contact.response.fix"),
      fields,
    };
  }

  const now = Date.now();
  if (now - lastSubmitAttemptAt < CONTACT_SUBMIT_COOLDOWN_MS) {
    return {
      ok: false,
      message: t(locale, "contact.response.cooldown"),
    };
  }
  lastSubmitAttemptAt = now;

  const result = await submitContactMessage(data);

  if (result.ok) {
    return { ok: true, message: t(locale, "contact.response.ok") };
  }

  if (result.code === "MISSING_KEY") {
    return {
      ok: false,
      message: t(locale, "contact.response.unavailable"),
    };
  }

  if (result.code === "NETWORK") {
    return {
      ok: false,
      message: t(locale, "contact.response.network"),
    };
  }

  return {
    ok: false,
    message: t(locale, "contact.response.failed"),
  };
}
