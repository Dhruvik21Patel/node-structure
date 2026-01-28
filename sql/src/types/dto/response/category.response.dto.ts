export class CategoryResponseDTO {
    id: string;
    name: string;
    createdAt: Date;

    constructor(data: { id: string; name: string; createdAt: Date }) {
        this.id = data.id;
        this.name = data.name;
        this.createdAt = data.createdAt;
    }
}