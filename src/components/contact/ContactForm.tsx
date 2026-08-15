import { useState, type FormEvent } from "react";
import {
  CONTACT_FIELD_LIMITS,
  submitContact,
  type ContactFieldErrors,
} from "../../services/contact.service";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

const emptyFields = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function fieldErrorId(field: string) {
  return `contact-${field}-error`;
}

export default function ContactForm() {
  const [values, setValues] = useState(emptyFields);
  const [consent, setConsent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const accessKey = import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY ?? "";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const honeypot = form.elements.namedItem("botcheck");

    if (honeypot instanceof HTMLInputElement && honeypot.checked) {
      setStatus("success");
      setMessage("Votre message a bien été envoyé.");
      setFieldErrors({});
      return;
    }

    setStatus("pending");
    setMessage("");

    const result = await submitContact({
      ...values,
      consent,
    });

    if (result.ok) {
      setStatus("success");
      setMessage(result.message);
      setFieldErrors({});
      setValues(emptyFields);
      setConsent(false);
      return;
    }

    setStatus("error");
    setMessage(result.message);
    setFieldErrors(result.fields ?? {});
  }

  const inputClass =
    "w-full rounded-md border border-border bg-bg px-3 py-2 text-fg outline-none focus:border-accent";

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

      <div className="flex flex-col gap-1">
        <label htmlFor="contact-name" className="text-sm font-medium text-fg">
          Nom
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={CONTACT_FIELD_LIMITS.name}
          className={inputClass}
          value={values.name}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? fieldErrorId("name") : undefined}
          onChange={(event) =>
            setValues((current) => ({ ...current, name: event.target.value }))
          }
        />
        {fieldErrors.name ? (
          <p id={fieldErrorId("name")} className="m-0 text-sm text-accent">
            {fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="contact-email" className="text-sm font-medium text-fg">
          E-mail
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={CONTACT_FIELD_LIMITS.email}
          className={inputClass}
          value={values.email}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? fieldErrorId("email") : undefined}
          onChange={(event) =>
            setValues((current) => ({ ...current, email: event.target.value }))
          }
        />
        {fieldErrors.email ? (
          <p id={fieldErrorId("email")} className="m-0 text-sm text-accent">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="contact-subject" className="text-sm font-medium text-fg">
          Sujet
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          required
          maxLength={CONTACT_FIELD_LIMITS.subject}
          className={inputClass}
          value={values.subject}
          aria-invalid={Boolean(fieldErrors.subject)}
          aria-describedby={
            fieldErrors.subject ? fieldErrorId("subject") : undefined
          }
          onChange={(event) =>
            setValues((current) => ({ ...current, subject: event.target.value }))
          }
        />
        {fieldErrors.subject ? (
          <p id={fieldErrorId("subject")} className="m-0 text-sm text-accent">
            {fieldErrors.subject}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="contact-message" className="text-sm font-medium text-fg">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          maxLength={CONTACT_FIELD_LIMITS.message}
          className={inputClass}
          value={values.message}
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={
            fieldErrors.message ? fieldErrorId("message") : undefined
          }
          onChange={(event) =>
            setValues((current) => ({ ...current, message: event.target.value }))
          }
        />
        {fieldErrors.message ? (
          <p id={fieldErrorId("message")} className="m-0 text-sm text-accent">
            {fieldErrors.message}
          </p>
        ) : null}
      </div>

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
              fieldErrors.consent ? fieldErrorId("consent") : undefined
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
          <p id={fieldErrorId("consent")} className="m-0 text-sm text-accent">
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
