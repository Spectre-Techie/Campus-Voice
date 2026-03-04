import rateLimit from 'express-rate-limit';

// General API rate limit — 100 req / min per IP
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  validate: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later.',
    },
  },
});

// Submission limiter — 5 submissions / 15 min per IP
export const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  validate: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many submissions. Please wait before submitting again.',
    },
  },
});

// Upvote limiter — 30 upvotes / 15 min per IP
export const upvoteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  validate: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many upvotes. Please slow down.',
    },
  },
});

// Admin login limiter — 5 attempts / 15 min per IP
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  validate: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_LOGIN_ATTEMPTS',
      message: 'Too many failed login attempts. Please try again in 15 minutes.',
    },
  },
});

// Upload limiter — 20 uploads / 15 min per IP
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  validate: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many uploads. Please wait before uploading again.',
    },
  },
});

