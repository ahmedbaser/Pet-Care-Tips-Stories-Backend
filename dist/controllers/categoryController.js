"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategories = exports.createCategory = void 0;
const Category_1 = __importDefault(require("../models/Category"));
// Create category
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = req.body;
        const category = new Category_1.default({ name, description });
        yield category.save();
        return res.status(201).json({ success: true, message: "Category created", data: category });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.createCategory = createCategory;
// Get all categories
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield Category_1.default.find();
        return res.status(200).json({ success: true, data: categories });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.getCategories = getCategories;
// Update category
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield Category_1.default.findById(req.params.categoryId);
        if (!category)
            return res.status(404).json({ success: false, message: "Category not found" });
        category.name = req.body.name || category.name;
        category.description = req.body.description || category.description;
        yield category.save();
        return res.status(200).json({ success: true, message: "Category updated", data: category });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.updateCategory = updateCategory;
// Delete category
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield Category_1.default.findById(req.params.categoryId);
        if (!category)
            return res.status(404).json({ success: false, message: "Category not found" });
        yield category.deleteOne(); // Use deleteOne instead of remove
        return res.status(200).json({ success: true, message: "Category deleted" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.deleteCategory = deleteCategory;
