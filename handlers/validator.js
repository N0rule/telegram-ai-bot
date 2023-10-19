const { log, warn, error } = require('@handlers/logger');

module.exports = class Validator {
    
  static validateConfiguration() {
    log("Validating config file and environment variables");

    // Bot Token
    if (!process.env.BOT_TOKEN) {
      error("env: BOT_TOKEN cannot be empty");
      process.exit(1);
    }
    if (!process.env.OPENAI_API_BASE) {
        error("env: OPENAI_API_BASE is missing. AI commands won't work");
        process.exit(1);
      }
      if (!process.env.OPENAI_API_KEY) {
        error("env: OPENAI_API_KEY is missing. AI commands won't work");
        process.exit(1);
      }
};
}
