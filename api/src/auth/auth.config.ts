export const getJwtSecret = (secret: string | undefined): string => {
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'FATAL: JWT_SECRET is not defined in production environment.',
      );
    }
    console.warn(
      'WARNING: JWT_SECRET not set, using unsafe default for development.',
    );
    return 'dev_secret_do_not_use_in_prod';
  }
  return secret;
};
