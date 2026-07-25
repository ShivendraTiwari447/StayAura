const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.empty": "Title is required",
            "string.min": "Title must be at least 3 characters",
            "any.required": "Title is required",
        }),

    description: Joi.string()
        .trim()
        .min(10)
        .required()
        .messages({
            "string.empty": "Description is required",
            "string.min": "Description must be at least 10 characters",
        }),

    price: Joi.number()
        .min(0)
        .required()
        .messages({
            "number.base": "Price must be a number",
            "number.min": "Price cannot be negative",
            "any.required": "Price is required",
        }),

    location: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Location is required",
        }),

    country: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Country is required",
        }),

    imageUrl: Joi.string()
        .allow("", null)
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number()
            .min(1)
            .max(5)
            .required()
            .messages({
                "number.min": "Rating must be between 1 and 5",
                "number.max": "Rating must be between 1 and 5",
                "any.required": "Rating is required",
            }),

        comment: Joi.string()
            .trim()
            .min(5)
            .max(500)
            .required()
            .messages({
                "string.empty": "Comment is required",
                "string.min": "Comment must be at least 5 characters",
            }),
    }).required(),
});