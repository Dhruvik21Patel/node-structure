export class RegisterRequestDTO {
    email: string;
    password: string;
    first_name: string;
    last_name?: string;

    constructor(data: { email: string; password: string; first_name: string; last_name?: string; }) {
        this.email = data.email;
        this.password = data.password;
        this.first_name = data.first_name;
        this.last_name = data.last_name;
    }
}

export class LoginRequestDTO {
    email: string;
    password: string;

    constructor(data: { email: string; password: string }) {
        this.email = data.email;
        this.password = data.password;
    }
}