import { createContext, useContext, useEffect, useState, useMemo } from "react";

const MOCK_PRODUCTS = [
  { id: "PROD-001", name: "Chicken Biryani", price: 220, type: "non-veg", description: "Aromatic & spicy rice dish with tender chicken", category: "Main Courses", image: "https://static.vecteezy.com/system/resources/previews/067/390/426/large_2x/chicken-biryani-dish-served-on-black-plate-in-natural-light-free-photo.jpg", available: true },
  { id: "PROD-002", name: "Paneer Butter Masala", price: 180, type: "veg", description: "Creamy & rich cottage cheese curry", category: "Main Courses", image: "https://vegecravings.com/wp-content/uploads/2017/04/paneer-butter-masala-recipe-step-by-step-instructions.jpg", available: true },
  { id: "PROD-003", name: "Veg Noodles", price: 150, type: "veg", description: "Stir-fried noodles with fresh vegetables", category: "Main Courses", image: "https://myfoodstory.com/wp-content/uploads/2021/02/Vegetable-Hakka-Noodles-Restaurant-Style-3.jpg", available: true },
  { id: "PROD-004", name: "Mutton Curry", price: 250, type: "non-veg", description: "Rich & spicy slow-cooked mutton gravy", category: "Main Courses", image: "https://maunikagowardhan.co.uk/wp-content/uploads/2015/04/Kadai-Gosht1-1024x683.jpg", available: true },
  { id: "PROD-005", name: "Veg Salad", price: 120, type: "veg", description: "Fresh garden vegetables with light dressing", category: "Starters", image: "https://cdn.jwplayer.com/v2/media/wGEqBtuf/thumbnails/qSXwlEH3.jpg?width=1280", available: true },
  { id: "PROD-006", name: "Butter Naan", price: 60, type: "veg", description: "Soft tandoori bread brushed with butter", category: "Main Courses", image: "https://media.gettyimages.com/id/1298748782/photo/traditional-indian-naan-flatbread.jpg", available: true },
  { id: "PROD-007", name: "Dal Tadka", price: 160, type: "veg", description: "Tempered yellow lentils with aromatic spices", category: "Main Courses", image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/02/dal-fry.webp", available: true },
  { id: "PROD-008", name: "Chicken Tikka Masala", price: 240, type: "non-veg", description: "Grilled chicken in creamy tomato sauce", category: "Main Courses", image: "https://www.allrecipes.com/thmb/1ul-jdOz8H4b6BDrRcYOuNmJgt4=/1500x0/filters:no_upscale()/239867chef-johns-chicken-tikka-masala.jpg", available: true },
  { id: "PROD-009", name: "Palak Paneer", price: 190, type: "veg", description: "Cottage cheese in creamy spinach gravy", category: "Main Courses", image: "https://www.foodandwine.com/thmb/QqinPDSGc2krV8XDgZWwoxVgi5s=/1500x0/filters:no_upscale()/palak-paneer.jpg", available: true },
  { id: "PROD-010", name: "Gulab Jamun", price: 90, type: "veg", description: "Soft fried dumplings soaked in rose syrup", category: "Desserts", image: "https://media.istockphoto.com/id/668147754/photo/gulab-jamun.jpg", available: true },
  { id: "PROD-011", name: "Mango Lassi", price: 80, type: "veg", description: "Refreshing sweet yogurt drink with mango", category: "Beverages", image: "https://www.cookwithmanali.com/wp-content/uploads/2015/04/Mango-Lassi-Recipe.jpg", available: true },
  { id: "PROD-012", name: "Masala Chai", price: 50, type: "veg", description: "Spiced Indian tea with milk", category: "Beverages", image: "https://www.teaforturmeric.com/wp-content/uploads/2020/01/Masala-Chai-Tea-Recipe.jpg", available: true },
  { id: "PROD-013", name: "Fresh Lime Soda", price: 60, type: "veg", description: "Zesty lime soda – sweet or salted", category: "Beverages", image: "https://www.vegrecipesofindia.com/wp-content/uploads/2014/06/lime-soda-recipe-1.jpg", available: true },
  { id: "PROD-014", name: "Vegetable Samosa", price: 80, type: "veg", description: "Crispy pastry filled with spiced potatoes and peas", category: "Starters", image: "https://www.vegrecipesofindia.com/wp-content/uploads/2019/11/samosa-recipe-4.jpg", available: true },
  { id: "PROD-015", name: "Chicken 65", price: 180, type: "non-veg", description: "Spicy deep-fried chicken appetizer", category: "Starters", image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/03/chicken-65-recipe.jpg", available: true },
  { id: "PROD-016", name: "Onion Bhaji", price: 100, type: "veg", description: "Crispy fried onion fritters with spices", category: "Starters", image: "https://www.kitchensanctuary.com/wp-content/uploads/2021/03/Onion-Bhaji-square.jpg", available: true },
  { id: "PROD-017", name: "Butter Chicken", price: 260, type: "non-veg", description: "Tender chicken in rich buttery tomato sauce", category: "Main Courses", image: "https://www.recipetineats.com/wp-content/uploads/2019/01/Butter-Chicken_5.jpg", available: true },
  { id: "PROD-018", name: "Lamb Rogan Josh", price: 280, type: "non-veg", description: "Aromatic Kashmiri lamb curry with yogurt and spices", category: "Main Courses", image: "https://www.kitchensanctuary.com/wp-content/uploads/2020/07/Rogan-Josh-square.jpg", available: true },
  { id: "PROD-019", name: "Aloo Gobi", price: 140, type: "veg", description: "Spiced potato and cauliflower stir-fry", category: "Main Courses", image: "https://www.teaforturmeric.com/wp-content/uploads/2020/02/Aloo-Gobi-Recipe.jpg", available: true },
  { id: "PROD-020", name: "Rasmalai", price: 120, type: "veg", description: "Soft cheese patties in creamy milk syrup with pistachios", category: "Desserts", image: "https://www.cookwithmanali.com/wp-content/uploads/2019/07/Rasmalai-Recipe.jpg", available: true },
  { id: "PROD-021", name: "Jalebi", price: 80, type: "veg", description: "Crispy pretzel-shaped sweets soaked in sugar syrup", category: "Desserts", image: "https://www.vegrecipesofindia.com/wp-content/uploads/2020/10/jalebi-recipe.jpg", available: true },
  { id: "PROD-022", name: "Falooda", price: 130, type: "veg", description: "Chilled rose-flavored milk drink with vermicelli and basil seeds", category: "Beverages", image: "https://www.cookwithmanali.com/wp-content/uploads/2014/05/Falooda-Recipe.jpg", available: true },
  { id: "PROD-023", name: "Thandai", price: 100, type: "veg", description: "Cooling spiced milk drink with nuts and saffron", category: "Beverages", image: "https://www.vegrecipesofindia.com/wp-content/uploads/2021/02/thandai-recipe.jpg", available: true },
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