import { z } from 'zod';

export const landSchema = z.object({
    title: z.string().min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل').max(100, 'العنوان طويل جداً'),
    description: z.string().min(20, 'الوصف يجب أن يكون 20 حرفاً على الأقل'),
    price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'السعر يجب أن يكون رقماً موجباً'),
    area: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'المساحة يجب أن تكون رقماً موجباً'),
    wilaya: z.string().min(1, 'الولاية مطلوبة'),
    baladia: z.string().min(1, 'البلدية مطلوبة'),
    land_type: z.enum(['private', 'waqf', 'concession']),
    service_type: z.enum(['sale', 'rent']),
    phone: z.string().min(10, 'رقم الهاتف يجب أن يكون 10 أرقام على الأقل'),
    email: z.string().email('البريد الإلكتروني غير صحيح'),
});

export type LandFormValues = z.infer<typeof landSchema>;
