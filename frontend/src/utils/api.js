const API_VERSION = "v1";

export const apiUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${import.meta.env.VITE_API_URL}/api/${API_VERSION}${normalizedPath}`;
};

export const unwrapApiResponse = (payload) => {
  if (
    payload &&
    typeof payload === "object" &&
    Object.prototype.hasOwnProperty.call(payload, "data") &&
    Object.prototype.hasOwnProperty.call(payload, "status")
  ) {
    return payload.data;
  }

  return payload;
};

export const getApiMessage = (payload, fallback) =>
  payload?.message || payload?.status?.message || fallback;
