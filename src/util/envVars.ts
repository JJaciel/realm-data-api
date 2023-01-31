export const getPort = () => {
  return process.env.PORT || "";
};

export const getAllowedCors = () => {
  return process.env.ALLOWED_CORS || "";
};

export const getAuthPublicKeyPath = () => {
  return process.env.JWT_AUTH_PUBLIC_KEY_PATH || "";
};

export const getGoogleAppCredentialsPath = () => {
  return process.env.GOOGLE_APPLICATION_CREDENTIALS || "";
};
