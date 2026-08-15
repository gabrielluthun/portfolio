export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactRepositoryErrorCode = "MISSING_KEY" | "NETWORK" | "REMOTE";

export type ContactRepositoryResult =
  | { ok: true }
  | { ok: false; code: ContactRepositoryErrorCode };
