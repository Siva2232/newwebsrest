import { createContext, useContext, useEffect, useState, useMemo } from "react";
import butter from "../assets/images/butter.png";
import onion from "../assets/images/onion.png";
import gopi from "../assets/images/gopi.png";
import masa from "../assets/images/masa.png";
import mango from "../assets/images/mango.png";
import fal from "../assets/images/fal.png";

const MOCK_PRODUCTS = [
  {
    id: "PROD-001",
    name: "Chicken Biryani",
    price: 220,
    type: "non-veg",
    description: "Aromatic & spicy rice dish with tender chicken",
    category: "Main Courses",
    image: "https://www.thedeliciouscrescent.com/wp-content/uploads/2016/05/Easy-Hyderabadi-Chicken-Biryani.jpg",
    available: true
  },
  { 
    id: "PROD-002", 
    name: "Paneer Butter Masala", 
    price: 180, 
    type: "veg", 
    description: "Creamy & rich cottage cheese curry", 
    category: "Main Courses", 
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80", 
    available: true 
  },
  { 
    id: "PROD-003", 
    name: "Veg Noodles", 
    price: 150, 
    type: "veg", 
    description: "Stir-fried noodles with fresh vegetables", 
    category: "Main Courses", 
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80", 
    available: true 
  },
  {
    id: "PROD-004",
    name: "Mutton Curry",
    price: 250,
    type: "non-veg",
    description: "Rich & spicy slow-cooked mutton gravy",
    category: "Main Courses",
    image: "https://veenaazmanov.com/wp-content/uploads/2020/04/Indian-Goat-Curry-or-Mutton-Curry21.jpg",
    available: true
  },
  { 
    id: "PROD-005", 
    name: "Veg Salad", 
    price: 120, 
    type: "veg", 
    description: "Fresh garden vegetables with light dressing", 
    category: "Starters", 
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80", 
    available: true 
  },
  { 
    id: "PROD-006", 
    name: "Butter Naan", 
    price: 60, 
    type: "veg", 
    description: "Soft tandoori bread brushed with butter", 
    category: "Main Courses", 
    image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=800&q=80", 
    available: true 
  },
  { 
    id: "PROD-007", 
    name: "Dal Tadka", 
    price: 160, 
    type: "veg", 
    description: "Tempered yellow lentils with aromatic spices", 
    category: "Main Courses", 
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80", 
    available: true 
  },
  { 
    id: "PROD-008", 
    name: "Chicken Tikka Masala", 
    price: 240, 
    type: "non-veg", 
    description: "Grilled chicken in creamy tomato sauce", 
    category: "Main Courses", 
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80", 
    available: true 
  },
  {
    id: "PROD-009",
    name: "Aloo Gobi",
    price: 140,
    type: "veg",
    description: "Spiced potato and cauliflower stir-fry",
    category: "Main Courses",
    image: gopi,
    available: true
  },
  { 
    id: "PROD-010", 
    name: "Gulab Jamun", 
    price: 90, 
    type: "veg", 
    description: "Soft fried dumplings soaked in rose syrup", 
    category: "Desserts", 
    image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=800&q=80", 
    available: true 
  },
  { 
    id: "PROD-011", 
    name: "Mango Lassi", 
    price: 80, 
    type: "veg", 
    description: "Refreshing sweet yogurt drink with mango", 
    category: "Beverages", 
    image: mango,
    available: true 
  },
  { id: "PROD-012", name: "Masala Chai", price: 50, type: "veg", description: "Spiced Indian tea with milk", category: "Beverages", image: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-013", name: "Fresh Lime Soda", price: 60, type: "veg", description: "Zesty lime soda – sweet or salted", category: "Beverages", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-014", name: "Vegetable Samosa", price: 80, type: "veg", description: "Crispy pastry filled with spiced potatoes and peas", category: "Starters", image: "https://www.seriouseats.com/thmb/4HxqFS6SHsh1XBCXWWHbsyrGOxI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/20210909-SAMOSAS-ANDREWJANJIGIAN-86-ca872c2eae8e4e7eb4e7b47cfad8715e.jpg", available: true },
  { id: "PROD-015", name: "Chicken 65", price: 180, type: "non-veg", description: "Spicy deep-fried chicken appetizer", category: "Starters", image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-016", name: "Palak Paneer", price: 190, type: "veg", description: "Cottage cheese in creamy spinach gravy", category: "Main Courses", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-017", name: "Onion Bhaji", price: 100, type: "veg", description: "Crispy fried onion fritters with spices", category: "Starters", image: onion, available: true },
  { id: "PROD-018", name: "Butter Chicken", price: 260, type: "non-veg", description: "Tender chicken in rich buttery tomato sauce", category: "Main Courses", image: butter, available: true },
  { id: "PROD-019", name: "Lamb Rogan Josh", price: 280, type: "non-veg", description: "Aromatic Kashmiri lamb curry with yogurt and spices", category: "Main Courses", image: "https://images.unsplash.com/photo-1542367592-8849eb950fd8?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-020", name: "Rasmalai", price: 120, type: "veg", description: "Soft cheese patties in creamy milk syrup with pistachios", category: "Desserts", image: masa, available: true },
  { id: "PROD-021", name: "Jalebi", price: 80, type: "veg", description: "Crispy pretzel-shaped sweets soaked in sugar syrup", category: "Desserts", image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-022", name: "Falooda", price: 130, type: "veg", description: "Chilled rose-flavored milk drink with vermicelli and basil seeds", category: "Beverages", image: fal, available: true },
  { id: "PROD-023", name: "Thandai", price: 100, type: "veg", description: "Cooling spiced milk drink with nuts and saffron", category: "Beverages", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80", available: true },
];
const DEFAULT_CATEGORIES = ["Starters", "Main Courses", "Desserts", "Beverages"];

const initializeProducts = () => {
  const stored = localStorage.getItem("products");
  // Use stored data if it exists, only use MOCK_PRODUCTS as fallback for first-time users
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // If localStorage is corrupted, fallback to mock data
      localStorage.setItem("products", JSON.stringify(MOCK_PRODUCTS));
      return MOCK_PRODUCTS;
    }
  }
  // First-time user: initialize with mock data
  localStorage.setItem("products", JSON.stringify(MOCK_PRODUCTS));
  return MOCK_PRODUCTS;
};

const initializeCategories = () => {
  const stored = localStorage.getItem("categories");
  if (!stored) {
    localStorage.setItem("categories", JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  }
  try {
    const parsed = JSON.parse(stored);
    // Always make sure default categories exist
    const merged = [...new Set([...DEFAULT_CATEGORIES, ...parsed])];
    return merged.length > 0 ? merged : DEFAULT_CATEGORIES;
  } catch {
    localStorage.setItem("categories", JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  }
};

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => initializeProducts());
  const [categories, setCategories] = useState(() => initializeCategories());

  // Ordered categories with preferred order
  const orderedCategories = useMemo(() => {
    const preferredOrder = ["Starters", "Main Courses", "Desserts", "Beverages", "Others"];
    const sorted = [...categories].sort((a, b) => {
      const ia = preferredOrder.indexOf(a);
      const ib = preferredOrder.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
    return sorted;
  }, [categories]);

  // Sync when localStorage changes (from other tabs/windows)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "products") {
        setProducts(initializeProducts());
      }
      if (e.key === "categories") {
        setCategories(initializeCategories());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Helper functions
  const saveProducts = (newProducts) => {
    setProducts(newProducts);
    localStorage.setItem("products", JSON.stringify(newProducts));
  };

  const saveCategories = (newCategories) => {
    setCategories(newCategories);
    localStorage.setItem("categories", JSON.stringify(newCategories));
  };

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: `PROD-${Date.now().toString(36)}`,
      available: true,
    };
    const updated = [...products, newProduct];
    saveProducts(updated);
  };

  const addCategory = (categoryName) => {
    const trimmed = categoryName?.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    
    const updated = [...categories, trimmed];
    saveCategories(updated);
  };

  const updateProduct = (id, updates) => {
    const updated = products.map(p => p.id === id ? { ...p, ...updates } : p);
    saveProducts(updated);
  };

  const deleteProduct = (id) => {
    const updated = products.filter(p => p.id !== id);
    saveProducts(updated);
  };

  const toggleAvailability = (id) => {
    const updated = products.map(p =>
      p.id === id ? { ...p, available: !p.available } : p
    );
    saveProducts(updated);
  };

  const value = {
    products,
    categories,
    orderedCategories,
    addProduct,
    addCategory,
    updateProduct,
    deleteProduct,
    toggleAvailability,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within ProductProvider");
  }
  return context;
};