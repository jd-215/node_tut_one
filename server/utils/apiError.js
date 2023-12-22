class ApiError extends Error {
      constructor(status, message = "Internal Server Error", errors = [], stack = "") {
            super(message);
            this.status = status;
            this.message = message;
            this.errors = errors;
            this.stack = stack;
            this.data = null;
            this.success = false;

            if (stack) {
                  this.stack = stack;
            } else {
                  Error.captureStackTrace(this, this.constructor);
            }
      }
}

export { ApiError };
