import { z } from 'zod';

// Login Schema
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Register Schema
export const registerSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name is too long'),
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password is too long'),
    role: z.enum(['broker', 'client']),
    phone: z
        .string()
        .max(20, 'Phone number is too long')
        .optional()
        .or(z.literal('')),
}).refine((data) => {
    // Phone is required for brokers
    if (data.role === 'broker' && (!data.phone || data.phone.trim().length === 0)) {
        return false;
    }
    return true;
}, {
    message: 'Phone number is required for broker registration',
    path: ['phone'],
}).refine((data) => data.role === 'broker' || data.role === 'client', {
    message: 'Invalid role selected',
});

export type RegisterInput = z.infer<typeof registerSchema>;

// Property Schema
export const propertySchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .min(5, 'Title must be at least 5 characters')
        .max(200, 'Title is too long'),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(5000, 'Description is too long')
        .optional()
        .or(z.literal('')),
    type: z.enum(['villa', 'apartment', 'commercial', 'office', 'land']),
    purpose: z.enum(['sale', 'rent']),
    price: z
        .number()
        .positive('Price must be a positive number')
        .min(1, 'Price must be at least 1'),
    area_sqft: z
        .number()
        .positive('Area must be a positive number')
        .min(1, 'Area must be at least 1'),
    bedrooms: z
        .number()
        .int('Bedrooms must be a whole number')
        .min(0, 'Bedrooms cannot be negative')
        .max(50, 'Bedrooms value is too high')
        .optional(),
    bathrooms: z
        .number()
        .int('Bathrooms must be a whole number')
        .min(0, 'Bathrooms cannot be negative')
        .max(50, 'Bathrooms value is too high')
        .optional(),
    emirate: z
        .string()
        .min(1, 'Emirate is required')
        .min(2, 'Emirate name is too short'),
    location: z
        .string()
        .max(200, 'Location is too long')
        .optional()
        .or(z.literal('')),
    images: z
        .array(z.string().url('Please enter valid image URLs'))
        .min(0)
        .max(20, 'Maximum 20 images allowed')
        .optional(),
    features: z
        .array(z.string())
        .optional(),
    status: z.enum(['active', 'closed', 'sold', 'rented']).optional(),
    existingImages: z.union([z.string(), z.array(z.string())]).optional(),
});

export type PropertyInput = z.infer<typeof propertySchema>;

// Contact Form Schema
export const contactSchema = z.object({
    firstName: z
        .string()
        .min(1, 'First name is required')
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name is too long'),
    lastName: z
        .string()
        .min(1, 'Last name is required')
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name is too long'),
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    phone: z
        .string()
        .max(20, 'Phone number is too long')
        .regex(/^[\d\s\+\-\(\)]+$/, 'Please enter a valid phone number')
        .optional()
        .or(z.literal('')),
    subject: z
        .string()
        .min(1, 'Subject is required'),
    message: z
        .string()
        .min(10, 'Message must be at least 10 characters')
        .max(2000, 'Message is too long'),
});

export type ContactInput = z.infer<typeof contactSchema>;

// Deal Schema
export const dealSchema = z.object({
    propertyId: z
        .number()
        .int('Property ID must be a whole number')
        .positive('Property ID is required'),
    brokerId: z
        .number()
        .int('Broker ID must be a whole number')
        .positive('Broker ID is required'),
    companyId: z
        .number()
        .int('Company ID must be a whole number')
        .positive('Company ID is required'),
    clientId: z
        .number()
        .int('Client ID must be a whole number')
        .optional()
        .nullable(),
    clientName: z
        .string()
        .min(1, 'Client name is required')
        .min(2, 'Client name must be at least 2 characters')
        .max(200, 'Client name is too long'),
    dealType: z.enum(['sale', 'rent']),
    dealValue: z
        .number()
        .positive('Deal value must be a positive number')
        .min(1, 'Deal value must be at least 1'),
    commissionRate: z
        .number()
        .positive('Commission rate must be a positive number')
        .min(0, 'Commission rate cannot be negative')
        .max(1, 'Commission rate must be between 0 and 1 (e.g., 0.05 for 5%)')
        .optional()
        .nullable(),
    status: z.enum(['open', 'closed', 'cancelled']).optional(),
});

export type DealInput = z.infer<typeof dealSchema>;
