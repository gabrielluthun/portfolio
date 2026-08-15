import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { validContactPayload } from "../helpers/contact-payload";
import {
  resetContactSubmitCooldown,
  submitContact,
} from "../../src/services/contact.service";

describe("submitContact with repository", () => {
  beforeEach(() => {
    resetContactSubmitCooldown();
    vi.stubEnv("PUBLIC_WEB3FORMS_ACCESS_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("posts a valid payload to Web3Forms and returns the success message", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue(
      Response.json({ success: true }, { status: 200 }),
    );

    const result = await submitContact(validContactPayload);

    expect(result).toEqual({
      ok: true,
      message: "Votre message a bien été envoyé.",
    });
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe("https://api.web3forms.com/submit");
    expect(init?.method).toBe("POST");
  });
});
