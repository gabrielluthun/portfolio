import { useState, type FormEvent } from "react";
import {
  submitContact,
  type ContactFieldErrors,
} from "../../services/contact.service";
import type { Locale } from "../../i18n/locales";

const emptyFields = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export type ContactFormStatus = "idle" | "pending" | "success" | "error";

export function useContactForm(locale: Locale = "fr") {
  const [values, setValues] = useState(emptyFields);
  const [consent, setConsent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<ContactFormStatus>("idle");
  const [message, setMessage] = useState("");
  const accessKey = import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY ?? "";

  function setField(name: keyof typeof emptyFields, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const honeypot = form.elements.namedItem("botcheck");
    const botcheck =
      honeypot instanceof HTMLInputElement && honeypot.checked;

    setStatus("pending");
    setMessage("");

    const result = await submitContact({
      ...values,
      consent,
      botcheck,
    }, locale);

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

  return {
    values,
    setField,
    consent,
    setConsent,
    fieldErrors,
    status,
    message,
    accessKey,
    onSubmit,
  };
}
