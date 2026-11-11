export type Entitlements = {
  pro: boolean;
  walletActive: boolean;
  profileVisible: boolean;
  companyActive: boolean;
};
export const backendBase =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ||
  "https://skifabackend-z45w.onrender.com/api/v1";

export type BackendRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function backendRequest<T>(
  path: string,
  options?: BackendRequestOptions | unknown,
): Promise<T> {
  const requestOptions =
    options === undefined
      ? {}
      : options &&
          typeof options === "object" &&
          ("method" in options || "body" in options || "headers" in options)
        ? (options as BackendRequestOptions)
        : { method: "POST", body: options };
  const isForm = requestOptions.body instanceof FormData;
  const response = await fetch(backendBase + path, {
    ...requestOptions,
    method: requestOptions.method || "GET",
    credentials: "include",
    headers: isForm
      ? requestOptions.headers
      : { "Content-Type": "application/json", ...requestOptions.headers },
    body:
      requestOptions.body === undefined
        ? undefined
        : isForm
          ? (requestOptions.body as FormData)
          : JSON.stringify(requestOptions.body),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      message?: string;
      error?: { message?: string };
    } | null;
    if ([404, 501, 503].includes(response.status))
      throw new Error(
        "This service is not connected yet. No payment or email has been sent.",
      );
    throw new Error(
      payload?.error?.message ||
        payload?.message ||
        (response.status === 401
          ? "Please sign in to continue."
          : "Unable to complete this request. Please try again."),
    );
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
export async function startCheckout(
  purpose: "profile_visibility" | "company_activation" | "pro",
) {
  const result = await backendRequest<{ url: string }>("/checkout", {
    method: "POST",
    body: {
      purpose,
      returnUrl:
        window.location.origin +
        (purpose === "profile_visibility"
          ? "/intern/payment-return"
          : purpose === "company_activation"
            ? "/company/profile-preview"
            : "/intern/upgrade"),
    },
  });
  const url = new URL(result.url, window.location.origin);
  if (url.protocol !== "https:" && url.origin !== window.location.origin)
    throw new Error("Invalid checkout destination.");
  window.location.assign(url.href);
}
export function requestConfirmation(email: string) {
  return backendRequest<{ sent: boolean }>("/confirmation-email", {
    method: "POST",
    body: { email },
  });
}
export function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "The service is currently unavailable.";
}

export async function uploadVideo(blob: Blob): Promise<void> {
  const form = new FormData();
  form.append("video", blob, "video-cv.webm");
  const response = await fetch(backendBase + "/video-cv", {
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
