import Z from 'zod';

export const CreateAddressSchema = Z.object({
  street: Z.string()
    .trim()
    .min(1, 'Street is required')
    .max(100, 'Street must be at most 100 characters'),
  city: Z.string().trim().min(1, 'City is required').max(50, 'City must be at most 50 characters'),
  state: Z.string()
    .trim()
    .min(1, 'State is required')
    .max(50, 'State must be at most 50 characters'),
  postalCode: Z.string()
    .trim()
    .min(1, 'Postal code is required')
    .max(20, 'Postal code must be at most 20 characters'),
  country: Z.string()
    .trim()
    .min(1, 'Country is required')
    .max(50, 'Country must be at most 50 characters'),
});

export const PatchAddressSchema = CreateAddressSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: 'At least one field must be provided for update',
  },
);

export const AddressIdParamsSchema = Z.object({
  id: Z.coerce.number().int().positive('Address ID must be a positive integer'),
});
