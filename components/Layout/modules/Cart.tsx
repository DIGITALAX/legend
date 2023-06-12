import { FunctionComponent } from "react";
import { CartItemsProps } from "../types/layout.types";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { PurchaseCollection } from "@/components/StoreFront/types/storefront.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import { setCartItems } from "@/redux/reducers/cartItemsSlice";
import { IoCloseOutline } from "react-icons/io5";

const Cart: FunctionComponent<CartItemsProps> = ({
  dispatch,
  cartItems,
  cartOpen,
  setCartOpen,
  router,
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
        <div className="absolute rounded-md bg-white h-60 w-40 right-0 z-1 top-6 p-2 flex flex-col">
          <div className="relative w-full h-fit flex flex-col gap-2 overflow-y-scroll">
            {cartItems?.map((cart: PurchaseCollection, index: number) => {
              return (
                <div
                  key={index}
                  className="relative w-full h-20 flex flex-row gap-1 justify-start items-start"
                >
                  <div className="relative w-full h-full rounded-md flex items-center justify-center">
                    <Image
                      layout="fill"
                      objectFit="cover"
                      src={`${INFURA_GATEWAY}/${cart.uri.image}`}
                      className="rounded-md"
                      draggable={false}
                    />
                  </div>
                  <div className="relative w-full h-full flex flex-col text-black">
                    <div className="relative w-fit h-fit font-earl text-xs">
                      {cart.uri.name.length > 10
                        ? cart.uri.name.slice(0, 7) + "..."
                        : cart.uri.name}
                    </div>
                    <div className="relative flex flex-row gap-1 justify-center items-center w-full h-fit">
                      <div className="relative w-fit h-fit font-earl text-xs">
                        {cart.purchaseAmount}
                      </div>
                      <div className="relative flex flex-col items-center justify-center text-black font-earl text-xs text-white">
                        <div
                          className="relative w-fit h-fit bg-darker px-1.5 cursor-pointer active:scale-95 py-px"
                          onClick={() => {
                            let carts = [...cartItems];
                            const tokenCount = carts[index].tokenIds.length;
                            const collectionId = carts[index].collectionId;
                            let existingAmount = 0;

                            // Calculate existing purchase amount for the same collectionId
                            carts.forEach((item) => {
                              if (item.collectionId === collectionId) {
                                existingAmount += item.purchaseAmount;
                              }
                            });

                            const currentPurchaseAmount =
                              carts[index].purchaseAmount;

                            if (1 + existingAmount <= tokenCount) {
                              carts[index] = {
                                ...carts[index],
                                purchaseAmount: currentPurchaseAmount + 1,
                              };
                            }

                            dispatch(setCartItems(carts));
                          }}
                        >
                          +
                        </div>
                        <div
                          className="relative w-fit h-fit bg-darker px-1.5 cursor-pointer active:scale-95 py-px"
                          onClick={() => {
                            let carts = [...cartItems];
                            const updatedPurchaseAmount =
                              carts[index].purchaseAmount - 1;

                            if (updatedPurchaseAmount > 0) {
                              carts[index] = {
                                ...carts[index],
                                purchaseAmount: updatedPurchaseAmount,
                              };
                            } else {
                              carts.splice(index, 1);
                            }

                            dispatch(setCartItems(carts));
                          }}
                        >
                          -
                        </div>
                      </div>
                      <div
                        className="relative w-fit h-fit cursor-pointer active:scale-95"
                        onClick={() => {
                          let carts = [...cartItems];
                          carts.splice(index, 1);
                          dispatch(setCartItems(carts));
                        }}
                      >
                        <IoCloseOutline size={15} color="black" />
                      </div>
                    </div>
                    <div className="relative w-full h-fit flex flex-row text-black justify-center items-center gap-2">
                      <div className="relative w-fit h-fit font-earl text-xs">
                        {cart.baseColor}
                      </div>
                      <div className="relative w-fit h-fit font-earl text-xs">
                        {cart.size}
                      </div>
                      <div className="relative w-fit h-fit font-earl text-xs">
                        {Number(cart.purchasePrice) * cart.purchaseAmount}{" "}
                        {cart.purchaseToken}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="relative w-full h-fit flex text-white p-1">
            <div
              className="bg-darker px-1 py-px w-fit h-fit justify-end flex cursor-pointer rounded-md active:scale-95"
              onClick={() => {
                router.push("/checkout");
                setCartOpen(false);
              }}
            >
              checkout
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
