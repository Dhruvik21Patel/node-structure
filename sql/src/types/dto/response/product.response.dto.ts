import { PlainProduct } from "../../../repositories/product.repository";
import { CategoryResponseDTO } from "./category.response.dto";
import { UserResponseDTO } from "./user.response.dto";

export class ProductResponseDTO {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: CategoryResponseDTO;
  user: UserResponseDTO;
  createdAt: Date;

  constructor(data: PlainProduct) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.category = new CategoryResponseDTO(data.category);
    this.user = new UserResponseDTO(data.user);
    this.createdAt = data.createdAt;
  }
}
