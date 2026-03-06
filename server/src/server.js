/**
 * Server Entrypoint
 */

const app = require('./app');
const config = require('./config/config');

const server = app.listen(config.PORT, () => {
  console.log(`[EvalStudio Server] Listening on http://localhost:${config.PORT}`);
});

module.exports = server;
