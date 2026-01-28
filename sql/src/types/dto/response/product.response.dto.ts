import { PlainProduct } from "../../../repositories/product.repository";
import { CategoryResponseDTO } from "./category.response.dto";
import { UserResponseDTO } from "./user.response.dto";

export class ProductResponseDTO {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: CategoryResponseDTO | null;
  user: UserResponseDTO | null;
  createdAt: Date;

  constructor(data: PlainProduct) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.category = data.category
      ? new CategoryResponseDTO(data.category)
      : null;
    this.user = data.user ? new UserResponseDTO(data.user) : null;
    this.createdAt = data.createdAt;
  }
}
