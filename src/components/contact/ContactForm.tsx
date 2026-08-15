import {
  CONTACT_FIELD_LIMITS,
  WEB3FORMS_ENDPOINT,
} from "../../services/contact.service";
import ContactField, { contactFieldErrorId } from "./ContactField";
import { useContactForm } from "./useContactForm";

export default function ContactForm() {
  const {
    values,
    setField,
    consent,
    setConsent,
    fieldErrors,
    status,
    message,
    accessKey,
    onSubmit,
  } = useContactForm();

  return (
    <form
      className="relative flex max-w-xl flex-col gap-4"
      action={WEB3FORMS_ENDPOINT}
      method="POST"
      onSubmit={onSubmit}
    >
      <input type="hidden" name="access_key" value={accessKey} />
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      />

      <ContactField
        id="contact-name"
        name="name"
        label="Nom"
        autoComplete="name"
        maxLength={CONTACT_FIELD_LIMITS.name}
        value={values.name}
        error={fieldErrors.name}
        onChange={(value) => setField("name", value)}
      />
      <ContactField
        id="contact-email"
        name="email"
        label="E-mail"
        type="email"
        autoComplete="email"
        maxLength={CONTACT_FIELD_LIMITS.email}
        value={values.email}
        error={fieldErrors.email}
        onChange={(value) => setField("email", value)}
      />
      <ContactField
        id="contact-subject"
        name="subject"
        label="Sujet"
        maxLength={CONTACT_FIELD_LIMITS.subject}
        value={values.subject}
        error={fieldErrors.subject}
        onChange={(value) => setField("subject", value)}
      />
      <ContactField
        id="contact-message"
        name="message"
        label="Message"
        type="textarea"
        maxLength={CONTACT_FIELD_LIMITS.message}
        value={values.message}
        error={fieldErrors.message}
        onChange={(value) => setField("message", value)}
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-consent" className="flex items-start gap-3 text-sm text-fg">
          <input
            id="contact-consent"
            name="consent"
            type="checkbox"
            required
            className="mt-1"
            checked={consent}
            aria-invalid={Boolean(fieldErrors.consent)}
            aria-describedby={
              fieldErrors.consent ? contactFieldErrorId("consent") : undefined
            }
            onChange={(event) => setConsent(event.target.checked)}
          />
          <span>
            J'accepte que mes données (nom, e-mail, sujet, message) soient
            utilisées uniquement pour répondre à cette demande, et transmises
            au titulaire du site via un prestataire d'envoi d'e-mails. Elles
            ne sont pas utilisées à des fins marketing.
          </span>
        </label>
        {fieldErrors.consent ? (
          <p id={contactFieldErrorId("consent")} className="m-0 text-sm text-accent">
            {fieldErrors.consent}
          </p>
        ) : null}
      </div>

      {message ? (
        <p
          className={`m-0 text-sm ${status === "success" ? "text-accent" : "text-fg"}`}
          role="status"
        >
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "pending"}
        className="rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-fg hover:bg-accent-hover disabled:opacity-60"
      >
        {status === "pending" ? "Envoi en cours…" : "Envoyer"}
      </button>
    </form>
  );
}
