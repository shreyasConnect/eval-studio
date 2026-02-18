/**
 * Server Configuration Defaults
 */

module.exports = {
  PORT: process.env.PORT || 5000,
  EXECUTION_TIMEOUT_MS: 3000,
  MAX_HISTORY_ENTRIES: 100,
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
};
