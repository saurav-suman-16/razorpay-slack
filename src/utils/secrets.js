const config = require("config");

const isLocal = ["test", "localhost"].includes(process.env.NODE_ENV);

/**
 * Get secrets from config file for local and from environment variables for other environments
 * @param {String} key root key containing the secrets
 * @return {Object} secret for the given key.
 */
exports.get = (key) => {
  if (isLocal) {
    return config.get(key);
  }
  const allSecrets = JSON.parse(process.env.SECRETS || null);
  return allSecrets[key];
};
