/**
 * LogBright v1.0.0
 * A lightweight, optimized JavaScript logging utility focused on clean implementation patterns
 * and performance-oriented console output management.
 * 
 * @author Example Development Team
 * @license MIT
 */

/**
 * Core configuration parameters for the logging system
 * @type {Object}
 */
const DEFAULT_CONFIG = {
  enabled: true,
  level: 'info',
  prefix: '[LogBright]',
  includeTimestamp: true,
  timestampFormat: 'ISO', // 'ISO' or 'LOCALE'
  levels: {
    debug: { priority: 0, color: '#7f8c8d' },
    info: { priority: 1, color: '#2ecc71' },
    warn: { priority: 2, color: '#f39c12' },
    error: { priority: 3, color: '#e74c3c' }
  }
};

/**
 * LogBright implementation - a minimal, performant logging abstraction
 */
class LogBright {
  /**
   * Create a new LogBright instance
   * @param {Object} customConfig - Override default configuration
   */
  constructor(customConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...customConfig };
    this._initializeMethods();
  }

  /**
   * Initialize logging methods based on configured levels
   * @private
   */
  _initializeMethods() {
    Object.keys(this.config.levels).forEach(level => {
      this[level] = (message, ...args) => this._log(level, message, args);
    });
  }

  /**
   * Format a timestamp according to configuration
   * @private
   * @returns {String} Formatted timestamp
   */
  _getTimestamp() {
    const now = new Date();
    if (this.config.timestampFormat === 'ISO') {
      return now.toISOString();
    }
    return now.toLocaleTimeString();
  }

  /**
   * Core logging implementation
   * @private
   * @param {String} level - Log level
   * @param {String|Object} message - Message to log
   * @param {Array} args - Additional arguments
   */
  _log(level, message, args = []) {
    // Skip if logging is disabled or level is below threshold
    if (!this.config.enabled || 
        this.config.levels[level].priority < 
        this.config.levels[this.config.level].priority) {
      return;
    }

    // Prepare log components
    const timestamp = this.config.includeTimestamp ? 
      `${this._getTimestamp()} ` : '';
    const prefix = `${this.config.prefix} [${level.toUpperCase()}]`;
    const color = this.config.levels[level].color;
    
    // Handle different message types
    const formattedMessage = typeof message === 'object' ? 
      JSON.stringify(message) : message;
    
    // Output to console with styling
    console.log(
      `%c${timestamp}${prefix}%c ${formattedMessage}`,
      `color: ${color}; font-weight: bold;`,
      'color: inherit;',
      ...args
    );
  }
  
  /**
   * Simple message logger - the core requested functionality
   * @param {String} message - Message to log
   */
  log(message) {
    this._log('info', message, []);
  }
}

// Export as module or global
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LogBright;
} else {
  window.LogBright = LogBright;
}

// Usage examples
const logger = new LogBright();
logger.log('Hello, LogBright!');

// Additional examples demonstrating the library's capabilities
// logger.info('Application starting');
// logger.warn('Resource usage at 80%');
// logger.error('Connection failed', { host: 'example.com', attempt: 3 });