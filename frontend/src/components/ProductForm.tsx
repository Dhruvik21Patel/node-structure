import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import ProductService from '../services/product.service';
import CategoryService from '../services/category.service';
import {
  IProductResponse,
  ICreateProductRequest,
  IUpdateProductRequest,
  ICategoryResponse,
} from '../types/dtos';

interface ProductFormProps {
  currentProduct?: IProductResponse | null; // For editing
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ currentProduct, onSubmitSuccess, onCancel }) => {
  const [categories, setCategories] = useState<ICategoryResponse[]>([]);
  const methods = useForm<ICreateProductRequest | IUpdateProductRequest>({
    defaultValues: {
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      price: currentProduct?.price || 0,
      categoryId: currentProduct?.category.id || '', // Initialize with category ID for edit
    },
  });
  const { handleSubmit, reset, formState: { isSubmitting } } = methods;

  useEffect(() => {
    // Fetch categories for the dropdown
    const fetchCategories = async () => {
      try {
        const response = await CategoryService.getCategories(1, 100); // Fetch all categories
        if (response.success && response.data) {
          setCategories(response.data.items);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    reset({
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      price: currentProduct?.price || 0,
      categoryId: currentProduct?.category.id || '',
    });
  }, [currentProduct, reset]);

  const onSubmit = async (data: ICreateProductRequest | IUpdateProductRequest) => {
    try {
      const productData = {
        ...data,
        price: parseFloat(data.price as any), // Ensure price is a number
      };

      if (currentProduct) {
        // Update product
        await ProductService.updateProduct(currentProduct.id, productData as IUpdateProductRequest);
      } else {
        // Create new product
        await ProductService.createProduct(productData as ICreateProductRequest);
      }
      onSubmitSuccess();
    } catch (err: any) {
      alert(err.message || 'Failed to save product.');
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          name="name"
          label="Product Name"
          type="text"
          placeholder="Enter product name"
          rules={{ required: 'Product name is required' }}
        />
        <FormInput
          name="description"
          label="Description"
          type="textarea" // Assuming FormInput can handle textarea
          placeholder="Enter product description"
        />
        <FormInput
          name="price"
          label="Price"
          type="number"
          placeholder="0.00"
          step="0.01"
          rules={{
            required: 'Price is required',
            min: { value: 0, message: 'Price cannot be negative' },
            valueAsNumber: true,
          }}
        />
        <FormSelect
          name="categoryId"
          label="Category"
          options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
          placeholder="Select a category"
          rules={{ required: 'Category is required' }}
        />

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {currentProduct ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ProductForm;
