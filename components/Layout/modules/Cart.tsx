import { FunctionComponent } from "react";
import { CartItemsProps } from "../types/layout.types";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { CollectionGraph } from "@/components/StoreFront/types/storefront.types";

const Cart: FunctionComponent<CartItemsProps> = ({
  dispatch,
  cartItems,
  cartOpen,
  setCartOpen,
}): JSX.Element => {
  return (
    <div className="relative w-fit h-fit flex flex-col">
      <div
        className="relative w-fit h-fit cursor-pointer active:scale-95"
        onClick={() => setCartOpen(!cartOpen)}
      >
        <AiOutlineShoppingCart size={20} color="white" />
      </div>
      {cartOpen && (
        <div className="absolute rounded-md bg-white h-60 w-40 right-0 z-1 top-6">
          {cartItems?.map((cart: CollectionGraph, index: number) => {
            return <div key={index} className="relative w-full h-10">
               // remove from cart, increase amount (have a max amount)
            </div>;
          })}
        </div>
      )}
    </div>
  );
};

export default Cart;
