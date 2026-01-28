export class UserResponseDTO {
    id: string;
    email: string;
    first_name: string;
    last_name: string | null;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: {
        id: string;
        email: string;
        first_name: string;
        last_name: string | null;
        status: boolean;
        createdAt: Date;
        updatedAt: Date;
    }) {
        this.id = data.id;
        this.email = data.email;
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.status = data.status;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
}
