import type { ContactPayload, ContactRepositoryResult } from "../../types/contact";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export async function submitContactMessage(
  payload: ContactPayload,
): Promise<ContactRepositoryResult> {
  const accessKey = import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    return { ok: false, code: "MISSING_KEY" };
  }

  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        name: payload.name,
        email: payload.email,
        subject: payload.subject,
        message: payload.message,
        botcheck: "",
      }),
    });

    if (!response.ok) {
      return { ok: false, code: "REMOTE" };
    }

    const body: unknown = await response.json();
    if (
      typeof body === "object" &&
      body !== null &&
      "success" in body &&
      body.success === true
    ) {
      return { ok: true };
    }

    return { ok: false, code: "REMOTE" };
  } catch {
    return { ok: false, code: "NETWORK" };
  }
}
