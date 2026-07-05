import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import products from "../data/products";
import shops from "../data/shops";

const CartContext = createContext();

const initialState = {
  cart: [],
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const item = action.payload;
      const itemKey = item.cartKey || item.id;
      const exist = state.cart.find((i) => (i.cartKey || i.id) === itemKey);

      if (exist) {
        return {
          ...state,
          cart: state.cart.map((i) =>
            (i.cartKey || i.id) === itemKey ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }

      return {
        ...state,
        cart: [...state.cart, { ...item, cartKey: itemKey, quantity: 1 }],
      };
    }

    case "INC":
      return {
        ...state,
        cart: state.cart.map((i) =>
          (i.cartKey || i.id) === action.payload ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };

    case "DEC":
      return {
        ...state,
        cart: state.cart
          .map((i) =>
            (i.cartKey || i.id) === action.payload ? { ...i, quantity: i.quantity - 1 } : i
          )
          .filter((i) => i.quantity > 0),
      };

    case "REMOVE":
      return {
        ...state,
        cart: state.cart.filter((i) => (i.cartKey || i.id) !== action.payload),
      };

    case "CLEAR":
      return {
        ...state,
        cart: [],
      };

    case "LOAD":
      return {
        ...state,
        cart: Array.isArray(action.payload) ? action.payload : [],
      };

    default:
      return state;
  }
}

const readStorageList = (key) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch {
    localStorage.removeItem(key);
    return [];
  }
};

const readStorageObject = (key) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const [orders, setOrders] = useState(() => readStorageList("novastore_orders"));
  const [wishlist, setWishlist] = useState(() => readStorageList("novastore_wishlist"));
  const [users, setUsers] = useState(() => {
    const savedUsers = readStorageList("novastore_users");
    if (savedUsers.length === 0) {
      return [
        {
          id: 1,
          name: "Admin",
          email: "admin@novastore.com",
          password: "admin123",
          role: "admin",
          origin: "admin",
          createdAt: new Date().toISOString(),
        }
      ];
    }
    return savedUsers;
  });
  const [reviews, setReviews] = useState(() => readStorageList("novastore_reviews"));
  const [user, setUser] = useState(() => readStorageObject("novastore_current_user"));
  const [productsList, setProductsList] = useState(() => {
    const saved = localStorage.getItem("novastore_products");
    return saved ? JSON.parse(saved) : products;
  });

  const [guestId] = useState(() => {
    const existing = localStorage.getItem("novastore_guest_id");
    if (existing) return existing;
    const id = `guest-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    localStorage.setItem("novastore_guest_id", id);
    return id;
  });

  const [chatThreads, setChatThreads] = useState(() => {
    const saved = readStorageList("novastore_chat_threads");
    return saved.length ? saved : [];
  });

  const currentChatThreadId = user?.role !== "admin" ? `user-${user?.id || guestId}` : null;
  const currentChatThread = currentChatThreadId
    ? chatThreads.find((thread) => thread.id === currentChatThreadId)
    : null;

  const chatUnreadCount = useMemo(
    () => chatThreads.reduce((total, thread) => total + (thread.unreadCount || 0), 0),
    [chatThreads]
  );

  useEffect(() => {
    const cartData = readStorageList("novastore_cart");
    dispatch({ type: "LOAD", payload: cartData });
  }, []);

  useEffect(() => {
    localStorage.setItem("novastore_cart", JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    localStorage.setItem("novastore_chat_threads", JSON.stringify(chatThreads));
  }, [chatThreads]);

  const getCurrentThreadId = () => {
    if (user?.role === "admin") return null;
    return user?.id ? `user-${user.id}` : guestId;
  };

  const sendCustomerChatMessage = (text) => {
    const threadId = getCurrentThreadId();
    if (!threadId) return;
    const userMessage = {
      id: Date.now(),
      sender: "user",
      text,
      time: new Date().toISOString(),
      userName: user?.name || "Khách",
      userEmail: user?.email || "guest",
      userId: user?.id || null,
    };

    const botReply = {
      id: Date.now() + 1,
      sender: "bot",
      text: "Tin nhắn đã được gửi đến admin. Vui lòng đợi phản hồi.",
      time: new Date().toISOString(),
    };

    setChatThreads((current) => {
      const index = current.findIndex((thread) => thread.id === threadId);
      if (index === -1) {
        return [
          ...current,
          {
            id: threadId,
            userId: user?.id || null,
            userEmail: user?.email || "guest",
            userName: user?.name || "Khách",
            messages: [userMessage, botReply],
            unreadCount: 1,
          },
        ];
      }

      return current.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              messages: [...thread.messages, userMessage, botReply],
              unreadCount: (thread.unreadCount || 0) + 1,
            }
          : thread
      );
    });
  };

  const clearChatUnread = (threadId) => {
    if (!threadId) return;
    setChatThreads((current) => {
      let modified = false;
      const next = current.map((thread) => {
        if (thread.id === threadId && thread.unreadCount > 0) {
          modified = true;
          return { ...thread, unreadCount: 0 };
        }
        return thread;
      });
      return modified ? next : current;
    });
  };

  const sendAdminChatMessage = (text, threadId) => {
    if (!threadId) return;
    const adminMessage = {
      id: Date.now(),
      sender: "admin",
      text,
      time: new Date().toISOString(),
    };

    setChatThreads((current) =>
      current.map((thread) =>
        thread.id === threadId
          ? { ...thread, messages: [...thread.messages, adminMessage] }
          : thread
      )
    );
  };

  useEffect(() => {
    localStorage.setItem("novastore_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("novastore_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("novastore_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("novastore_current_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("novastore_current_user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("novastore_products", JSON.stringify(productsList));
  }, [productsList]);

  useEffect(() => {
    localStorage.setItem("novastore_reviews", JSON.stringify(reviews));
  }, [reviews]);

  const totalQuantity = useMemo(() => {
    return state.cart.reduce((total, item) => total + item.quantity, 0);
  }, [state.cart]);

  const totalPrice = useMemo(() => {
    return state.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [state.cart]);

  const shippingFee = useMemo(() => {
    return state.cart.length > 0 ? 20000 : 0;
  }, [state.cart]);

  const grandTotal = useMemo(() => {
    return totalPrice + shippingFee;
  }, [totalPrice, shippingFee]);

  const wishlistCount = useMemo(() => wishlist.length, [wishlist]);

  const addToCart = (item) => {
    const cartKey = [item.id, item.selectedSize, item.selectedColor]
      .filter(Boolean)
      .join("-");
    dispatch({ type: "ADD", payload: { ...item, cartKey } });
  };
  const increase = (id) => dispatch({ type: "INC", payload: id });
  const decrease = (id) => dispatch({ type: "DEC", payload: id });
  const removeItem = (id) => dispatch({ type: "REMOVE", payload: id });
  const clearCart = () => dispatch({ type: "CLEAR" });

  const toggleWishlist = (product) => {
    setWishlist((current) => {
      const exists = current.some((item) => item.id === product.id);
      return exists
        ? current.filter((item) => item.id !== product.id)
        : [...current, product];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist((current) => current.filter((item) => item.id !== id));
  };

  const isWishlisted = (id) => {
    return wishlist.some((item) => item.id === id);
  };

  const register = ({ name, email, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    const exists = users.some((item) => item.email === cleanEmail);

    if (exists) {
      return { ok: false, message: "Email này đã được đăng ký." };
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: cleanEmail,
      password,
      role: "user",
      origin: "website",
      createdAt: new Date().toISOString(),
    };

    setUsers((current) => [...current, newUser]);
    if (!user || user.role !== "admin") {
      setUser({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role });
    }

    return { ok: true, message: "Đăng ký thành công." };
  };

  const login = ({ email, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find(
      (item) => item.email === cleanEmail && item.password === password
    );

    if (!found) {
      return { ok: false, message: "Email hoặc mật khẩu chưa đúng." };
    }

    setUser({ 
      id: found.id, 
      name: found.name, 
      email: found.email, 
      role: found.role || "user" 
    });
    return { ok: true, message: "Đăng nhập thành công." };
  };

  const createUser = ({ name, email, password, role }) => {
    const cleanEmail = email.trim().toLowerCase();
    const exists = users.some((item) => item.email === cleanEmail);
    if (exists) {
      return { ok: false, message: "Email này đã tồn tại." };
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: cleanEmail,
      password: password || "123456",
      role: role || "user",
      origin: role === "admin" ? "admin" : "website",
      createdAt: new Date().toISOString(),
    };

    setUsers((current) => [...current, newUser]);
    return { ok: true, message: "Đã tạo người dùng mới." };
  };

  const updateProfile = (profile) => {
    if (!user) return { ok: false, message: "Bạn cần đăng nhập để cập nhật hồ sơ." };

    const updatedUser = { ...user, ...profile };
    setUser(updatedUser);
    setUsers((current) =>
      current.map((item) =>
        item.id === user.id ? { ...item, ...profile } : item
      )
    );

    return { ok: true, message: "Đã cập nhật hồ sơ." };
  };

  const logout = () => {
    setUser(null);
  };

  // Product CRUD operations
  const addProduct = (productData) => {
    const shopMap = Object.fromEntries(shops.map((shop) => [shop.id, shop]));
    const newProduct = {
      id: Date.now(),
      ...productData,
      shop: productData.shopId ? shopMap[productData.shopId] : undefined,
    };
    setProductsList((current) => [...current, newProduct]);
  };

  const updateProduct = (id, productData) => {
    const shopMap = Object.fromEntries(shops.map((shop) => [shop.id, shop]));
    setProductsList((current) =>
      current.map((p) =>
        p.id === id
          ? {
              ...p,
              ...productData,
              shop: productData.shopId ? shopMap[productData.shopId] : p.shop,
            }
          : p
      )
    );
  };

  const deleteProduct = (id) => {
    setProductsList((current) => current.filter((p) => p.id !== id));
  };

  // Order operations
  const updateOrderStatus = (orderId, status) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  // User operations
  const updateUserRole = (userId, role) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === userId ? { ...user, role } : user
      )
    );
    if (user?.id === userId) {
      setUser((current) => ({ ...current, role }));
    }
  };

  const deleteUser = (userId) => {
    setUsers((current) => current.filter((user) => user.id !== userId));
  };

  // Review functions
  const addReview = (reviewData) => {
    const newReview = {
      id: Date.now(),
      ...reviewData,
      createdAt: new Date().toISOString(),
    };
    setReviews((current) => [...current, newReview]);
  };

  const getProductReviews = (productId) => {
    return reviews.filter((r) => r.productId === productId);
  };

  const getProductRating = (productId) => {
    const productReviews = reviews.filter((r) => r.productId === productId);
    if (productReviews.length === 0) return 0;
    const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
    return (totalRating / productReviews.length).toFixed(1);
  };

  return (
    <CartContext.Provider
      value={{
        cart: state.cart,
        addToCart,
        increase,
        decrease,
        removeItem,
        clearCart,
        totalQuantity,
        totalPrice,
        shippingFee,
        grandTotal,
        orders,
        chatThreads,
        currentChatThread,
        currentChatThreadId,
        chatUnreadCount,
        sendCustomerChatMessage,
        sendAdminChatMessage,
        clearChatUnread,
        setOrders,
        wishlist,
        wishlistCount,
        toggleWishlist,
        removeFromWishlist,
        isWishlisted,
        user,
        updateProfile,
        login,
        register,
        logout,
        products: productsList,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        updateUserRole,
        deleteUser,
        createUser,
        reviews,
        addReview,
        getProductReviews,
        getProductRating,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
