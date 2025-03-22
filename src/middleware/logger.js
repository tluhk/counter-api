/**
 * Request logging middleware
 */
const morgan = require('morgan');

// Create a custom Morgan format with ISO timestamp and colorized status codes
morgan.token('colorstatus', (req, res) => {
  const status = res.statusCode;
  let color = '\x1b[32m'; // Green for success

  if (status >= 400 && status < 500) {
    color = '\x1b[33m'; // Yellow for client errors
  } else if (status >= 500) {
    color = '\x1b[31m'; // Red for server errors
  }

  return `${color}${status}\x1b[0m`; // Reset color after status
});

// Export middleware
module.exports = morgan('[:date[iso]] :method :url :colorstatus :res[content-length] - :response-time ms');
