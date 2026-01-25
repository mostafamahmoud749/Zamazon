"use client"
import { createContext } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {

    return (
        <CartContext.Provider >
            {children}
        </CartContext.Provider>
    );
}

