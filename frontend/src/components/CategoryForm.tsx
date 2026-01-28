import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import FormInput from './FormInput';
import CategoryService from '../services/category.service';
import { ICategoryResponse, ICreateCategoryRequest, IUpdateCategoryRequest } from '../types/dtos';

interface CategoryFormProps {
  currentCategory?: ICategoryResponse | null; // For editing
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ currentCategory, onSubmitSuccess, onCancel }) => {
  const methods = useForm<ICreateCategoryRequest | IUpdateCategoryRequest>({
    defaultValues: {
      name: currentCategory?.name || '',
    },
  });
  const { handleSubmit, reset, formState: { isSubmitting } } = methods;

  useEffect(() => {
    reset({
      name: currentCategory?.name || '',
    });
  }, [currentCategory, reset]);

  const onSubmit = async (data: ICreateCategoryRequest | IUpdateCategoryRequest) => {
    try {
      if (currentCategory) {
        // Update category
        await CategoryService.updateCategory(currentCategory.id, data as IUpdateCategoryRequest);
      } else {
        // Create new category
        await CategoryService.createCategory(data as ICreateCategoryRequest);
      }
      onSubmitSuccess();
    } catch (err: any) {
      alert(err.message || 'Failed to save category.');
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          name="name"
          label="Category Name"
          type="text"
          placeholder="Enter category name"
          rules={{ required: 'Category name is required' }}
        />
        {/* Error message is now handled by FormInput */}

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
            {currentCategory ? 'Save Changes' : 'Add Category'}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default CategoryForm;
