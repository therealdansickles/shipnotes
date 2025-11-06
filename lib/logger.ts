/**
 * Secure logging utility that prevents sensitive data from being logged
 * Use this instead of console.log/error in production code
 */

const SENSITIVE_KEYS = [
  'password',
  'token',
  'secret',
  'apikey',
  'api_key',
  'authorization',
  'cookie',
  'session',
  'access_token',
  'refresh_token',
  'github_token',
  'private_key',
  'client_secret',
]

function sanitizeValue(value: any): any {
  if (typeof value === 'string') {
    // Mask long strings that might be tokens (longer than 20 chars, contains only alphanumeric)
    if (value.length > 20 && /^[a-zA-Z0-9_-]+$/.test(value)) {
      return `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
    }
    return value
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue)
  }

  if (value && typeof value === 'object') {
    return sanitizeObject(value)
  }

  return value
}

function sanitizeObject(obj: any): any {
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  const sanitized: any = {}

  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase()

    // Check if key contains sensitive information
    if (SENSITIVE_KEYS.some(sensitive => lowerKey.includes(sensitive))) {
      sanitized[key] = '[REDACTED]'
      continue
    }

    sanitized[key] = sanitizeValue(value)
  }

  return sanitized
}

export const logger = {
  /**
   * Log informational messages (only in development)
   */
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, data ? sanitizeValue(data) : '')
    }
  },

  /**
   * Log errors (sanitized in production)
   */
  error: (message: string, error?: any) => {
    if (process.env.NODE_ENV === 'production') {
      // In production, log minimal information
      console.error(`[ERROR] ${message}`)

      // If error is an Error object, log only the message (not the stack)
      if (error instanceof Error) {
        console.error(`Error message: ${error.message}`)
      } else if (error) {
        console.error('Error data:', sanitizeValue(error))
      }
    } else {
      // In development, log everything for debugging
      console.error(`[ERROR] ${message}`, error)
    }
  },

  /**
   * Log warnings
   */
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data ? sanitizeValue(data) : '')
  },

  /**
   * Log debug information (only in development)
   */
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data ? sanitizeValue(data) : '')
    }
  },

  /**
   * Sanitize an object for safe logging
   */
  sanitize: sanitizeValue,
}
