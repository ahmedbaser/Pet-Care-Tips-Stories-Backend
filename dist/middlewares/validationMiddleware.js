"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.updateProfileValidation = void 0;
const express_validator_1 = require("express-validator");
exports.updateProfileValidation = [
    (0, express_validator_1.body)('name').optional().isString().withMessage('Name must be a string'),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Must be a valid email'),
    (0, express_validator_1.body)('phone').optional().isString().withMessage('Phone must be a string'),
    (0, express_validator_1.body)('address').optional().isString().withMessage('Address must be a string'),
];
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.validate = validate;
