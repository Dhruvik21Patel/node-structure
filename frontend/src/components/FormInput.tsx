import React from 'react';
import { useFormContext, RegisterOptions } from 'react-hook-form';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  name: string;
  label: string;
  type?: string;
  rules?: RegisterOptions; // New prop for validation rules
}

const FormInput: React.FC<FormInputProps> = ({ name, label, type = 'text', rules, ...rest }) => {
  const { register, formState: { errors } } = useFormContext();
  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          {...register(name, rules)}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} // Cast for textarea specific props
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          rows={3} // Default rows for textarea
        />
      ) : (
        <input
          id={name}
          type={type}
          {...register(name, rules)}
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)} // Cast for input specific props
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      )}
      {errorMessage && (
        <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};

export default FormInput;
