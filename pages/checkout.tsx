import useFulfillment from "@/components/StoreFront/hooks/useFulfillment";
import { PurchaseCollection } from "@/components/StoreFront/types/storefront.types";
import { INFURA_GATEWAY } from "@/lib/constants";
import { setCartItems } from "@/redux/reducers/cartItemsSlice";
import { RootState } from "@/redux/store";
import { NextPage } from "next";
import Image from "next/legacy/image";
import { AiOutlineLoading } from "react-icons/ai";
import { IoCloseOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

const Checkout: NextPage = (): JSX.Element => {
  const dispatch = useDispatch();
  const cartItems = useSelector(
    (state: RootState) => state.app.cartItemsReducer.value
  );

  const { approveSpend, approved, purchaseLoading, buyNFT, totalAmounts } =
    useFulfillment();

  return (
    <div className="relative w-full h-full flex flex-row">
      <div className="relative w-full h-full flex flex-col gap-2 overflow-y-scroll bg-white">
        {cartItems?.map((cart: PurchaseCollection, index: number) => {
          return (
            <div
              key={index}
              className="relative w-full h-60 flex flex-row gap-1 justify-start items-start"
            >
              <div className="relative w-1/2 h-full rounded-md flex items-center justify-center">
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
                        if (purchaseLoading) {
                          return;
                        }
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
                        if (purchaseLoading) {
                          return;
                        }
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
                      if (purchaseLoading) {
                        return;
                      }
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
      <div className="relative w-full h-fit bg-black rounded-md flex flex-col text-white p-3 gap-4">
        <div className="relative w-fit h-fit font-mega">Details</div>
        <div className="relative w-full h-full flex flex-row">
          <div className="relative flex flex-col w-fit h-fit">
            <div className="relative w-fit h-fit text-white font-earl">
              Name
            </div>
            <input className="relative w-full h-auto text-black font-earl rounded-md p-1" />
          </div>
        </div>
        <div className="relative flex flex-col w-fit h-fit">
          <div className="relative w-fit h-fit text-white font-earl">
            Shipping
          </div>
          <div className="relative w-full h-full flex flex-row gap-3">
            <div className="relative flex flex-col w-fit h-fit">
              <div className="relative w-fit h-fit text-white font-earl">
                House / Apt No.
              </div>
              <input className="relative w-full h-auto text-black font-earl rounded-md p-1" />
            </div>
            <div className="relative flex flex-col w-fit h-fit">
              <div className="relative w-fit h-fit text-white font-earl">
                Street Name
              </div>
              <input className="relative w-full h-auto text-black font-earl rounded-md p-1" />
            </div>
          </div>

          <div className="relative w-full h-full flex flex-row gap-3">
            <div className="relative flex flex-col w-fit h-fit">
              <div className="relative w-fit h-fit text-white font-earl">
                State
              </div>
              <input className="relative w-full h-auto text-black font-earl rounded-md p-1" />
            </div>
            <div className="relative flex flex-col w-fit h-fit">
              <div className="relative w-fit h-fit text-white font-earl">
                Country
              </div>
              <input className="relative w-full h-auto text-black font-earl rounded-md p-1" />
            </div>
          </div>
          <div className="relative flex flex-col w-fit h-fit">
            <div className="relative w-fit h-fit text-white font-earl">
              Postcode
            </div>
            <input className="relative w-full h-auto text-black font-earl rounded-md p-1" />
          </div>
        </div>
        <div className="relative flex flex-col w-fit h-fit">
          <div className="relative w-fit h-fit text-white font-earl">
            Total Cost
          </div>
          <div className="relative flex flex-col gap-1">
            {totalAmounts?.map(
              (
                item: {
                  purchaseToken: string;
                  totalPrice: number;
                },
                index: number
              ) => {
                return (
                  <div className="relative w-full h-fit gap-2 flex flex-col items-center justify-start">
                    <div
                      key={index}
                      className="relative w-fit h-fit flex flex-row gap-1.5 text-white font-mega"
                    >
                      <div className="relative w-fit h-fit text-sm">
                        {item.totalPrice}
                      </div>
                      <div className="relative w-fit h-fit text-sm">
                        {item.purchaseToken}
                      </div>
                    </div>
                    {!approved[index] && (
                      <div
                        className={`relative w-fit h-fit text-white font-earl bg-darker p-2 ${
                          !purchaseLoading &&
                          !approved[index] &&
                          "cursor-pointer active:scale-95"
                        }`}
                        onClick={
                          purchaseLoading
                            ? () => {}
                            : () =>
                                approveSpend(
                                  item.purchaseToken,
                                  item.totalPrice,
                                  index
                                )
                        }
                      >
                        approve token spend
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>
        <div className="relative flex flex-col w-fit h-fit">
          <div
            className={`relative w-fit h-fit text-white font-earl bg-darker p-2 ${
              !purchaseLoading &&
              (approved.length > 0 &&
                approved?.every((value) => value === true)) &&
              "cursor-pointer active:scale-95"
            }`}
            onClick={
              purchaseLoading
                ? () => {}
                : () =>
                    (approved.length > 0 &&
                      approved?.every((value) => value === true)) &&
                    buyNFT()
            }
          >
            <div
              className={`relative w-fit h-fit ${
                purchaseLoading && "animate-spin"
              }`}
            >
              {purchaseLoading ? (
                <AiOutlineLoading size={15} color="white" />
              ) : approved.length < 1 ||
                !approved?.every((value) => value === true) ? (
                "approve token spend"
              ) : (
                "Purchase & Fulfill"
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
