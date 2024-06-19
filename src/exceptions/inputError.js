const clientError = require('../exceptions/clientError');

class InputError extends clientError {
  constructor(message) {
    super(message);
    this.name = 'InputError';
  }
}

module.exports = InputError;
