export const validateCSRF = (req, res, next) => {
  const cookieToken = req.cookies["XSRF-TOKEN"];
  const headerToken = req.headers["x-csrf-token"];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({ error: "CSRF token check failed" });
  }

  next();
};
