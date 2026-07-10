export const setCookie = (name, value, days) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + encodeURIComponent(value || "") + expires + "; path=/; SameSite=Lax";
};

export const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
};

export const removeCookie = (name) => {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax";
};

export const setUserInfoCookie = (user) => {
  if (!user) return;
  const { token: _, ...safeUser } = user;
  setCookie("userInfo", JSON.stringify(safeUser), 7);
};

export const getUserInfoCookie = () => {
  const data = getCookie("userInfo");
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const removeUserInfoCookie = () => {
  removeCookie("userInfo");
};

export const setAuthTokenCookie = (token) => {
  if (!token) return;
  setCookie("authToken", token, 7);
};

export const getAuthTokenCookie = () => {
  return getCookie("authToken");
};

export const removeAuthTokenCookie = () => {
  removeCookie("authToken");
};
