import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Middleware to check validation results
export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Land creation validation
export const validateLandCreation = [
    body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
    body('description').trim().isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
    body('price').isNumeric().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('area_m2').isNumeric().isFloat({ min: 1 }).withMessage('Area must be greater than 0'),
    body('type').isIn(['agricultural', 'private', 'waqf', 'concession']).withMessage('Invalid land type'),
    body('wilaya').trim().notEmpty().withMessage('Wilaya is required'),
    body('baladia').trim().notEmpty().withMessage('Baladia is required'),
    body('phone').optional().matches(/^(0)(5|6|7)[0-9]{8}$/).withMessage('Invalid Algerian phone number'),
    body('email').optional().isEmail().normalizeEmail().withMessage('Invalid email address'),
    validate,
];

// User registration validation
export const validateRegistration = [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('full_name').trim().isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
    body('phone').optional().isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits'),
    validate,
];

// Login validation
export const validateLogin = [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
];

// Search query validation
export const validateSearch = [
    query('minPrice').optional().isNumeric().withMessage('Min price must be a number'),
    query('maxPrice').optional().isNumeric().withMessage('Max price must be a number'),
    query('minArea').optional().isNumeric().withMessage('Min area must be a number'),
    query('maxArea').optional().isNumeric().withMessage('Max area must be a number'),
    validate,
];
