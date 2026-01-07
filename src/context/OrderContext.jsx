import { createContext, useContext, useState, useEffect } from "react";

const OrderContext = createContext();

const STORAGE_KEY = "orders";

const getOrdersFromStorage = () => {
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error("Error reading orders from localStorage", error);
    return [];
  }
};

const setOrdersToStorage = (orders) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));

    // Dispatch a proper StorageEvent for cross-tab sync
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: STORAGE_KEY,
        newValue: JSON.stringify(orders),
        oldValue: localStorage.getItem(STORAGE_KEY), // will be updated after setItem
        storageArea: localStorage,
      })
    );
  } catch (error) {
    console.error("Error saving orders to localStorage", error);
  }
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(getOrdersFromStorage());

  // Sync state when localStorage changes (e.g., from another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) {
        setOrders(getOrdersFromStorage());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const addOrder = (newOrder) => {
    const orderWithStatus = { ...newOrder, status: "Pending" };
    const updatedOrders = [...orders, orderWithStatus];
    setOrders(updatedOrders);
    setOrdersToStorage(updatedOrders);
  };

  const updateOrderStatus = (id, status) => {
    const updatedOrders = orders.map((o) =>
      o.id === id ? { ...o, status } : o
    );
    setOrders(updatedOrders);
    setOrdersToStorage(updatedOrders);
  };

  const clearOrders = () => {
    setOrders([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <OrderContext.Provider
      value={{ orders, addOrder, updateOrderStatus, clearOrders }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};