import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { setLocalStorage, getLocalStorage } from "../../utils/localstorage";

interface Product {
   id: number;
   title: string;
   quantity: number;
   price: number;
   authorId?: number;
   thumb?: number;
}

interface CartState {
   cart: Product[];
   orderQuantity: number;
   discountApplied: boolean;
   discountedTotal: number | null; // İndirimli toplam
}

const initialState: CartState = {
   cart: getLocalStorage<Product>("cart") || [], // Load initial state from localStorage
   orderQuantity: 1,
   discountApplied: false,
   discountedTotal: null,
};

const cartSlice = createSlice({
   name: "cart",
   initialState,
   reducers: {
      addToCart: (state, { payload }: PayloadAction<Product>) => {
         const productIndex = state.cart.findIndex((item) => item.id === payload.id);
         if (productIndex >= 0) {
            state.cart[productIndex].quantity += 1;
            toast.info(`${payload.title} Increase Product Quantity`, {
               position: "top-right",
            });
         } else {
            const tempProduct = { ...payload, quantity: 1 };
            state.cart.push(tempProduct);
            toast.success(`${payload.title} added to cart`, {
               position: "top-right",
            });
         }
         setLocalStorage("cart", state.cart); // Save cart to localStorage
      },
      decrease_quantity: (state, { payload }: PayloadAction<Product>) => {
         const cartIndex = state.cart.findIndex((item) => item.id === payload.id);
         if (cartIndex >= 0 && state.cart[cartIndex].quantity > 1) {
            state.cart[cartIndex].quantity -= 1;
            toast.error(`${payload.title} Decrease cart quantity`, {
               position: "top-right",
            });
            setLocalStorage("cart", state.cart); // Update localStorage
         }
      },
      remove_cart_product: (state, { payload }: PayloadAction<Product>) => {
         state.cart = state.cart.filter((item) => item.id !== payload.id);
         toast.error(`Remove from your cart`, {
            position: "top-right",
         });
         setLocalStorage("cart", state.cart); // Update localStorage
      },
      clear_cart: (state) => {
         if (state.cart.length === 0) {
            // Sepet boşsa hiçbir işlem yapma
            return;
         }

         const confirmMsg = window.confirm("Are you sure you want to delete your cart?");
         if (confirmMsg) {
            state.cart = [];
            setLocalStorage("cart", state.cart); // Clear localStorage
         }
      },
      get_cart_products: (state) => {
         state.cart = getLocalStorage<Product>("cart"); // Load cart from localStorage
      },
      applyDiscount: (state, { payload }: PayloadAction<number>) => {
         if (!state.discountApplied) {
            state.discountApplied = true;
            const discountRate = payload; // Örneğin, 0.2 (%20 indirim)
            const discountedCart = state.cart.map((item) => ({
               ...item,
               price: parseFloat((item.price * (1 - discountRate)).toFixed(2)),
            }));
            state.cart = discountedCart;
            state.discountedTotal = state.cart.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
            setLocalStorage("cart", state.cart); // LocalStorage'ı güncelle
         }
      },

   },
});

export const {
   addToCart,
   decrease_quantity,
   remove_cart_product,
   clear_cart,
   get_cart_products,
   applyDiscount
} = cartSlice.actions;

export default cartSlice.reducer;
