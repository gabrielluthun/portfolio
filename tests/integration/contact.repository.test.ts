import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { submitContactMessage } from "../../src/data/repositories/contact.repository";
import { validContactPayload } from "../helpers/contact-payload";

describe("submitContactMessage", () => {
  beforeEach(() => {
    vi.stubEnv("PUBLIC_WEB3FORMS_ACCESS_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("returns MISSING_KEY without fetching when the key is empty", async () => {
    vi.stubEnv("PUBLIC_WEB3FORMS_ACCESS_KEY", "");
    const fetchMock = vi.mocked(fetch);

    const result = await submitContactMessage(validContactPayload);

    expect(result).toEqual({ ok: false, code: "MISSING_KEY" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns ok when Web3Forms reports success", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue(
      Response.json({ success: true }, { status: 200 }),
    );

    const result = await submitContactMessage(validContactPayload);

    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0] ?? [];
    const body = JSON.parse(String(init?.body));
    expect(body.access_key).toBe("test-key");
    expect(body.name).toBe(validContactPayload.name);
    expect(body.email).toBe(validContactPayload.email);
    expect(body.botcheck).toBe("");
  });

  it("returns REMOTE when success is false", async () => {
    vi.mocked(fetch).mockResolvedValue(
      Response.json({ success: false }, { status: 200 }),
    );

    const result = await submitContactMessage(validContactPayload);

    expect(result).toEqual({ ok: false, code: "REMOTE" });
  });

  it("returns REMOTE when the HTTP status is not ok", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response("error", { status: 500 }));

    const result = await submitContactMessage(validContactPayload);

    expect(result).toEqual({ ok: false, code: "REMOTE" });
  });

  it("returns NETWORK when fetch throws", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("offline"));

    const result = await submitContactMessage(validContactPayload);

    expect(result).toEqual({ ok: false, code: "NETWORK" });
  });
});
