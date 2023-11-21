class ApiResponse {
    constructor(data, success = true, status = 200, message = "success") {
        this.status = status < 400;
        this.message = message;
        this.data = data;
        this.success = success;
    }
}

export { ApiResponse }