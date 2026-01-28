import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import UserService from '../services/user.service';
import { IUserResponse, IUpdateUserRequest } from '../types/dtos';

interface UserFormProps {
  currentUser: IUserResponse; // Required for editing
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ currentUser, onSubmitSuccess, onCancel }) => {
  const methods = useForm<IUpdateUserRequest & { id: string; email: string }>({ // Include id and email in form data type
    defaultValues: {
      id: currentUser.id,
      email: currentUser.email,
      first_name: currentUser.first_name || '',
      last_name: currentUser.last_name || '',
      status: currentUser.status,
    },
  });
  const { handleSubmit, reset, formState: { isSubmitting } } = methods;

  useEffect(() => {
    reset({
      id: currentUser.id,
      email: currentUser.email,
      first_name: currentUser.first_name || '',
      last_name: currentUser.last_name || '',
      status: currentUser.status,
    });
  }, [currentUser, reset]);

  const onSubmit = async (data: IUpdateUserRequest & { id: string; email: string }) => {
    try {
      // Use the new updateUser method which takes ID and data
      await UserService.updateUser(data.id, {
        first_name: data.first_name,
        last_name: data.last_name,
        status: data.status,
      });
      onSubmitSuccess();
    } catch (err: any) {
      alert(err.message || 'Failed to update user profile.');
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Read-only fields */}
        <FormInput
          name="id"
          label="ID"
          type="text"
          readOnly // Still read-only
        />
        <FormInput
          name="email"
          label="Email"
          type="email"
          readOnly // Still read-only
        />

        <FormInput
          name="first_name"
          label="First Name"
          type="text"
          rules={{ required: 'First name is required' }}
        />
        <FormInput
          name="last_name"
          label="Last Name"
          type="text"
        />
        <FormSelect
          name="status"
          label="Status"
          options={[
            { value: true, label: 'Active' },
            { value: false, label: 'Inactive' },
          ]}
          rules={{ required: 'Status is required' }}
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
            Save Changes
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default UserForm;
