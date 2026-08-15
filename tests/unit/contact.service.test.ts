import { beforeEach, describe, expect, it, vi } from "vitest";
import { validContactPayload } from "../helpers/contact-payload";
import {
  CONTACT_FIELD_LIMITS,
  resetContactSubmitCooldown,
  submitContact,
  validateContactPayload,
} from "../../src/services/contact.service";
import { submitContactMessage } from "../../src/data/repositories/contact.repository";

vi.mock("../../src/data/repositories/contact.repository", () => ({
  WEB3FORMS_ENDPOINT: "https://api.web3forms.com/submit",
  submitContactMessage: vi.fn(),
}));

const submitContactMessageMock = vi.mocked(submitContactMessage);

describe("validateContactPayload", () => {
  it("rejects a name shorter than 2 characters", () => {
    const fields = validateContactPayload({
      ...validContactPayload,
      name: "A",
    });

    expect(fields.name).toBeDefined();
  });

  it("rejects a name longer than the limit", () => {
    const fields = validateContactPayload({
      ...validContactPayload,
      name: "A".repeat(CONTACT_FIELD_LIMITS.name + 1),
    });

    expect(fields.name).toBeDefined();
  });

  it("rejects an invalid email", () => {
    const fields = validateContactPayload({
      ...validContactPayload,
      email: "pas-un-email",
    });

    expect(fields.email).toBeDefined();
  });

  it("rejects a subject shorter than 3 characters", () => {
    const fields = validateContactPayload({
      ...validContactPayload,
      subject: "Hi",
    });

    expect(fields.subject).toBeDefined();
  });

  it("rejects a message shorter than 10 characters", () => {
    const fields = validateContactPayload({
      ...validContactPayload,
      message: "Trop peu",
    });

    expect(fields.message).toBeDefined();
  });

  it("rejects missing consent", () => {
    const fields = validateContactPayload({
      ...validContactPayload,
      consent: false,
    });

    expect(fields.consent).toBeDefined();
  });

  it("accepts a trimmed valid payload", () => {
    const fields = validateContactPayload({
      ...validContactPayload,
      name: "  Ada Lovelace  ",
      email: "  ada@example.com  ",
    });

    expect(fields).toEqual({});
  });
});

describe("submitContact", () => {
  beforeEach(() => {
    resetContactSubmitCooldown();
    submitContactMessageMock.mockReset();
    submitContactMessageMock.mockResolvedValue({ ok: true });
  });

  it("returns success without calling the repository when botcheck is true", async () => {
    const result = await submitContact({
      ...validContactPayload,
      botcheck: true,
    });

    expect(result.ok).toBe(true);
    expect(submitContactMessageMock).not.toHaveBeenCalled();
  });

  it("returns field errors without calling the repository", async () => {
    const result = await submitContact({
      ...validContactPayload,
      email: "invalide",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fields?.email).toBeDefined();
    }
    expect(submitContactMessageMock).not.toHaveBeenCalled();
  });

  it("rejects a second submit within the cooldown window", async () => {
    const first = await submitContact(validContactPayload);
    const second = await submitContact(validContactPayload);

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(false);
    if (!second.ok) {
      expect(second.message).toMatch(/patienter/i);
    }
    expect(submitContactMessageMock).toHaveBeenCalledTimes(1);
  });

  it("maps a missing key to a generic unavailability message", async () => {
    submitContactMessageMock.mockResolvedValue({ ok: false, code: "MISSING_KEY" });

    const result = await submitContact(validContactPayload);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe("L'envoi est temporairement indisponible.");
    }
  });
});
