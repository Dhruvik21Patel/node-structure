export class UpdateUserRequestDTO {
    email?: string;
    first_name?: string;
    last_name?: string;
    status?: boolean;

    constructor(data: { email?: string; first_name?: string; last_name?: string; status?: boolean }) {
        this.email = data.email;
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.status = data.status;
    }
}
