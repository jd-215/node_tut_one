class ApiResponse {
      constructor(statusCode, message = "success", data, success = true) {
            this.status = statusCode < 400 ? statusCode : 401;
            this.message = message;
            this.data = data;
            this.success = success;
      }
}

export { ApiResponse };
