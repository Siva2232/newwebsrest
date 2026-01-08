import { createContext, useContext, useEffect, useState, useMemo } from "react";

const MOCK_PRODUCTS = [
  { id: "PROD-001", name: "Chicken Biryani", price: 220, type: "non-veg", description: "Aromatic & spicy rice dish with tender chicken", category: "Main Courses", image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-002", name: "Paneer Butter Masala", price: 180, type: "veg", description: "Creamy & rich cottage cheese curry", category: "Main Courses", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-003", name: "Veg Noodles", price: 150, type: "veg", description: "Stir-fried noodles with fresh vegetables", category: "Main Courses", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-004", name: "Mutton Curry", price: 250, type: "non-veg", description: "Rich & spicy slow-cooked mutton gravy", category: "Main Courses", image: "https://images.unsplash.com/photo-1603894584713-b48dc4294024?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-005", name: "Veg Salad", price: 120, type: "veg", description: "Fresh garden vegetables with light dressing", category: "Starters", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-006", name: "Butter Naan", price: 60, type: "veg", description: "Soft tandoori bread brushed with butter", category: "Main Courses", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-007", name: "Dal Tadka", price: 160, type: "veg", description: "Tempered yellow lentils with aromatic spices", category: "Main Courses", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-008", name: "Chicken Tikka Masala", price: 240, type: "non-veg", description: "Grilled chicken in creamy tomato sauce", category: "Main Courses", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-009", name: "Palak Paneer", price: 190, type: "veg", description: "Cottage cheese in creamy spinach gravy", category: "Main Courses", image: "https://images.unsplash.com/photo-1601050638917-3606f50922c2?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-010", name: "Gulab Jamun", price: 90, type: "veg", description: "Soft fried dumplings soaked in rose syrup", category: "Desserts", image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-011", name: "Mango Lassi", price: 80, type: "veg", description: "Refreshing sweet yogurt drink with mango", category: "Beverages", image: "https://images.unsplash.com/photo-1571006682864-74888cdf8d58?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-012", name: "Masala Chai", price: 50, type: "veg", description: "Spiced Indian tea with milk", category: "Beverages", image: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-013", name: "Fresh Lime Soda", price: 60, type: "veg", description: "Zesty lime soda – sweet or salted", category: "Beverages", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-014", name: "Vegetable Samosa", price: 80, type: "veg", description: "Crispy pastry filled with spiced potatoes and peas", category: "Starters", image: "https://images.unsplash.com/photo-1601050638917-3606f50922c2?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-015", name: "Chicken 65", price: 180, type: "non-veg", description: "Spicy deep-fried chicken appetizer", category: "Starters", image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-016", name: "Onion Bhaji", price: 100, type: "veg", description: "Crispy fried onion fritters with spices", category: "Starters", image: "https://images.unsplash.com/photo-1601050638917-3606f50922c2?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-017", name: "Butter Chicken", price: 260, type: "non-veg", description: "Tender chicken in rich buttery tomato sauce", category: "Main Courses", image: "https://images.unsplash.com/photo-1603894584713-b48dc4294024?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-018", name: "Lamb Rogan Josh", price: 280, type: "non-veg", description: "Aromatic Kashmiri lamb curry with yogurt and spices", category: "Main Courses", image: "https://images.unsplash.com/photo-1542367592-8849eb950fd8?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-019", name: "Aloo Gobi", price: 140, type: "veg", description: "Spiced potato and cauliflower stir-fry", category: "Main Courses", image: "https://images.unsplash.com/photo-1631209121151-5464195156f4?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-020", name: "Rasmalai", price: 120, type: "veg", description: "Soft cheese patties in creamy milk syrup with pistachios", category: "Desserts", image: "https://images.unsplash.com/photo-1645177623570-5896a7605963?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-021", name: "Jalebi", price: 80, type: "veg", description: "Crispy pretzel-shaped sweets soaked in sugar syrup", category: "Desserts", image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-022", name: "Falooda", price: 130, type: "veg", description: "Chilled rose-flavored milk drink with vermicelli and basil seeds", category: "Beverages", image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-023", name: "Thandai", price: 100, type: "veg", description: "Cooling spiced milk drink with nuts and saffron", category: "Beverages", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80", available: true },
];
const MOCK_CATEGORIES = ["Starters", "Main Courses", "Desserts", "Beverages"];

const getProducts = () => {
  let stored = JSON.parse(localStorage.getItem("products")) || [];
  if (stored.length === 0) {
    localStorage.setItem("products", JSON.stringify(MOCK_PRODUCTS));
    return MOCK_PRODUCTS;
  }
  return stored;
};

const setProductsToStorage = (data) => {
  localStorage.setItem("products", JSON.stringify(data));
  window.dispatchEvent(new Event("storage"));
};

// --- HELPER TO SAVE CATEGORIES ---
const setCategoriesToStorage = (data) => {
  localStorage.setItem("categories", JSON.stringify(data));
  window.dispatchEvent(new Event("storage"));
};

const getCategories = () => {
  const stored = JSON.parse(localStorage.getItem("categories")) || [];
  // Merge stored with mocks to ensure defaults always exist
  let merged = [...new Set([...MOCK_CATEGORIES, ...stored])];
  return merged;
};

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(getProducts());
  const [categories, setCategories] = useState(getCategories());

  const orderedCategories = useMemo(() => {
    const preferredOrder = ["Starters", "Main Courses", "Desserts", "Beverages"];
    const preferred = preferredOrder.filter((c) => categories.includes(c));
    const others = categories.filter((c) => !preferredOrder.includes(c)).sort();
    return [...preferred, ...others];
  }, [categories]);

  useEffect(() => {
    const sync = () => {
      setProducts(getProducts());
      setCategories(getCategories());
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: `PROD-${Date.now()}`,
      available: true
    };
    const updated = [...products, newProduct];
    setProducts(updated);
    setProductsToStorage(updated);
  };

  // --- NEW: ADD CATEGORY FUNCTION ---
  const addCategory = (categoryName) => {
    if (!categories.includes(categoryName)) {
      const updated = [...categories, categoryName];
      setCategories(updated);
      setCategoriesToStorage(updated); // Saves to LocalStorage
    }
  };

  const updateProduct = (id, data) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...data } : p));
    setProducts(updated);
    setProductsToStorage(updated);
  };

  const deleteProduct = (id) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    setProductsToStorage(updated);
  };

  const toggleAvailability = (id) => {
    const updated = products.map((p) => (p.id === id ? { ...p, available: !p.available } : p));
    setProducts(updated);
    setProductsToStorage(updated);
  };

  return (
    <ProductContext.Provider 
      value={{ 
        products, 
        categories, 
        orderedCategories, 
        addProduct, 
        addCategory, // ✅ WAS MISSING: Now exported to components
        updateProduct, 
        deleteProduct, 
        toggleAvailability 
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);