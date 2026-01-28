import { UserResponseDTO } from "./user.response.dto";

export class AuthResponseDTO {
    user: UserResponseDTO;
    token: string;

    constructor(data: { user: UserResponseDTO; token: string }) {
        this.user = data.user;
        this.token = data.token;
    }
}