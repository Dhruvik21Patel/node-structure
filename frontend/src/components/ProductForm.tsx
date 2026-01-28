import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import ProductService from "../services/product.service";
import CategoryService from "../services/category.service";
import {
  IProductResponse,
  ICreateProductRequest,
  IUpdateProductRequest,
  ICategoryResponse,
} from "../types/dtos";

interface ProductFormProps {
  currentProduct?: IProductResponse | null;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

type ProductFormData = ICreateProductRequest;

const ProductForm: React.FC<ProductFormProps> = ({
  currentProduct,
  onSubmitSuccess,
  onCancel,
}) => {
  const [categories, setCategories] = useState<ICategoryResponse[]>([]);

  const methods = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      categoryId: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  // ✅ Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await CategoryService.getCategories({
        page: 1,
        limit: 100,
      });
      if (response.success && response.data) {
        setCategories(response.data.items);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Reset form when editing AND when categories loaded
  useEffect(() => {
    if (currentProduct && categories.length > 0) {
      reset({
        name: currentProduct.name,
        description: currentProduct.description || "",
        price: currentProduct.price,
        categoryId: currentProduct.category?.id || "",
      });
    }
  }, [currentProduct, categories, reset]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (currentProduct) {
        await ProductService.updateProduct(currentProduct.id, data);
      } else {
        await ProductService.createProduct(data);
      }
      onSubmitSuccess();
    } catch (err: any) {
      alert(err.message || "Failed to save product.");
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          name="name"
          label="Product Name"
          type="text"
          rules={{ required: "Product name is required" }}
        />

        <FormInput name="description" label="Description" type="textarea" />

        <FormInput
          name="price"
          label="Price"
          type="number"
          step="0.01"
          rules={{
            required: "Price is required",
            min: { value: 0, message: "Price cannot be negative" },
            valueAsNumber: true,
          }}
        />

        <FormSelect
          name="categoryId"
          label="Category"
          options={categories.map((cat) => ({
            value: cat.id,
            label: cat.name,
          }))}
          rules={{ required: "Category is required" }}
        />

        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>

          <button type="submit" disabled={isSubmitting}>
            {currentProduct ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ProductForm;
