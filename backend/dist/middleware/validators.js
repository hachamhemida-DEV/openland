"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSearch = exports.validateLogin = exports.validateRegistration = exports.validateLandCreation = exports.validate = void 0;
const express_validator_1 = require("express-validator");
// Middleware to check validation results
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.validate = validate;
// Land creation validation
exports.validateLandCreation = [
    (0, express_validator_1.body)('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
    (0, express_validator_1.body)('description').trim().isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
    (0, express_validator_1.body)('price').isNumeric().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    (0, express_validator_1.body)('area_m2').isNumeric().isFloat({ min: 1 }).withMessage('Area must be greater than 0'),
    (0, express_validator_1.body)('type').isIn(['agricultural', 'private', 'waqf', 'concession']).withMessage('Invalid land type'),
    (0, express_validator_1.body)('wilaya').trim().notEmpty().withMessage('Wilaya is required'),
    (0, express_validator_1.body)('baladia').trim().notEmpty().withMessage('Baladia is required'),
    (0, express_validator_1.body)('phone').optional().matches(/^(0)(5|6|7)[0-9]{8}$/).withMessage('Invalid Algerian phone number'),
    (0, express_validator_1.body)('email').optional().isEmail().normalizeEmail().withMessage('Invalid email address'),
    exports.validate,
];
// User registration validation
exports.validateRegistration = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    (0, express_validator_1.body)('full_name').trim().isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
    (0, express_validator_1.body)('phone').optional().isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits'),
    exports.validate,
];
// Login validation
exports.validateLogin = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
    exports.validate,
];
// Search query validation
exports.validateSearch = [
    (0, express_validator_1.query)('minPrice').optional().isNumeric().withMessage('Min price must be a number'),
    (0, express_validator_1.query)('maxPrice').optional().isNumeric().withMessage('Max price must be a number'),
    (0, express_validator_1.query)('minArea').optional().isNumeric().withMessage('Min area must be a number'),
    (0, express_validator_1.query)('maxArea').optional().isNumeric().withMessage('Max area must be a number'),
    exports.validate,
];
