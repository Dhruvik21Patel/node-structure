export class CreateProductRequestDTO {
    name: string;
    description?: string;
    price: number;
    categoryId: string;

    constructor(data: { name: string; description?: string; price: number; categoryId: string }) {
        this.name = data.name;
        this.description = data.description;
        this.price = data.price;
        this.categoryId = data.categoryId;
    }
}

export class UpdateProductRequestDTO {
    name?: string;
    description?: string;
    price?: number;
    categoryId?: string;

    constructor(data: { name?: string; description?: string; price?: number; categoryId?: string }) {
        this.name = data.name;
        this.description = data.description;
        this.price = data.price;
        this.categoryId = data.categoryId;
    }
}
