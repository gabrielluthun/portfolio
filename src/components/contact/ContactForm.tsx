import { useState, type FormEvent } from "react";
import {
  submitContact,
  type ContactFieldErrors,
} from "../../services/contact.service";

const emptyFields = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactForm() {
  const [values, setValues] = useState(emptyFields);
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

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

    const result = await submitContact(values);

    if (result.ok) {
      setStatus("success");
      setMessage(result.message);
      setFieldErrors({});
      setValues(emptyFields);
      return;
    }

    setStatus("error");
    setMessage(result.message);
    setFieldErrors(result.fields ?? {});
  }

  const inputClass =
    "w-full rounded-md border border-border bg-bg px-3 py-2 text-fg outline-none focus:border-accent";

  return (
    <form className="relative flex max-w-xl flex-col gap-4" onSubmit={onSubmit} noValidate>
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
          className={inputClass}
          value={values.name}
          onChange={(event) =>
            setValues((current) => ({ ...current, name: event.target.value }))
          }
        />
        {fieldErrors.name ? (
          <p className="m-0 text-sm text-accent">{fieldErrors.name}</p>
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
          className={inputClass}
          value={values.email}
          onChange={(event) =>
            setValues((current) => ({ ...current, email: event.target.value }))
          }
        />
        {fieldErrors.email ? (
          <p className="m-0 text-sm text-accent">{fieldErrors.email}</p>
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
          className={inputClass}
          value={values.subject}
          onChange={(event) =>
            setValues((current) => ({ ...current, subject: event.target.value }))
          }
        />
        {fieldErrors.subject ? (
          <p className="m-0 text-sm text-accent">{fieldErrors.subject}</p>
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
          className={inputClass}
          value={values.message}
          onChange={(event) =>
            setValues((current) => ({ ...current, message: event.target.value }))
          }
        />
        {fieldErrors.message ? (
          <p className="m-0 text-sm text-accent">{fieldErrors.message}</p>
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
