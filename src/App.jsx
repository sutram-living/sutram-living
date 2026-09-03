import PrivacyPolicy from "./PrivacyPolicy";
import { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { db } from "./firebase";
import {
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

/* =========================================================
   ADMIN
========================================================= */

const ADMIN_GOOGLE_EMAIL = "siricandles1128@gmail.com";

/* =========================================================
   DEFAULT PRODUCTS
========================================================= */

const DEFAULT_PRODUCTS = [
  {
    id: "candles",
    icon: "🕯️",
    title: "Candles",
    kannada: "ಕ್ಯಾಂಡಲ್ಸ್",
    products: [
      {
        id: 1,
        name: "Candle",
        unit: "1 Piece",
        price: 60,
        description: "Beautiful handmade candle.",
        quantity: 10,
        photo: "",
      },
      {
        id: 2,
        name: "Candle",
        unit: "1 Piece",
        price: 99,
        description: "Beautiful handmade candle.",
        quantity: 10,
        photo: "",
      },
      {
        id: 3,
        name: "Candle",
        unit: "1 Piece",
        price: 149,
        description: "Beautiful handmade candle.",
        quantity: 10,
        photo: "",
      },
      {
        id: 4,
        name: "Candle",
        unit: "1 Piece",
        price: 199,
        description: "Beautiful handmade candle.",
        quantity: 10,
        photo: "",
      },
      {
        id: 5,
        name: "Candle",
        unit: "1 Piece",
        price: 299,
        description: "Beautiful handmade candle.",
        quantity: 10,
        photo: "",
      },
      {
        id: 6,
        name: "Candle",
        unit: "1 Piece",
        price: 399,
        description: "Beautiful handmade candle.",
        quantity: 10,
        photo: "",
      },
      {
        id: 7,
        name: "Candle",
        unit: "1 Piece",
        price: 499,
        description: "Beautiful handmade candle.",
        quantity: 10,
        photo: "",
      },
      {
        id: 8,
        name: "Candle",
        unit: "1 Piece",
        price: 699,
        description: "Beautiful handmade candle.",
        quantity: 10,
        photo: "",
      },
      {
        id: 9,
        name: "Candle",
        unit: "1 Piece",
        price: 999,
        description: "Beautiful handmade candle.",
        quantity: 10,
        photo: "",
      },
    ],
  },

  {
    id: "honey",
    icon: "🍯",
    title: "Honey",
    kannada: "ಶುದ್ಧವಾದ ಜೇನು",
    products: [
      {
        id: 10,
        name: "Pure Honey",
        unit: "250 ml",
        price: 200,
        description: "Pure natural honey.",
        quantity: 10,
        photo: "",
      },
      {
        id: 11,
        name: "Pure Honey",
        unit: "500 ml",
        price: 400,
        description: "Pure natural honey.",
        quantity: 10,
        photo: "",
      },
      {
        id: 12,
        name: "Pure Honey",
        unit: "1 Litre",
        price: 800,
        description: "Pure natural honey.",
        quantity: 10,
        photo: "",
      },
    ],
  },

  {
    id: "chocolate",
    icon: "🍫",
    title: "Homemade Chocolate",
    kannada: "ಚಾಕೊಲೇಟ್",
    products: [
      {
        id: 13,
        name: "Milk Chocolate",
        unit: "1 Piece",
        price: 20,
        description: "Delicious homemade milk chocolate.",
        quantity: 10,
        photo: "",
      },
      {
        id: 14,
        name: "Dark Chocolate",
        unit: "1 Piece",
        price: 20,
        description: "Delicious homemade dark chocolate.",
        quantity: 10,
        photo: "",
      },
      {
        id: 15,
        name: "Nuts Chocolate",
        unit: "1 Piece",
        price: 20,
        description: "Homemade nuts chocolate.",
        quantity: 10,
        photo: "",
      },
    ],
  },

  {
    id: "coffee",
    icon: "☕",
    title: "Coffee",
    kannada: "ಕಾಫಿ ಪೌಡರ್",
    products: [
      {
        id: 16,
        name: "Filter Coffee Powder",
        unit: "250 g",
        price: 200,
        description: "Fresh homemade filter coffee powder.",
        quantity: 10,
        photo: "",
      },
      {
        id: 17,
        name: "Filter Coffee Powder",
        unit: "500 g",
        price: 500,
        description: "Fresh homemade filter coffee powder.",
        quantity: 10,
        photo: "",
      },
      {
        id: 18,
        name: "Filter Coffee Powder",
        unit: "1 kg",
        price: 800,
        description: "Fresh homemade filter coffee powder.",
        quantity: 10,
        photo: "",
      },
    ],
  },
];

/* =========================================================
   NORMALIZE PRODUCTS
========================================================= */

const normalizeProducts = (data) => {
  if (!Array.isArray(data)) {
    return DEFAULT_PRODUCTS;
  }

  return data.map((category) => ({
    ...category,
    products: Array.isArray(category.products)
      ? category.products.map((product) => ({
          ...product,
          unit: product.unit || "1 Piece",
          price: Number(product.price) || 0,
          quantity: Number(product.quantity) || 0,
          photo: product.photo || "",
          description: product.description || "",
        }))
      : [],
  }));
};

/* =========================================================
   APP
========================================================= */
function App() {


  /* =========================================================
     LOGIN
  ========================================================= */

  const [adminLoggedIn, setAdminLoggedIn] = useState(
    () =>
      localStorage.getItem("sutram_admin_logged_in") === "true"
  );
const [page, setPage] = useState(() => {
  if (
    localStorage.getItem("sutram_admin_logged_in") === "true"
  ) {
    return "admin";
  }

  if (
    localStorage.getItem("sutram_buyer_logged_in") === "true"
  ) {
    return "shop";
  }

  return "shop";
});


  const [adminSection, setAdminSection] =
    useState("dashboard");

  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");

  /* =========================================================
     PRODUCTS
  ========================================================= */

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("sutram_products");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed) && parsed.length > 0) {
          return normalizeProducts(parsed);
        }
      }
    } catch (error) {
      console.log("Product local storage reset");
    }

    return DEFAULT_PRODUCTS;
  });

  const [selectedCategory, setSelectedCategory] =
    useState(null);

  const [expandedProducts, setExpandedProducts] =
    useState({});

  /* =========================================================
     ORDERS
  ========================================================= */

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem("sutram_orders");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [newOrderCount, setNewOrderCount] = useState(0);
useEffect(() => {
  const count = orders.filter(
    (order) => order.status === "New Order"
  ).length;

  setNewOrderCount(count);
}, [orders]);

const getNextOrderId = () => {
  const numbers = orders
    .map((order) => parseInt(order.id, 10))
    .filter((num) => !isNaN(num));

  return String(
    numbers.length > 0
      ? Math.max(...numbers) + 1
      : 1
  );
};
  /* =========================================================
     CART
  ========================================================= */

  const [cart, setCart] = useState([]);

  /* =========================================================
     NEW PRODUCT
  ========================================================= */

  const [newProduct, setNewProduct] = useState({
    name: "",
    unit: "",
    price: "",
    description: "",
    quantity: 10,
    photo: "",
  });

  /* =========================================================
     CUSTOMER
  ========================================================= */

  const [customer, setCustomer] = useState({
    name: "",
    mobile: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [paymentPage, setPaymentPage] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");

  /* =========================================================
     BUYER ORDER SEARCH
  ========================================================= */

  const [orderSearch, setOrderSearch] = useState("");

  /* =========================================================
     BUYER ORDER TRACKING
  ========================================================= */

  const [trackingOrderId, setTrackingOrderId] = useState(
    () => localStorage.getItem("sutram_last_order_id") || ""
  );

  /* =========================================================
     FIREBASE PRODUCTS LISTENER
  ========================================================= */

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "siteContent", "products"),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data()?.data;

          if (Array.isArray(data)) {
            setProducts(normalizeProducts(data));
          }
        }
      },
      (error) => {
        console.error("Products Firebase sync error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  /* =========================================================
     FIREBASE ORDERS LISTENER
  ========================================================= */

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "siteContent", "orders"),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data()?.data;

          if (Array.isArray(data)) {
            setOrders(data);
          }
        }
      },
      (error) => {
        console.error("Orders Firebase sync error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  /* =========================================================
     LOCAL STORAGE
  ========================================================= */

  useEffect(() => {
    localStorage.setItem(
      "sutram_products",
      JSON.stringify(products)
    );
  }, [products]);

  useEffect(() => {
    localStorage.setItem(
      "sutram_orders",
      JSON.stringify(orders)
    );
  }, [orders]);

  /* =========================================================
     SAVE PRODUCTS TO FIREBASE
  ========================================================= */

  const saveProductsToFirebase = async (updatedProducts) => {
    try {
      await setDoc(
        doc(db, "siteContent", "products"),
        {
          data: updatedProducts,
        }
      );

      console.log("Products saved to Firebase");
      return true;
    } catch (error) {
      console.error("Product Firebase save error:", error);
      alert("Product Firebase save failed");
      return false;
    }
  };

  /* =========================================================
     SAVE ORDERS TO FIREBASE
  ========================================================= */

  const saveOrdersToFirebase = async (updatedOrders) => {
    try {
      await setDoc(
        doc(db, "siteContent", "orders"),
        {
          data: updatedOrders,
        }
      );

      console.log("Orders saved to Firebase");
      return true;
    } catch (error) {
      console.error("Order Firebase save error:", error);

      alert(
        "Order Firebase save failed: " +
          (error?.message || "Unknown error")
      );

      return false;
    }
  };

  /* =========================================================
     TOGGLE PRODUCT DETAILS
  ========================================================= */

  const toggleProductDetails = (productId) => {
    setExpandedProducts((old) => ({
      ...old,
      [productId]: !old[productId],
    }));
  };

  /* =========================================================
     ADMIN LOGIN
  ========================================================= */

  const adminLogin = (e) => {
    e.preventDefault();

    if (
      adminUser.trim() === "admin" &&
      adminPass === "admin123"
    ) {
      localStorage.setItem(
        "sutram_admin_logged_in",
        "true"
      );

      setAdminLoggedIn(true);
      setAdminSection("dashboard");
      setPage("admin");

      setAdminUser("");
      setAdminPass("");

      alert("Admin Login Successful");
    } else {
      alert("Wrong username or password");
    }
  };

  /* =========================================================
     GOOGLE ADMIN LOGIN
  ========================================================= */
const googleAdminLogin = (credentialResponse) => {
  try {
    if (!credentialResponse?.credential) {
      alert("Google Login Failed");
      return;
    }

    const token = credentialResponse.credential;

    const payload = JSON.parse(
      atob(
        token
          .split(".")[1]
          .replace(/-/g, "+")
          .replace(/_/g, "/")
      )
    );

    const email = payload.email?.toLowerCase();

    if (email === ADMIN_GOOGLE_EMAIL.toLowerCase()) {
      // ADMIN GMAIL
      localStorage.setItem(
        "sutram_admin_logged_in",
        "true"
      );

      localStorage.removeItem("sutram_buyer_logged_in");

      setAdminLoggedIn(true);
      setAdminSection("dashboard");
      setPage("admin");

      alert("Google Admin Login Successful");
    } else {
  // OTHER GMAIL = BUYER
  localStorage.removeItem("sutram_admin_logged_in");

  localStorage.setItem(
    "sutram_buyer_logged_in",
    "true"
  );

  setAdminLoggedIn(false);
  setPage("shop");

  alert("Welcome to Sutram Living!");
}

  } catch (error) {
    console.error("Google Login Error:", error);
    alert("Google Login Failed");
  }
};

  /* =========================================================
     LOGOUT
  ========================================================= */

  const logoutAdmin = () => {
    localStorage.removeItem(
      "sutram_admin_logged_in"
    );

    setAdminLoggedIn(false);
    setAdminUser("");
    setAdminPass("");
    setAdminSection("dashboard");
    setSelectedCategory(null);

    setPage("admin-login");
  };

  /* =========================================================
     UPDATE PRODUCT
  ========================================================= */

  const updateProduct = async (
    categoryId,
    productId,
    changes
  ) => {
    const updatedProducts = products.map((category) => {
      if (category.id !== categoryId) {
        return category;
      }

      return {
        ...category,
        products: category.products.map((product) =>
          product.id === productId
            ? {
                ...product,
                ...changes,
              }
            : product
        ),
      };
    });

    setProducts(updatedProducts);

    await saveProductsToFirebase(updatedProducts);
  };

  /* =========================================================
     DELETE PRODUCT
  ========================================================= */

  const deleteProduct = async (
    categoryId,
    productId
  ) => {
    const confirmDelete = window.confirm(
      "Delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    const updatedProducts = products.map((category) => {
      if (category.id !== categoryId) {
        return category;
      }

      return {
        ...category,
        products: category.products.filter(
          (product) => product.id !== productId
        ),
      };
    });

    setProducts(updatedProducts);

    await saveProductsToFirebase(updatedProducts);

    alert("Product deleted successfully");
  };

  /* =========================================================
     PRODUCT PHOTO
  ========================================================= */

  const handlePhoto = (
    categoryId,
    productId,
    file
  ) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      updateProduct(
        categoryId,
        productId,
        {
          photo: reader.result,
        }
      );
    };

    reader.readAsDataURL(file);
  };

  /* =========================================================
     NEW PRODUCT PHOTO
  ========================================================= */

  const handleNewProductPhoto = (file) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setNewProduct((old) => ({
        ...old,
        photo: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  /* =========================================================
     ADD PRODUCT
  ========================================================= */

  const addProduct = async (categoryId) => {
    if (!newProduct.name.trim()) {
      alert("Enter product name");
      return;
    }

    if (!newProduct.unit.trim()) {
      alert("Enter weight / size");
      return;
    }

    if (
      newProduct.price === "" ||
      Number(newProduct.price) < 0
    ) {
      alert("Enter valid rate");
      return;
    }

    const product = {
      id: Date.now(),
      name: newProduct.name.trim(),
      unit: newProduct.unit.trim(),
      price: Number(newProduct.price),
      description:
        newProduct.description.trim(),
      quantity: Number(newProduct.quantity) || 0,
      photo: newProduct.photo || "",
    };

    const updatedProducts = products.map((category) =>
      category.id === categoryId
        ? {
            ...category,
            products: [
              ...category.products,
              product,
            ],
          }
        : category
    );

    setProducts(updatedProducts);

    await saveProductsToFirebase(updatedProducts);

    setNewProduct({
      name: "",
      unit: "",
      price: "",
      description: "",
      quantity: 10,
      photo: "",
    });

    alert("Product added successfully");
  };

  /* =========================================================
     ADD TO CART
  ========================================================= */

  const addToCart = (
    product,
    category
  ) => {
    if (product.quantity <= 0) {
      alert("Out of Stock");
      return false;
    }

    const existingCartItem = cart.find(
      (item) =>
        item.categoryId === category.id &&
        item.productId === product.id
    );

    if (
      existingCartItem &&
      existingCartItem.quantity >=
        product.quantity
    ) {
      alert(
        "Maximum available stock added"
      );

      return false;
    }

    const cartId =
      category.id +
      "-" +
      product.id;

    setCart((oldCart) => {
      const found = oldCart.find(
        (item) => item.id === cartId
      );

      if (found) {
        return oldCart.map((item) =>
          item.id === cartId
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...oldCart,
        {
          id: cartId,
          categoryId: category.id,
          productId: product.id,
          name: product.name,
          unit: product.unit,
          price: product.price,
          description: product.description,
          icon: category.icon,
          photo: product.photo,
          quantity: 1,
        },
      ];
    });

    alert("Added to Cart");

    return true;
  };

  /* =========================================================
     INCREASE
  ========================================================= */

  const increase = (id) => {
    const item = cart.find(
      (cartItem) =>
        cartItem.id === id
    );

    if (!item) return;

    const category = products.find(
      (cat) =>
        cat.id === item.categoryId
    );

    const product =
      category?.products.find(
        (p) =>
          p.id === item.productId
      );

    if (
      product &&
      item.quantity >=
        product.quantity
    ) {
      alert("No more stock available");
      return;
    }

    setCart((oldCart) =>
      oldCart.map((cartItem) =>
        cartItem.id === id
          ? {
              ...cartItem,
              quantity:
                cartItem.quantity + 1,
            }
          : cartItem
      )
    );
  };

  /* =========================================================
     DECREASE
  ========================================================= */

  const decrease = (id) => {
    setCart((oldCart) =>
      oldCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  /* =========================================================
     CART COUNT / TOTAL
  ========================================================= */

  const cartCount = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      item.price *
        item.quantity,
    0
  );

  /* =========================================================
     REDUCE STOCK
  ========================================================= */

  const reduceStock = async (cartItems) => {
    const updatedProducts =
      products.map((category) => ({
        ...category,

        products:
          category.products.map(
            (product) => {
              const cartItem =
                cartItems.find(
                  (item) =>
                    item.categoryId ===
                      category.id &&
                    item.productId ===
                      product.id
                );

              if (!cartItem) {
                return product;
              }

              return {
                ...product,
                quantity:
                  Math.max(
                    0,
                    Number(product.quantity) -
                      Number(cartItem.quantity)
                  ),
              };
            }
          ),
      }));

    setProducts(updatedProducts);

    await saveProductsToFirebase(
      updatedProducts
    );
  };

  /* =========================================================
     PLACE ORDER
  ========================================================= */

  const placeOrder = (e) => {
    e.preventDefault();

    if (!customer.name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!/^[0-9]{10}$/.test(
      customer.mobile.trim()
    )) {
      alert(
        "Please enter a valid 10-digit mobile number"
      );
      return;
    }

    if (!customer.address.trim()) {
      alert("Please enter your address");
      return;
    }

    if (!customer.city.trim()) {
      alert("Please enter your city");
      return;
    }

    if (!/^[0-9]{6}$/.test(
      customer.pincode.trim()
    )) {
      alert(
        "Please enter a valid 6-digit pincode"
      );
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    for (const item of cart) {
      const category =
        products.find(
          (cat) =>
            cat.id ===
            item.categoryId
        );

      const product =
        category?.products.find(
          (p) =>
            p.id ===
            item.productId
        );

      if (!product) {
        alert(
          `${item.name} is no longer available`
        );
        return;
      }

      if (
        Number(product.quantity) <
        Number(item.quantity)
      ) {
        alert(
          `${item.name} has only ${product.quantity} item(s) available`
        );
        return;
      }
    }

    setSelectedPayment("");
    setPaymentPage(true);
  };

  /* =========================================================
     CREATE COD ORDER
  ========================================================= */

  const createCODOrder = async () => {
    const orderProducts = cart.map(
      (item) => ({
        productId: item.productId,
        name: item.name,
        unit: item.unit,
        price: item.price,
        quantity: item.quantity,
        total:
          item.price *
          item.quantity,
      })
    );

    const newOrder = {
      id: getNextOrderId(),
      date:
        new Date().toLocaleString(),
      customer: {
        ...customer,
      },
      products: orderProducts,
      total: cartTotal,
      paymentMethod:
        "Cash on Delivery",
      paymentStatus:
        "Pending",
      status:
        "New Order",
    };

    const updatedOrders = [
      newOrder,
      ...orders,
    ];

    setOrders(updatedOrders);

    await saveOrdersToFirebase(
      updatedOrders
    );

    await reduceStock(cart);

    setCart([]);

    setCustomer({
      name: "",
      mobile: "",
      address: "",
      city: "",
      pincode: "",
    });

    setSelectedPayment("");
    setPaymentPage(false);

    localStorage.setItem(
      "sutram_last_order_id",
      newOrder.id
    );

    setTrackingOrderId(
      newOrder.id
    );

    alert(
      "🎉 Order placed successfully!\n\nPayment: Cash on Delivery"
    );

    setPage("track-order");
  };

  /* =========================================================
     ONLINE PAYMENT
  ========================================================= */

  const startOnlinePayment = async () => {
    try {
      const response = await fetch(
        "/api/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            amount:
              Number(cartTotal),
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        console.error(
          "Create Order Error:",
          data
        );

        alert(
          data.message ||
            "Unable to create payment order"
        );

        return;
      }

      const options = {
        key: data.key_id,

        amount:
          data.order.amount,

        currency: "INR",

        name: "SUTRAM LIVING",

        description:
          "Sutram Living Order",

        order_id:
          data.order.id,

        prefill: {
          name:
            customer.name,

          contact:
            customer.mobile,
        },

        notes: {
          address:
            customer.address,

          city:
            customer.city,

          pincode:
            customer.pincode,
        },

        theme: {
          color: "#111827",
        },

        handler:
          async function (
            paymentResponse
          ) {
            try {
              /* VERIFY PAYMENT */

              const verifyResponse =
                await fetch(
                  "/api/verify-payment",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type":
                        "application/json",
                    },
                    body:
                      JSON.stringify(
                        paymentResponse
                      ),
                  }
                );

              const verifyData =
                await verifyResponse.json();

              if (
                !verifyResponse.ok ||
                !verifyData.success
              ) {
                alert(
                  "Payment verification failed"
                );

                return;
              }

              /* CREATE ORDER */

              const orderProducts =
                cart.map(
                  (item) => ({
                    productId:
                      item.productId,

                    name:
                      item.name,

                    unit:
                      item.unit,

                    price:
                      item.price,

                    quantity:
                      item.quantity,

                    total:
                      item.price *
                      item.quantity,
                  })
                );

              const newOrder = {
                id: getNextOrderId(),

                date:
                  new Date().toLocaleString(),

                customer: {
                  ...customer,
                },

                products:
                  orderProducts,

                total:
                  cartTotal,

                paymentMethod:
                  "UPI / Online Payment",

                paymentStatus:
                  "Paid",

                paymentId:
                  paymentResponse
                    .razorpay_payment_id,

                razorpayOrderId:
                  paymentResponse
                    .razorpay_order_id,

                status:
                  "New Order",
              };

              const updatedOrders =
                [
                  newOrder,
                  ...orders,
                ];

              setOrders(
                updatedOrders
              );

              await saveOrdersToFirebase(
                updatedOrders
              );

              /* REDUCE STOCK */

              await reduceStock(
                cart
              );

              /* CLEAR CART */

              setCart([]);

              setCustomer({
                name: "",
                mobile: "",
                address: "",
                city: "",
                pincode: "",
              });

              setSelectedPayment(
                ""
              );

              setPaymentPage(
                false
              );

              localStorage.setItem(
                "sutram_last_order_id",
                newOrder.id
              );

              setTrackingOrderId(
                newOrder.id
              );

              alert(
                "🎉 Payment successful!\n\nOrder placed successfully.\n\nPayment ID: " +
                  paymentResponse.razorpay_payment_id
              );

              setPage("track-order");
            } catch (error) {
              console.error(
                "Payment Success Handler Error:",
                error
              );

              alert(
                "Payment was successful, but order processing failed. Please contact Sutram Living."
              );
            }
          },
      };

      /* IMPORTANT:
         Razorpay object MUST be outside options */

      const razorpay =
        new window.Razorpay(
          options
        );

      razorpay.open();
    } catch (error) {
      console.error(
        "Payment Error:",
        error
      );

      alert(
        "Unable to start payment"
      );
    }
  };

  /* =========================================================
     UPDATE ORDER STATUS
  ========================================================= */

  const updateOrderStatus =
    async (
      orderId,
      newStatus
    ) => {
      const updatedOrders =
        orders.map(
          (order) =>
            order.id === orderId
              ? {
                  ...order,
                  status:
                    newStatus,
                  statusDate:
                    new Date().toLocaleString(),
                }
              : order
        );

      setOrders(
        updatedOrders
      );

      await saveOrdersToFirebase(
        updatedOrders
      );

      alert(
        `Order status updated to ${newStatus} ✅`
      );
    };

  /* =========================================================
     MARK COD PAID
  ========================================================= */

  const markOrderAsPaid =
    async (orderId) => {
      const updatedOrders =
        orders.map(
          (order) =>
            order.id === orderId
              ? {
                  ...order,
                  paymentStatus:
                    "Paid",
                  paidDate:
                    new Date().toLocaleString(),
                }
              : order
        );

      setOrders(
        updatedOrders
      );

      await saveOrdersToFirebase(
        updatedOrders
      );

      alert(
        "COD Payment marked as PAID ✅"
      );
    };

  /* =========================================================
     ADMIN LOGIN PAGE
  ========================================================= */
if (page === "admin-login") {
  if (adminLoggedIn) {
    return null;
  }

    return (
      <div className="admin-login-page">
        <div className="admin-login-box">

          <div className="admin-lock">
            🔐
          </div>

          <h1>
            SUTRAM LIVING
          </h1>

          <p>
            Admin Login
          </p>

          <form
            onSubmit={
              adminLogin
            }
          >
            <label>
              Username
            </label>

            <input
              type="text"
              placeholder="Admin username"
              value={
                adminUser
              }
              onChange={(e) =>
                setAdminUser(
                  e.target.value
                )
              }
            />

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Admin password"
              value={
                adminPass
              }
              onChange={(e) =>
                setAdminPass(
                  e.target.value
                )
              }
            />

            <button
              type="submit"
              className="login-button"
            >
              Login →
            </button>
          </form>

<div className="or-divider">
  <span>OR</span>
</div>

  <GoogleLogin
  onSuccess={googleAdminLogin}
  onError={() =>
    alert("Google Login Failed")
  }
/>

          <p className="admin-email-note">
            Authorized Google Admin
          </p>
        <button
  className="back-home"
  onClick={() => {
    setPage("shop");
  }}
>
  ← Buyer Website
</button>

        </div>
      </div>
    );
  }

  /* =========================================================
     ADMIN PAGE
  ========================================================= */
    
  if (
  page === "admin" &&
  adminLoggedIn
) {
 
    return (
      <div className="admin-page">

        <header className="admin-top">

          <div>
            <h1>
              SUTRAM LIVING
            </h1>

            <p>
              Admin Panel
            </p>
          </div>

          <button
            className="logout-button"
            onClick={
              logoutAdmin
            }
          >
            Logout
          </button>

        </header>

        <div className="admin-layout">

          <aside className="admin-sidebar">

            <button
              className={
                adminSection ===
                "dashboard"
                  ? "active-admin"
                  : ""
              }
              onClick={() =>
                setAdminSection(
                  "dashboard"
                )
              }
            >
              📊 Dashboard
            </button>

            <button
              className={
                adminSection ===
                "products"
                  ? "active-admin"
                  : ""
              }
              onClick={() =>
                setAdminSection(
                  "products"
                )
              }
            >
              🛍️ Products
            </button>

            <button
              className={
                adminSection ===
                "orders"
                  ? "active-admin"
                  : ""
              }
              onClick={() =>
                setAdminSection(
                  "orders"
                )
              }
            >
              📦 Buyers / Orders
{newOrderCount > 0 && (
  <span className="new-order-badge">
    {newOrderCount}
  </span>
)}
            </button>

            <button
              className={
                adminSection ===
                "payments"
                  ? "active-admin"
                  : ""
              }
              onClick={() =>
                setAdminSection(
                  "payments"
                )
              }
            >
              💳 Payments
            </button>
             <button
  className="back-dashboard-button"
  onClick={() => {
    setAdminSection("dashboard");
    setSelectedCategory(null);
    setPage("shop");
  }}
>
  🛍️ Buyer Website
</button>
          </aside>

          <main className="admin-content">
 
 {/* =================================================
   DASHBOARD
================================================= */}

{adminSection === "dashboard" && (
  <>

    <h2>
      Dashboard
    </h2>

    <div className="admin-stat-grid">

      {/* TOTAL ORDERS */}
      <div className="stat-card">
        <span>📦</span>

        <h3>
          Total Orders
        </h3>

        <strong>
          {orders.length}
        </strong>
      </div>


      {/* TOTAL SALES */}
      <div className="stat-card">
        <span>💰</span>

        <h3>
          Total Sales
        </h3>

        <strong>
          ₹
          {orders.reduce(
            (total, order) =>
              total +
              Number(order.total || 0),
            0
          )}
        </strong>
      </div>


      {/* PENDING ORDERS */}
      <div className="stat-card">
        <span>⏳</span>

        <h3>
          Pending Orders
        </h3>

        <strong>
          {
            orders.filter(
              (order) =>
                order.status !== "Delivered"
            ).length
          }
        </strong>
      </div>


      {/* DELIVERED ORDERS */}
      <div className="stat-card">
        <span>✅</span>

        <h3>
          Delivered Orders
        </h3>

        <strong>
          {
            orders.filter(
              (order) =>
                order.status === "Delivered"
            ).length
          }
        </strong>
      </div>


      {/* TOTAL PRODUCTS */}
      <div className="stat-card">
        <span>🛍️</span>

        <h3>
          Total Products
        </h3>

        <strong>
          {products.reduce(
            (total, category) =>
              total +
              (category.products?.length || 0),
            0
          )}
        </strong>
      </div>


      {/* LOW STOCK */}
      <div className="stat-card">
        <span>⚠️</span>

        <h3>
          Low Stock Products
        </h3>

        <strong>
          {products.reduce(
            (total, category) =>
              total +
              (category.products || []).filter(
                (product) =>
                  Number(product.quantity) > 0 &&
                  Number(product.quantity) <= 5
              ).length,
            0
          )}
        </strong>
      </div>

    </div>

  </>
)}
            
            {/* =================================================
               PRODUCTS ADMIN
            ================================================= */}

            {adminSection ===
              "products" && (
              <>

                <h2>
                  🛍️ Products
                </h2>

                <div className="admin-product-grid">

                  {products.map(
                    (category) => (
                      <div
                        className="admin-category-card"
                        key={
                          category.id
                        }
                      >

                        <div className="admin-category-icon">
                          {
                            category.icon
                          }
                        </div>

                        <h3>
                          {
                            category.title
                          }
                        </h3>

                        <p>
                          {
                            category.kannada
                          }
                        </p>

                        <button
                          className="manage-button"
                          onClick={() =>
                            setSelectedCategory(
                              selectedCategory?.id ===
                                category.id
                                ? null
                                : category
                            )
                          }
                        >
                          {selectedCategory?.id ===
                          category.id
                            ? "Close"
                            : "Manage Products"}
                        </button>

                        {selectedCategory?.id ===
                          category.id && (
                          <div className="admin-products">

                            {/* ADD PRODUCT */}

                            <div className="add-product-box">

                              <h3>
                                ➕ Add Product
                              </h3>

                              <div className="add-photo-box">

                                {newProduct.photo ? (
                                  <img
                                    src={
                                      newProduct.photo
                                    }
                                    alt="New product"
                                  />
                                ) : (
                                  <span>
                                    {
                                      category.icon
                                    }
                                  </span>
                                )}

                              </div>

                              <label className="photo-upload-button">

                                📷 Add Photo

                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleNewProductPhoto(
                                      e.target.files?.[0]
                                    )
                                  }
                                />

                              </label>

                              <input
                                type="text"
                                placeholder="Product Name"
                                value={
                                  newProduct.name
                                }
                                onChange={(e) =>
                                  setNewProduct(
                                    (old) => ({
                                      ...old,
                                      name:
                                        e.target.value,
                                    })
                                  )
                                }
                              />

                              <input
                                type="text"
                                placeholder="Weight / Size e.g. 250 g"
                                value={
                                  newProduct.unit
                                }
                                onChange={(e) =>
                                  setNewProduct(
                                    (old) => ({
                                      ...old,
                                      unit:
                                        e.target.value,
                                    })
                                  )
                                }
                              />

                              <input
                                type="number"
                                min="0"
                                placeholder="Rate ₹"
                                value={
                                  newProduct.price
                                }
                                onChange={(e) =>
                                  setNewProduct(
                                    (old) => ({
                                      ...old,
                                      price:
                                        e.target.value,
                                    })
                                  )
                                }
                              />

                              <textarea
                                rows="3"
                                placeholder="Product Description"
                                value={
                                  newProduct.description
                                }
                                onChange={(e) =>
                                  setNewProduct(
                                    (old) => ({
                                      ...old,
                                      description:
                                        e.target.value,
                                    })
                                  )
                                }
                              />

                              <input
                                type="number"
                                min="0"
                                placeholder="Stock Quantity"
                                value={
                                  newProduct.quantity
                                }
                                onChange={(e) =>
                                  setNewProduct(
                                    (old) => ({
                                      ...old,
                                      quantity:
                                        Number(
                                          e.target.value
                                        ),
                                    })
                                  )
                                }
                              />

                              <button
                                className="add-product-button"
                                onClick={() =>
                                  addProduct(
                                    category.id
                                  )
                                }
                              >
                                ➕ Add Product
                              </button>

                            </div>

                            {/* EXISTING PRODUCTS */}

                            {category.products.map(
                              (product) => (
                                <div
                                  className="admin-product-item"
                                  key={
                                    product.id
                                  }
                                >

                                  <div className="admin-photo">

                                    {product.photo ? (
                                      <img
                                        src={
                                          product.photo
                                        }
                                        alt={
                                          product.name
                                        }
                                      />
                                    ) : (
                                      <span>
                                        {
                                          category.icon
                                        }
                                      </span>
                                    )}

                                    <label>
                                      +
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                          handlePhoto(
                                            category.id,
                                            product.id,
                                            e.target.files?.[0]
                                          )
                                        }
                                      />
                                    </label>

                                  </div>

                                  <div className="admin-product-info">

                                    <input
                                      type="text"
                                      value={
                                        product.name
                                      }
                                      onChange={(e) =>
                                        updateProduct(
                                          category.id,
                                          product.id,
                                          {
                                            name:
                                              e.target.value,
                                          }
                                        )
                                      }
                                      placeholder="Product Name"
                                    />

                                    <input
                                      type="text"
                                      value={
                                        product.unit
                                      }
                                      onChange={(e) =>
                                        updateProduct(
                                          category.id,
                                          product.id,
                                          {
                                            unit:
                                              e.target.value,
                                          }
                                        )
                                      }
                                      placeholder="Weight / Size"
                                    />

                                    <input
                                      type="number"
                                      min="0"
                                      value={
                                        product.price
                                      }
                                      onChange={(e) =>
                                        updateProduct(
                                          category.id,
                                          product.id,
                                          {
                                            price:
                                              Number(
                                                e.target.value
                                              ),
                                          }
                                        )
                                      }
                                      placeholder="Rate ₹"
                                    />

                                    <textarea
                                      rows="3"
                                      value={
                                        product.description
                                      }
                                      onChange={(e) =>
                                        updateProduct(
                                          category.id,
                                          product.id,
                                          {
                                            description:
                                              e.target.value,
                                          }
                                        )
                                      }
                                      placeholder="Description"
                                    />

                                    <input
                                      type="number"
                                      min="0"
                                      value={
                                        product.quantity
                                      }
                                      onChange={(e) =>
                                        updateProduct(
                                          category.id,
                                          product.id,
                                          {
                                            quantity:
                                              Number(
                                                e.target.value
                                              ),
                                          }
                                        )
                                      }
                                      placeholder="Stock"
                                    />

                                    <div className="product-admin-actions">

                                      <button
                                        className="save-product-button"
                                        onClick={() =>
                                          alert(
                                            "Product saved successfully"
                                          )
                                        }
                                      >
                                        ✓ Save
                                      </button>

                                      <button
                                        className="delete-product-button"
                                        onClick={() =>
                                          deleteProduct(
                                            category.id,
                                            product.id
                                          )
                                        }
                                      >
                                        🗑️ Delete
                                      </button>

                                    </div>

                                    {Number(
                                      product.quantity
                                    ) === 0 ? (
                                      <span className="stock-out">
                                        Out of Stock
                                      </span>
                                    ) : (
                                      <span className="stock-in">
                                        Stock:{" "}
                                        {
                                          product.quantity
                                        }
                                      </span>
                                    )}

                                  </div>

                                </div>
                              )
                            )}

                          </div>
                        )}

                      </div>
                    )
                  )}

                </div>

              </>
            )}

            {/* =================================================
               ORDERS ADMIN
            ================================================= */}

            {adminSection ===
              "orders" && (
              <div className="orders-admin">

                <h2>
                  📦 Buyers / Orders
                </h2>
{/* ORDER SEARCH */}

<div className="order-search-box">

  <input
    type="text"
    placeholder="📱 Enter Customer Phone Number"
    value={orderSearch}
    onChange={(e) =>
      setOrderSearch(e.target.value)
    }
  />

  {orderSearch && (
    <button
      onClick={() => setOrderSearch("")}
    >
      ✕ Clear
    </button>
  )}

</div>


                {orders.length === 0 ? (
                  <div className="empty-admin">

                    <div>
                      📦
                    </div>

                    <h2>
                      No Orders Yet
                    </h2>

                    <p>
                      Customer orders will
                      appear here.
                    </p>

                  </div>
                ) : (
                  <div className="orders-list">

                  {orders.filter((order) => {
    const search = orderSearch.trim().toLowerCase();
    
    if (!search) return true;

return String(order.customer?.mobile ?? "")
  .trim()
  .includes(search);
  })
  .map(
    (order) => (
                        <div
                          className="order-card"
                          key={
                            order.id
                          }
                        >

                          <div className="order-header">

                            <div>
                              <h3>
                                {
                                  order.id
                                }
                              </h3>

                              <small>
                                {
                                  order.date
                                }
                              </small>
                            </div>

                            <strong>
                              ₹
                              {
                                order.total
                              }
                            </strong>

                          </div>

                          {/* BUYER */}

                          <div className="buyer-details">

                            <h4>
                              👤 Buyer Details
                            </h4>

                            <p>
                              <strong>
                                Name:
                              </strong>{" "}
                              {
                                order.customer?.name
                              }
                            </p>

                            <p>
                              <strong>
                                Mobile:
                              </strong>{" "}
                              {
                                order.customer?.mobile
                              }
                            </p>

                            <p>
                              <strong>
                                Address:
                              </strong>{" "}
                              {
                                order.customer?.address
                              }
                            </p>

                            <p>
                              <strong>
                                City:
                              </strong>{" "}
                              {
                                order.customer?.city
                              }
                            </p>

                            <p>
                              <strong>
                                Pincode:
                              </strong>{" "}
                              {
                                order.customer?.pincode
                              }
                            </p>

                          </div>

                          {/* PAYMENT */}

                          <div className="order-payment">

                            <h4>
                              💳 Payment
                            </h4>

                            <p>
                              <strong>
                                Method:
                              </strong>{" "}
                              {
                                order.paymentMethod
                              }
                            </p>

                            <p>
                              <strong>
                                Status:
                              </strong>{" "}
                              {
                                order.paymentStatus
                              }
                            </p>

                            {order.paymentId && (
                              <p>
                                <strong>
                                  Payment ID:
                                </strong>{" "}
                                {
                                  order.paymentId
                                }
                              </p>
                            )}

                            {order.paymentStatus !==
                              "Paid" &&
                              order.paymentMethod ===
                                "Cash on Delivery" && (
                                <button
                                  className="paid-button"
                                  onClick={() =>
                                    markOrderAsPaid(
                                      order.id
                                    )
                                  }
                                >
                                  ✓ Mark COD Paid
                                </button>
                              )}

                          </div>

                          {/* PRODUCTS */}

                          <div className="ordered-products">

                            <h4>
                              🛍️ Purchased Products
                            </h4>

                            {order.products?.map(
                              (
                                item,
                                index
                              ) => (
                                <div
                                  className="ordered-product"
                                  key={
                                    item.productId +
                                    "-" +
                                    index
                                  }
                                >

                                  <span>
                                    {
                                      item.name
                                    }

                                    <small>
                                      {" "}
                                      (
                                      {
                                        item.unit
                                      }
                                      )
                                    </small>
                                  </span>

                                  <span>
                                    ₹
                                    {
                                      item.price
                                    }{" "}
                                    ×{" "}
                                    {
                                      item.quantity
                                    }
                                  </span>

                                  <strong>
                                    ₹
                                    {
                                      item.total
                                    }
                                  </strong>

                                </div>
                              )
                            )}

                          </div>

                          {/* STATUS */}

                          <div className="order-status-section">

                            <h4>
                              🚚 Order Status
                            </h4>

                            <div className="order-status-buttons">

                              {[
                                "New Order",
                                "Processing",
                                "Shipped",
                                "Out for Delivery",
                                "Delivered",
                              ].map(
                                (status) => (
                                  <button
                                    key={
                                      status
                                    }
                                    className={
                                      order.status ===
                                      status
                                        ? "status-active"
                                        : ""
                                    }
                                    onClick={() =>
                                      updateOrderStatus(
                                        order.id,
                                        status
                                      )
                                    }
                                  >
                                    {status}
                                  </button>
                                )
                              )}

                            </div>

                            <p>
                              Current Status:{" "}
                              <strong>
                                {
                                  order.status
                                }
                              </strong>
                            </p>

                          </div>

                          <div className="order-total">

                            <span>
                              Total
                            </span>

                            <strong>
                              ₹
                              {
                                order.total
                              }
                            </strong>

                          </div>

                        </div>
                      )
                    )}

                  </div>
                )}

              </div>
            )}

{/* =================================================
   PAYMENTS
================================================= */}

{adminSection === "payments" && (
  <div className="payments-admin">

    <h2>
      💳 Payments
    </h2>

    {/* PAYMENT SUMMARY */}

<div className="payment-summary-grid">

  {/* CASH / COD PAID */}

  <div className="payment-summary-card">

    <span>💵</span>

    <h3>Cash Paid</h3>

    <strong>
      {
        orders.filter(
          (order) =>
            order.paymentMethod === "Cash on Delivery" &&
            order.paymentStatus === "Paid"
        ).length
      }
    </strong>

    <small>
      ₹
      {orders
        .filter(
          (order) =>
            order.paymentMethod === "Cash on Delivery" &&
            order.paymentStatus === "Paid"
        )
        .reduce(
          (total, order) =>
            total + Number(order.total || 0),
          0
        )}
    </small>

  </div>


  {/* ONLINE PAID */}

  <div className="payment-summary-card">

    <span>💳</span>

    <h3>Online Paid</h3>

    <strong>
      {
        orders.filter(
          (order) =>
            order.paymentMethod === "UPI / Online Payment" &&
            order.paymentStatus === "Paid"
        ).length
      }
    </strong>

    <small>
      ₹
      {orders
        .filter(
          (order) =>
            order.paymentMethod === "UPI / Online Payment" &&
            order.paymentStatus === "Paid"
        )
        .reduce(
          (total, order) =>
            total + Number(order.total || 0),
          0
        )}
    </small>

  </div>


  {/* COD PENDING */}

  <div className="payment-summary-card">

    <span>⏳</span>

    <h3>COD Pending</h3>

    <strong>
      {
        orders.filter(
          (order) =>
            order.paymentMethod === "Cash on Delivery" &&
            order.paymentStatus !== "Paid"
        ).length
      }
    </strong>

    <small>
      ₹
      {orders
        .filter(
          (order) =>
            order.paymentMethod === "Cash on Delivery" &&
            order.paymentStatus !== "Paid"
        )
        .reduce(
          (total, order) =>
            total + Number(order.total || 0),
          0
        )}
    </small>

  </div>


  {/* ONLINE PENDING */}

  <div className="payment-summary-card">

    <span>⏳</span>

    <h3>Online Pending</h3>

    <strong>
      {
        orders.filter(
          (order) =>
            order.paymentMethod === "UPI / Online Payment" &&
            order.paymentStatus !== "Paid"
        ).length
      }
    </strong>

    <small>
      ₹
      {orders
        .filter(
          (order) =>
            order.paymentMethod === "UPI / Online Payment" &&
            order.paymentStatus !== "Paid"
        )
        .reduce(
          (total, order) =>
            total + Number(order.total || 0),
          0
        )}
    </small>

  </div>


  {/* TOTAL COLLECTED */}

  <div className="payment-summary-card">

    <span>💰</span>

    <h3>Total Collected</h3>

    <strong>
      ₹
      {orders
        .filter(
          (order) =>
            order.paymentStatus === "Paid"
        )
        .reduce(
          (total, order) =>
            total + Number(order.total || 0),
          0
        )}
    </strong>

  </div>

</div>

    {/* PAYMENT LIST */}

    {orders.length === 0 ? (

      <div className="empty-admin">

        <div>
          💳
        </div>

        <h2>
          No Payments Yet
        </h2>

      </div>

    ) : (

      <div className="payments-list">

        {orders.map(
          (order) => (

            <div
              className="payment-card"
              key={order.id}
            >

              <div className="payment-card-header">

                <div>

                  <h3>
                    {order.id}
                  </h3>

                  <small>
                    {order.date}
                  </small>

                </div>

                <strong>
                  ₹{order.total}
                </strong>

              </div>


              <p>
                <strong>
                  Buyer:
                </strong>{" "}
                {order.customer?.name}
              </p>


              <p>
                <strong>
                  Mobile:
                </strong>{" "}
                {order.customer?.mobile}
              </p>


              <p>
                <strong>
                  Method:
                </strong>{" "}
                {order.paymentMethod}
              </p>


              <p>
                <strong>
                  Payment Status:
                </strong>{" "}
                {order.paymentStatus}
              </p>


              {order.paymentId && (
                <p>
                  <strong>
                    Payment ID:
                  </strong>{" "}
                  {order.paymentId}
                </p>
              )}


              {order.paymentMethod ===
                "Cash on Delivery" &&
                order.paymentStatus !==
                  "Paid" && (

                <button
                  className="paid-button"
                  onClick={() =>
                    markOrderAsPaid(
                      order.id
                    )
                  }
                >
                  ✓ Mark COD Paid
                </button>

              )}

            </div>

          )
        )}

      </div>

    )}

  </div>
)}
          </main>

        </div>

      </div>
    );
  }
            
  {/* =========================================================
     BUYER ORDER TRACKING PAGE
  ========================================================= */}
    if (
  page === "track-order"
) {

    const trackedOrder = orders.find(
      (order) =>
        order.id === trackingOrderId
    );

    const trackingSteps = [
      {
        key: "New Order",
        title: "Order Placed",
        icon: "📝",
      },
      {
        key: "Processing",
        title: "Processing",
        icon: "⚙️",
      },
      {
        key: "Shipped",
        title: "Shipped",
        icon: "📦",
      },
      {
        key: "Out for Delivery",
        title: "Out for Delivery",
        icon: "🚚",
      },
      {
        key: "Delivered",
        title: "Delivered",
        icon: "✅",
      },
    ];

    const currentStatus =
      trackedOrder?.status || "New Order";

    const currentIndex =
      trackingSteps.findIndex(
        (step) =>
          step.key === currentStatus
      );

    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f5f5f5",
          padding: "20px",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >

            <button
              onClick={() => setPage("shop")}
              style={{
                padding: "10px 16px",
                border: "none",
                borderRadius: "8px",
                background: "#222",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              ← Back to Shop
            </button>

            <h1
              style={{
                margin: 0,
                fontSize: "24px",
              }}
            >
              📦 Track Your Order
            </h1>

          </div>

          {!trackedOrder ? (
            <div
              style={{
                background: "#fff",
                padding: "30px",
                borderRadius: "16px",
                textAlign: "center",
                boxShadow:
                  "0 4px 15px rgba(0,0,0,0.08)",
              }}
            >

              <div
                style={{
                  fontSize: "50px",
                }}
              >
                📦
              </div>

              <h2>
                Order Not Found
              </h2>

              <p>
                Your order could not be found.
              </p>

              <button
                onClick={() =>
                  setPage("shop")
                }
                style={{
                  padding: "12px 20px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#111",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Continue Shopping
              </button>

            </div>
          ) : (
            <>

              {/* ORDER SUMMARY */}

              <div
                style={{
                  background: "#fff",
                  padding: "20px",
                  borderRadius: "16px",
                  marginBottom: "20px",
                  boxShadow:
                    "0 4px 15px rgba(0,0,0,0.08)",
                }}
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "15px",
                    flexWrap: "wrap",
                  }}
                >

                  <div>

                    <h2
                      style={{
                        marginTop: 0,
                      }}
                    >
                      {
                        trackedOrder.id
                      }
                    </h2>

                    <p>
                      <strong>
                        Order Date:
                      </strong>{" "}
                      {
                        trackedOrder.date
                      }
                    </p>

                    <p>
                      <strong>
                        Payment:
                      </strong>{" "}
                      {
                        trackedOrder.paymentMethod
                      }
                    </p>

                  </div>

                  <div
                    style={{
                      textAlign: "right",
                    }}
                  >

                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: "700",
                      }}
                    >
                      ₹
                      {
                        trackedOrder.total
                      }
                    </div>

                    <p>
                      Payment Status:{" "}
                      <strong>
                        {
                          trackedOrder.paymentStatus
                        }
                      </strong>
                    </p>

                  </div>

                </div>

              </div>

              {/* STATUS */}

              <div
                style={{
                  background: "#fff",
                  padding: "25px",
                  borderRadius: "16px",
                  marginBottom: "20px",
                  boxShadow:
                    "0 4px 15px rgba(0,0,0,0.08)",
                }}
              >

                <h2
                  style={{
                    marginTop: 0,
                  }}
                >
                  🚚 Order Status
                </h2>

                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    marginBottom: "25px",
                  }}
                >

                  {
                    trackingSteps[
                      currentIndex >= 0
                        ? currentIndex
                        : 0
                    ]?.icon
                  }{" "}

                  {
                    trackingSteps[
                      currentIndex >= 0
                        ? currentIndex
                        : 0
                    ]?.title
                  }

                </div>

                <div>

                  {trackingSteps.map(
                    (step, index) => {

                      const completed =
                        index <=
                        currentIndex;

                      const isLast =
                        index ===
                        trackingSteps.length -
                          1;

                      return (
                        <div
                          key={
                            step.key
                          }
                          style={{
                            display:
                              "flex",
                            position:
                              "relative",
                            minHeight:
                              isLast
                                ? "65px"
                                : "85px",
                          }}
                        >

                          {!isLast && (
                            <div
                              style={{
                                position:
                                  "absolute",
                                left: "19px",
                                top: "40px",
                                width: "3px",
                                height: "45px",
                                background:
                                  index <
                                  currentIndex
                                    ? "#111"
                                    : "#ddd",
                              }}
                            />
                          )}

                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              minWidth:
                                "40px",
                              borderRadius:
                                "50%",
                              background:
                                completed
                                  ? "#111"
                                  : "#e5e5e5",
                              color:
                                completed
                                  ? "#fff"
                                  : "#777",
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              fontSize:
                                "18px",
                              zIndex: 2,
                            }}
                          >
                            {
                              step.icon
                            }
                          </div>

                          <div
                            style={{
                              marginLeft:
                                "15px",
                              paddingTop:
                                "8px",
                            }}
                          >

                            <strong
                              style={{
                                color:
                                  completed
                                    ? "#111"
                                    : "#999",
                                fontSize:
                                  "16px",
                              }}
                            >
                              {
                                step.title
                              }
                            </strong>

                            {completed && (
                              <div
                                style={{
                                  fontSize:
                                    "13px",
                                  color:
                                    "#666",
                                  marginTop:
                                    "4px",
                                }}
                              >
                                ✓ Completed
                              </div>
                            )}

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

                <div
                  style={{
                    marginTop: "15px",
                    padding: "12px",
                    borderRadius: "10px",
                    background: "#f5f5f5",
                    fontSize: "14px",
                    color: "#555",
                  }}
                >
                  🔄 Order status automatically
                  updates when the seller changes it.
                </div>

              </div>

              {/* DELIVERY DETAILS */}

              <div
                style={{
                  background: "#fff",
                  padding: "20px",
                  borderRadius: "16px",
                  marginBottom: "20px",
                  boxShadow:
                    "0 4px 15px rgba(0,0,0,0.08)",
                }}
              >

                <h2
                  style={{
                    marginTop: 0,
                  }}
                >
                  📍 Delivery Details
                </h2>

                <p>
                  <strong>
                    Name:
                  </strong>{" "}
                  {
                    trackedOrder.customer?.name
                  }
                </p>

                <p>
                  <strong>
                    Mobile:
                  </strong>{" "}
                  {
                    trackedOrder.customer?.mobile
                  }
                </p>

                <p>
                  <strong>
                    Address:
                  </strong>{" "}
                  {
                    trackedOrder.customer?.address
                  }
                </p>

                <p>
                  <strong>
                    City:
                  </strong>{" "}
                  {
                    trackedOrder.customer?.city
                  }
                </p>

                <p>
                  <strong>
                    Pincode:
                  </strong>{" "}
                  {
                    trackedOrder.customer?.pincode
                  }
                </p>

              </div>

              {/* ORDERED PRODUCTS */}

              <div
                style={{
                  background: "#fff",
                  padding: "20px",
                  borderRadius: "16px",
                  boxShadow:
                    "0 4px 15px rgba(0,0,0,0.08)",
                }}
              >

                <h2
                  style={{
                    marginTop: 0,
                  }}
                >
                  🛍️ Ordered Products
                </h2>

                {trackedOrder.products?.map(
                  (item, index) => (
                    <div
                      key={
                        item.productId +
                        "-" +
                        index
                      }
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        gap: "10px",
                        padding:
                          "12px 0",
                        borderBottom:
                          "1px solid #eee",
                        flexWrap:
                          "wrap",
                      }}
                    >

                      <div>

                        <strong>
                          {
                            item.name
                          }
                        </strong>

                        <div
                          style={{
                            fontSize:
                              "13px",
                            color:
                              "#777",
                            marginTop:
                              "3px",
                          }}
                        >
                          {
                            item.unit
                          }{" "}
                          ×{" "}
                          {
                            item.quantity
                          }
                        </div>

                      </div>

                      <strong>
                        ₹
                        {
                          item.total
                        }
                      </strong>

                    </div>
                  )
                )}

                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    marginTop:
                      "20px",
                    fontSize:
                      "20px",
                    fontWeight:
                      "700",
                  }}
                >

                  <span>
                    Total
                  </span>

                  <span>
                    ₹
                    {
                      trackedOrder.total
                    }
                  </span>

                </div>

              </div>

            </>
          )}

        </div>
      </div>
    );
  }

  /* =========================================================
     BUYER PRODUCTS PAGE
  ========================================================= */

   if (
  page === "products" &&
  selectedCategory
) {
    const liveCategory =
      products.find(
        (category) =>
          category.id ===
          selectedCategory.id
      ) || selectedCategory;

    return (
      <div className="products-page">

        <header className="products-page-header">

          <button
            className="back-products-button"
            onClick={() =>
              setPage("shop")
            }
          >
            ← Back
          </button>

          <div className="products-title">

            <h1>
              {
                liveCategory.icon
              }{" "}
              {
                liveCategory.title
              }
            </h1>

            <p>
              {
                liveCategory.kannada
              }
            </p>

          </div>

          <button
            className="products-cart-button"
            onClick={() =>
              setPage("cart")
            }
          >
            🛒 Cart

            <span>
              {cartCount}
            </span>
          </button>

        </header>

        <main className="products-container">

          {liveCategory.products.length ===
          0 ? (
            <div className="no-products">

              <h2>
                No Products Available
              </h2>

            </div>
          ) : (
            liveCategory.products.map(
              (product) => {

                const expanded =
                  expandedProducts[
                    product.id
                  ];

                const description =
                  product.description ||
                  "Handmade quality product from SUTRAM LIVING.";

                const shortDescription =
                  description.length > 120
                    ? description.slice(
                        0,
                        120
                      ) + "..."
                    : description;

                return (
                  <div
                    className="buyer-product-card"
                    key={
                      product.id
                    }
                  >

                    <div className="buyer-product-image">

                      {product.photo ? (
                        <img
                          src={
                            product.photo
                          }
                          alt={
                            product.name
                          }
                        />
                      ) : (
                        <span>
                          {
                            liveCategory.icon
                          }
                        </span>
                      )}

                    </div>

                    <div className="buyer-product-content">

                      <div className="buyer-product-top">

                        <h2>
                          {
                            product.name
                          }
                        </h2>

                        <span className="buyer-unit">
                          {
                            product.unit
                          }
                        </span>

                      </div>

                      <div className="buyer-price">
                        ₹
                        {
                          product.price
                        }
                      </div>

                      <div
                        className={
                          product.quantity > 0
                            ? "buyer-stock-info"
                            : "buyer-stock-info out"
                        }
                      >

                        {product.quantity >
                        0 ? (
                          <>
                            <span>
                              ● In Stock
                            </span>

                            <small>
                              {
                                product.quantity
                              }{" "}
                              available
                            </small>
                          </>
                        ) : (
                          <span>
                            ● Out of Stock
                          </span>
                        )}

                      </div>

                      <div className="buyer-description-box">

                        <p className="buyer-description">
                          {
                            expanded
                              ? description
                              : shortDescription
                          }
                        </p>

                        {description.length >
                          120 && (
                          <button
                            className="see-more-button"
                            onClick={() =>
                              toggleProductDetails(
                                product.id
                              )
                            }
                          >
                            {
                              expanded
                                ? "See Less ↑"
                                : "See More ↓"
                            }
                          </button>
                        )}

                      </div>

                      <div className="buyer-product-actions">

                        <button
                          className="buyer-add-cart"
                          disabled={
                            product.quantity ===
                            0
                          }
                          onClick={() =>
                            addToCart(
                              product,
                              liveCategory
                            )
                          }
                        >
                          {product.quantity ===
                          0
                            ? "Out of Stock"
                            : "🛒 Add to Cart"}
                        </button>

                        <button
                          className="buyer-buy-now"
                          disabled={
                            product.quantity ===
                            0
                          }
                          onClick={() => {

                            const added =
                              addToCart(
                                product,
                                liveCategory
                              );

                            if (added) {
                              setPage(
                                "cart"
                              );
                            }

                          }}
                        >
                          ⚡ Buy Now
                        </button>

                      </div>

                    </div>

                  </div>
                );
              }
            )
          )}

        </main>

      </div>
    );
  }

  /* =========================================================
     CART PAGE
  ========================================================= */

  if (page === "cart") {
    return (
      <div className="cart-page">

        <div className="cart-header">

          <button
            className="continue-button"
            onClick={() =>
              setPage("shop")
            }
          >
            ← Continue Shopping
          </button>

          <h1>
            🛒 My Cart
          </h1>

        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">

            <div>
              🛒
            </div>

            <h2>
              Your Cart is Empty
            </h2>

            <button
              className="shop-button"
              onClick={() =>
                setPage("shop")
              }
            >
              Start Shopping →
            </button>

          </div>
        ) : (
          <div className="cart-box-page">

            {cart.map(
              (item) => (
                <div
                  className="cart-item"
                  key={item.id}
                >

                  <div className="cart-product-icon">

                    {item.photo ? (
                      <img
                        src={
                          item.photo
                        }
                        alt={
                          item.name
                        }
                      />
                    ) : (
                      item.icon
                    )}

                  </div>

                  <div className="cart-product-info">

                    <h3>
                      {
                        item.name
                      }
                    </h3>

                    <p>
                      {
                        item.unit
                      }
                    </p>

                    <strong>
                      ₹
                      {
                        item.price
                      }
                    </strong>

                  </div>

                  <div className="quantity">

                    <button
                      onClick={() =>
                        decrease(
                          item.id
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {
                        item.quantity
                      }
                    </span>

                    <button
                      onClick={() =>
                        increase(
                          item.id
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                  <strong>
                    ₹
                    {
                      item.price *
                      item.quantity
                    }
                  </strong>

                </div>
              )
            )}

            <div className="total">

              <span>
                Total
              </span>

              <strong>
                ₹
                {
                  cartTotal
                }
              </strong>

            </div>

            <button
              className="checkout-button"
              onClick={() =>
                setPage(
                  "checkout"
                )
              }
            >
              Proceed to Checkout →
            </button>

          </div>
        )}

      </div>
    );
  }

  /* =========================================================
     PAYMENT PAGE
  ========================================================= */

 if (
  page === "checkout" &&
  paymentPage
) {
    return (
      <div className="page-container">

        <div className="checkout-container">

          <button
            className="back-button"
            onClick={() => {
              setPaymentPage(
                false
              );
              setSelectedPayment(
                ""
              );
            }}
          >
            ← Back
          </button>

          <h1>
            💳 Payment
          </h1>

          <div className="payment-summary">

            <h3>
              Order Total
            </h3>

            <div className="payment-total">
              ₹
              {
                cartTotal
              }
            </div>

          </div>

          <div className="payment-options">

            <button
              type="button"
              className={
                selectedPayment ===
                "cod"
                  ? "payment-option selected"
                  : "payment-option"
              }
              onClick={() =>
                setSelectedPayment(
                  "cod"
                )
              }
            >

              <span>
                💵
              </span>

              <div>
                <strong>
                  Cash on Delivery
                </strong>

                <small>
                  Pay when your order arrives
                </small>
              </div>

            </button>

            <button
              type="button"
              className={
                selectedPayment ===
                "online"
                  ? "payment-option selected"
                  : "payment-option"
              }
              onClick={() =>
                setSelectedPayment(
                  "online"
                )
              }
            >

              <span>
                📱
              </span>

              <div>
                <strong>
                  UPI / Online Payment
                </strong>

                <small>
                  Pay securely online
                </small>
              </div>

            </button>

          </div>

          <button
            type="button"
            className="payment-button"
            disabled={
              !selectedPayment
            }
            onClick={() => {

              if (
                selectedPayment ===
                "cod"
              ) {
                createCODOrder();
                return;
              }

              if (
                selectedPayment ===
                "online"
              ) {
                startOnlinePayment();
              }

            }}
          >
            {selectedPayment ===
            "cod"
              ? "Place Order →"
              : selectedPayment ===
                "online"
              ? "Pay Now →"
              : "Select Payment Method"}
          </button>

        </div>

      </div>
    );
  }

  /* =========================================================
     CHECKOUT DELIVERY DETAILS
  ========================================================= */

  if (page === "checkout") {
    return (
      <div className="checkout-page">

        <div className="checkout-header">

          <button
            className="continue-button"
            onClick={() =>
              setPage("cart")
            }
          >
            ← Back to Cart
          </button>

          <h1>
            Checkout
          </h1>

        </div>

        <div className="checkout-layout">

          <div className="checkout-form-box">

            <h2>
              📦 Delivery Details
            </h2>

            <form
              onSubmit={
                placeOrder
              }
            >

              <label>
                Full Name
              </label>

              <input
                value={
                  customer.name
                }
                placeholder="Your name"
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    name:
                      e.target.value,
                  })
                }
              />

              <label>
                Mobile Number
              </label>

              <input
                value={
                  customer.mobile
                }
                placeholder="Mobile number"
                maxLength="10"
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    mobile:
                      e.target.value.replace(
                        /\D/g,
                        ""
                      ),
                  })
                }
              />

              <label>
                Full Address
              </label>

              <textarea
                rows="4"
                value={
                  customer.address
                }
                placeholder="House No, Street, Area..."
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    address:
                      e.target.value,
                  })
                }
              />

              <div className="checkout-row">

                <div>

                  <label>
                    City
                  </label>

                  <input
                    value={
                      customer.city
                    }
                    placeholder="City"
                    onChange={(e) =>
                      setCustomer({
                        ...customer,
                        city:
                          e.target.value,
                      })
                    }
                  />

                </div>

                <div>

                  <label>
                    Pincode
                  </label>

                  <input
                    value={
                      customer.pincode
                    }
                    placeholder="Pincode"
                    maxLength="6"
                    onChange={(e) =>
                      setCustomer({
                        ...customer,
                        pincode:
                          e.target.value.replace(
                            /\D/g,
                            ""
                          ),
                      })
                    }
                  />

                </div>

              </div>

              <button
                className="payment-button"
                type="submit"
              >
                Continue to Payment →
              </button>

            </form>

          </div>

          <div className="order-summary">

            <h2>
              🛍️ Order Summary
            </h2>

            {cart.map(
              (item) => (
                <div
                  className="summary-product"
                  key={
                    item.id
                  }
                >

                  <span>
                    {
                      item.icon
                    }
                  </span>

                  <div>

                    <strong>
                      {
                        item.name
                      }
                    </strong>

                    <small>
                      {
                        item.unit
                      }
                    </small>

                    <small>
                      Qty:{" "}
                      {
                        item.quantity
                      }
                    </small>

                  </div>

                  <strong>
                    ₹
                    {
                      item.price *
                      item.quantity
                    }
                  </strong>

                </div>
              )
            )}

            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                ₹
                {
                  cartTotal
                }
              </strong>

            </div>

          </div>

        </div>

      </div>
    );
  }

  /* =========================================================
     BUYER SHOP
  ========================================================= */

  if (page === "shop") {
    return (
      <div className="container">

        <header className="top-bar">

          <div className="brand-area">

            <div className="brand-text">

              <h1>
                SUTRAM LIVING
              </h1>

              <p className="tagline">
                Handmade • Natural • Homemade
              </p>

            </div>

          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {adminLoggedIn ||
localStorage.getItem("sutram_buyer_logged_in") === "true" ? (
  <button
    className="unique-cart-button"
    onClick={() => {
      localStorage.removeItem("sutram_admin_logged_in");
      localStorage.removeItem("sutram_buyer_logged_in");

      setAdminLoggedIn(false);
      setAdminUser("");
      setAdminPass("");
      setAdminSection("dashboard");
      setSelectedCategory(null);
      setPage("shop");
    }}
  >
    🔓 Logout
  </button>
) : (
  <button
    className="unique-cart-button"
    onClick={() => setPage("admin-login")}
  >
   🔐 Admin
  </button>
)}

            {localStorage.getItem(
              "sutram_last_order_id"
            ) && (
              <button
                className="unique-cart-button"
                onClick={() => {
                  const orderId =
                    localStorage.getItem(
                      "sutram_last_order_id"
                    );

                  setTrackingOrderId(
                    orderId
                  );

                  setPage(
                    "track-order"
                  );
                }}
              >
                📦 Track Order
              </button>
            )}

            <button
              className="unique-cart-button"
              onClick={() =>
                setPage("cart")
              }
            >
              🛒 My Cart

              <span className="cart-count">
                {
                  cartCount
                }
              </span>

            </button>
            <button
              className="privacy-policy-button"
onClick={() => setPage("privacy-policy")}
                
            >
              🔒 Privacy Policy
            </button>


          </div>

        </header>

        <h2 className="products-heading">
          ನಮ್ಮ ಉತ್ಪನ್ನಗಳು / Our Products
        </h2>

        <div className="category-grid">

          {products.map(
            (category) => (
              <div
                className="category-card"
                key={
                  category.id
                }
              >

                <div className="category-icon">
                  {
                    category.icon
                  }
                </div>

                <h3>
                  {
                    category.title
                  }
                </h3>

                <p className="kannada">
                  {
                    category.kannada
                  }
                </p>

                <button
                  className="category-button"
                  onClick={() => {

                    setSelectedCategory(
                      category
                    );

                    setExpandedProducts(
                      {}
                    );

                    setPage(
                      "products"
                    );

                  }}
                >
                  {
                    category.icon
                  }{" "}
                  View Products
                </button>

              </div>
            )
          )}

        </div>

      </div>
    );
  }

  /* =========================================================
     DEFAULT
  ========================================================= */
 if (page === "privacy-policy") {
  return <PrivacyPolicy />;
}
 
  if (window.location.pathname === "/privacy-policy") {
  return <PrivacyPolicy />;
}
  return (
    <div className="container">

      <header className="top-bar">

        <div className="brand-area">

         <button
  className="admin-button"
  onClick={() => {
    if (
      localStorage.getItem("sutram_admin_logged_in") === "true"
    ) {
      setAdminLoggedIn(true);
      setPage("admin");
    } else {
      setPage("admin-login");
    }
  }}
>
  🔐 Admin
</button>
          <div className="brand-text">

            <h1>
              SUTRAM LIVING
            </h1>

            <p className="tagline">
              Handmade • Natural • Homemade
            </p>

          </div>

        </div>

        <button
          className="unique-cart-button"
          onClick={() =>
            setPage("cart")
          }
        >
          🛒 My Cart

          <span className="cart-count">
            {
              cartCount
            }
          </span>

        </button>

      </header>

      <h2 className="products-heading">
        ನಮ್ಮ ಉತ್ಪನ್ನಗಳು / Our Products
      </h2>

      <div className="category-grid">

        {products.map(
          (category) => (
            <div
              className="category-card"
              key={
                category.id
              }
            >

              <div className="category-icon">
                {
                  category.icon
                }
              </div>

              <h3>
                {
                  category.title
                }
              </h3>

              <p className="kannada">
                {
                  category.kannada
                }
              </p>

              <button
                className="category-button"
                onClick={() => {

                  setSelectedCategory(
                    category
                  );

                  setExpandedProducts(
                    {}
                  );

                  setPage(
                    "products"
                  );

                }}
              >
                {
                  category.icon
                }{" "}
                View Products
              </button>

            </div>
          )
        )}

      </div>

    </div>
  );
}

export default App;