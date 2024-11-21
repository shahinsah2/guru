
  
  "use server";
  
  import { connectToDatabase } from "@/lib/database";
  import Product from "@/lib/database/models/Inventory/Products.model";
  import ProductCategory from "@/lib/database/models/productLibrary/ProductCategory.model";
  import Brand from "@/lib/database/models/productLibrary/Brand.model";
  import ItemVariant from "@/lib/database/models/productLibrary/ItemVariant.model";
  
  
  
  // Fetch active Product Categories
  export const getActiveProductCategories = async () => {
    await connectToDatabase();
    return await ProductCategory.find({ active_status: true }, 'category_name').lean();
  };
  
  // Fetch active Brands
  export const getActiveBrands = async () => {
    await connectToDatabase();
    return await Brand.find({ active_status: true }, 'brand_name').lean();
  };
  
  // Fetch active Item Variants
  export const getActiveItemVariants = async () => {
    await connectToDatabase();
    return await ItemVariant.find({ active_status: true }).lean();
  };
  
  
  
  
  
  // Get all products
  export const getProducts = async () => {
    await connectToDatabase();
    const products = await Product.find({})
    .populate('category', 'category_name')
    .populate('brand', 'brand_name')
    .populate("specifications.ram.brand", "brand_name")
    .populate("specifications.ram.type", "type")
    .populate("specifications.processor.brand", "brand_name")
    .populate("specifications.processor.type", "type")
    .populate("specifications.storage.brand", "brand_name")
    .populate("specifications.storage.type", "type")
    .populate("specifications.graphics.brand", "brand_name")
    .populate("specifications.graphics.type", "type")
    .populate("specifications.os.brand", "brand_name")
    .populate("specifications.os.type", "type")
    .lean();
    return products.map((product) => ({
      ...product,
      _id: product._id.toString(),  // Convert ObjectId to string
      category: product.category?.category_name || '',
      brand: product.brand?.brand_name || '',
    }));
  };
  
  
  // Get a single product by ID
  export const getProductById = async (id) => {
    try {
      await connectToDatabase();
      const product = await Product.findById(id)
  
        .populate('category', 'category_name')
        .populate('brand', 'brand_name')
        .lean();
      if (!product) return null;
      return {
        ...product,
        _id: product._id.toString(),  // Convert ObjectId to string
      };
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw new Error("Error fetching product: " + error.message);
    }
  };
  
  // Create a new product
  export const createProduct = async (currentState, templateData) => {
    try {
      await connectToDatabase();
      const newTemplate = new Product(templateData);
      const savedTemplate = await newTemplate.save();
      return { success: true, error: false, message: "Product Template created successfully", template: savedTemplate.toObject() };
    } catch (error) {
      console.error("Error creating product template:", error);
      return { success: false, error: true, message: "Error creating product template." };
    }
  };
  
  // Update an existing product
  export const updateProduct = async (currentState, templateData) => {
    try {
      await connectToDatabase();
      const id = templateData.id;
      const updatedTemplate = await Product.findByIdAndUpdate(id, templateData, { new: true });
      if (!updatedTemplate) {
        return { success: false, error: true, message: "Product Template not found" };
      }
      return { success: true, error: false, message: "Product Template updated successfully", template: updatedTemplate.toObject() };
    } catch (error) {
      console.error("Error updating product template:", error);
      return { success: false, error: true, message: "Error updating product template." };
    }
  };
  
  // Delete a product
  export const deleteProduct = async (id) => {
    try {
      await connectToDatabase();
      const deletedProduct = await Product.findByIdAndDelete(id)
  ;
      if (!deletedProduct) {
        return { success: false, message: "Product not found" };
      }
      return { success: true, message: "Product deleted successfully" };
    } catch (error) {
      console.error("Error deleting product:", error);
      return { success: false, message: "Error deleting product." };
    }
  };