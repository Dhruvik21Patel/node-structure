export class CreateCategoryRequestDTO {
    name: string;

    constructor(data: { name: string }) {
        this.name = data.name;
    }
}

export class UpdateCategoryRequestDTO {
    name: string;

    constructor(data: { name: string }) {
        this.name = data.name;
    }
}
