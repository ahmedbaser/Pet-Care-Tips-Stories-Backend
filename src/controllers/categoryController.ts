import { Request, Response } from 'express';
import Category, { ICategory } from '../models/Category';

// Create category
export const createCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, description } = req.body;
        const category: ICategory = new Category({ name, description });
        await category.save();
        return res.status(201).json({ success: true, message: "Category created", data: category });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get all categories
export const getCategories = async (req: Request, res: Response): Promise<Response> => {
    try {
        const categories = await Category.find();
        return res.status(200).json({ success: true, data: categories });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Update category
export const updateCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
        const category = await Category.findById(req.params.categoryId);
        if (!category) return res.status(404).json({ success: false, message: "Category not found" });

        category.name = req.body.name || category.name;
        category.description = req.body.description || category.description;
        await category.save();
        return res.status(200).json({ success: true, message: "Category updated", data: category });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Delete category
export const deleteCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
        const category = await Category.findById(req.params.categoryId);
        if (!category) return res.status(404).json({ success: false, message: "Category not found" });

        await category.deleteOne(); // Use deleteOne instead of remove
        return res.status(200).json({ success: true, message: "Category deleted" });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
