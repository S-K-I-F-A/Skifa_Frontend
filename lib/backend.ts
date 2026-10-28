export type Entitlements = {
  pro: boolean;
  walletActive: boolean;
  profileVisible: boolean;
  companyActive: boolean;
};
const base = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") || "/api";
export async function backendRequest<T>(
  path: string,
  body?: unknown,
): Promise<T> {
  const response = await fetch(base + path, {
    method: body === undefined ? "GET" : "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    if ([404, 501, 503].includes(response.status))
      throw new Error(
        "This service is not connected yet. No payment or email has been sent.",
      );
    throw new Error(
      response.status === 401
        ? "Please sign in to continue."
        : "Unable to complete this request. Please try again.",
    );
  }
  return response.json() as Promise<T>;
}
export async function startCheckout(
  purpose: "profile_visibility" | "company_activation" | "pro",
) {
  const result = await backendRequest<{ url: string }>("/checkout", {
    purpose,
    returnUrl:
      window.location.origin +
      (purpose === "profile_visibility"
        ? "/intern/payment-return"
        : purpose === "company_activation"
          ? "/company/profile-preview"
          : "/intern/upgrade"),
  });
  const url = new URL(result.url, window.location.origin);
  if (url.protocol !== "https:" && url.origin !== window.location.origin)
    throw new Error("Invalid checkout destination.");
  window.location.assign(url.href);
}
export function requestConfirmation(email: string) {
  return backendRequest<{ sent: boolean }>("/confirmation-email", { email });
}
export function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "The service is currently unavailable.";
}

export async function uploadVideo(blob: Blob): Promise<void> {
  const form = new FormData();
  form.append("video", blob, "video-cv.webm");
  const response = await fetch(base + "/video-cv", {
    method: "POST",
    credentials: "include",
    body: form,
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok)
    throw new Error(
      "Video storage is not connected yet. Your video has not been uploaded.",
    );
  const result = (await response.json()) as { saved: boolean };
  if (!result.saved)
    throw new Error("Video storage did not confirm the upload.");
}
