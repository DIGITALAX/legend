import { ACCEPTED_TOKENS_MUMBAI, INFURA_GATEWAY } from "@/lib/constants";
import { setCollapseItem } from "@/redux/reducers/collapseItemSlice";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import Draggable from "react-draggable";
import { StorefrontBoxProps } from "../types/grant.types";
import { setError } from "@/redux/reducers/errorSlice";

const StoreFrontBox: FunctionComponent<StorefrontBoxProps> = ({
  collapseNumber,
  dispatch,
  index,
  storeLoading,
  grantCollection,
  nextItem,
  setNextItem,
  size,
  baseColor,
  setSize,
  setBaseColor,
  setPurchasePrice,
  currency,
  setCurrency,
  purchaseAmount,
  setPurchaseAmount,
  addItemToCart,
  canCollect,
  cartItems,
}): JSX.Element => {
  return (
    <Draggable
      enableUserSelectHack={false}
      //   nodeRef={grantRef as any}
      cancel=".stopDrag"
    >
      <div
        className={`absolute z-1 -bottom-40 right-10 w-80 flex p-1 drop-shadow-2xl ${
          collapseNumber[index] ? "h-4" : "h-100"
        }`}
      >
        <Image
          layout="fill"
          src={`${INFURA_GATEWAY}/QmUX8xCW3ErrfdQgv5LKwqgjgmbGn98PJ9cPNyPmtqF2hy`}
          className="w-full h-full flex relative"
          draggable={false}
        />
        <div
          className="stopDrag flex absolute w-full h-4 top-1 left-0 px-3 cursor-pointer"
          onClick={() =>
            dispatch(
              setCollapseItem(
                [...collapseNumber].map((item, i) =>
                  i === index ? !item : item
                )
              )
            )
          }
        >
          <div className="relative flex justify-center items-center w-full h-full">
            <Image
              src={`${INFURA_GATEWAY}/QmYfpEREcRAMyretbQbT7YFtJHZLeR948iCezLTgvcUFYS`}
              layout="fill"
              draggable={false}
            />
          </div>
        </div>
        {!collapseNumber[index] && (
          <div className="relative w-full h-full flex items-start justify-start overflow-y-scroll">
            <div className="p-2 flex w-full h-full flex-col gap-3 items-center top-6 relative">
              <div className="w-full h-52 border border-black bg-mist items-center justify-center flex">
                <div className="relative w-full h-52 flex items-center justify-center">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/${grantCollection[nextItem]?.uri?.image}`}
                      draggable={false}
                      objectFit="cover"
                    />
                    {grantCollection[nextItem]?.grantCollectorsOnly && (
                      <div className="absolute top-2 left-2 font-earl text-xs">
                        <div
                          className={`rounded-md relative border border-black flex w-full text-center text-xxs justify-center items-center h-fit py-1.5 font-earl text-white uppercase px-3 bg-darker`}
                        >
                          Grant Collectors
                          <br />
                          Only
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="relative w-full h-full flex flex-col justify-center items-start gap-2">
                <div className="relative w-full h-8 flex items-center justify-center rounded-md border border-black font-earl">
                  <div className="absolute w-full h-full flex opacity-70">
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/Qme3dKpZyyv9oMEu9AbaS3Q3xXGcbXj5V2JXhhJW8bRfQV`}
                      draggable={false}
                    />
                  </div>
                  {grantCollection[nextItem]?.uri?.name}
                </div>
              </div>
              <div className="relative w-full h-full flex flex-col justify-center items-start gap-2">
                <div className="relative w-full h-14 flex items-start justify-start rounded-md border border-black font-earl overflow-y-scroll bg-scroll">
                  {grantCollection[nextItem]?.uri?.description}
                </div>
              </div>
              <div className="flex relative w-full h-full h-4 top-1 left-0 p-3 flex-col gap-3">
                <div className="relative flex flex-col w-full h-fit gap-1.5 font-mega text-black">
                  <div className="relative w-fit h-fit font-mega text-sm">
                    Sizing
                  </div>
                  <div className="w-full h-fit relative flex flex-wrap gap-2">
                    {Array.from(["xs", "s", "m", "l", "xl"]).map(
                      (value: string, index: number) => {
                        return (
                          <div
                            className={`relative w-7 h-7 items-center justify-center flex rounded-full p-1.5 cursor-pointer active:scale-95 ${
                              size === value
                                ? "bg-mazul border-2  border-black"
                                : " bg-darker"
                            }`}
                            key={index}
                            onClick={() => setSize(value)}
                          >
                            <div className="relative w-full h-full font-earl text-sm flex justify-center items-center text-white">
                              {value}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
                <div className="relative flex flex-col w-full h-fit gap-1.5 font-mega text-black">
                  <div className="relative w-fit h-fit font-mega text-sm">
                    Base Color
                  </div>
                  <div className="w-full h-fit relative flex flex-wrap gap-2">
                    {Array.from(["blue", "red", "white", "black"]).map(
                      (value: string, index: number) => {
                        return (
                          <div
                            className={`relative w-7 h-7 items-center justify-center flex rounded-full p-1.5 cursor-pointer active:scale-95 ${
                              baseColor === value
                                ? "border-2  border-darker"
                                : "border-2  border-black"
                            } ${
                              index === 0
                                ? "bg-mazul"
                                : index === 1
                                ? "bg-rosa"
                                : index === 2
                                ? "bg-white"
                                : "bg-black"
                            }`}
                            key={index}
                            onClick={() => setBaseColor(value)}
                          ></div>
                        );
                      }
                    )}
                  </div>
                </div>
                {grantCollection[nextItem]?.discount &&
                  grantCollection[nextItem]?.discount > 0 && (
                    <div className="relative flex flex-col w-full h-fit gap-1.5 font-mega text-black">
                      <div className="relative w-fit h-fit font-mega text-sm">
                        Grant Collector Discount
                      </div>
                      <div className="w-full h-fit relative flex flex-wrap gap-2">
                        {grantCollection[nextItem]?.discount}%
                      </div>
                    </div>
                  )}
                <div className="relative w-full h-fit flex justify-center items-center gap-2">
                  {ACCEPTED_TOKENS_MUMBAI.map((token) => {
                    const tokenIndex: number = grantCollection[
                      nextItem
                    ]?.acceptedTokens.indexOf(token[1].toLowerCase())!;
                    if (tokenIndex !== -1) {
                      return {
                        ...token,
                        price:
                          grantCollection[nextItem]?.basePrices[tokenIndex],
                        symbol: token[0],
                      };
                    }
                    return null;
                  })
                    .filter((token) => token !== null)
                    .map((value: any, index: number) => {
                      return (
                        <div
                          className="relative w-fit h-fit flex flex-col gap-1 items-center justify-center"
                          key={index}
                        >
                          <div
                            className={`relative w-fit h-fit flex flex-col gap-1 items-center justify-center cursor-pointer active:scale-95 ${
                              currency?.includes(value[0])
                                ? "opacity-50"
                                : "opacity-100"
                            }`}
                            onClick={() => {
                              setCurrency(value[0]);
                              setPurchasePrice(value.price);
                            }}
                          >
                            <div className="relative w-7 h-8 flex rounded-full items-center justify-center">
                              <Image
                                src={`${INFURA_GATEWAY}/${value[2]}`}
                                draggable={false}
                                layout="fill"
                                className="flex"
                              />
                            </div>
                          </div>
                          <div className="relative w-fit h-fit text-black font-earl">
                            {value.price} {value.symbol}
                          </div>
                        </div>
                      );
                    })}
                </div>
                <div className="relative flex flex-row w-full h-fit gap-2 justify-center items-center">
                  <div className="relative flex flex-row gap-1 w-fit h-fit">
                    <div className="relative text-black font-earl">
                      {purchaseAmount}
                    </div>
                    <div className="relative flex flex-col items-center justify-center text-black font-mega text-xs text-white">
                      <div
                        className="relative w-fit h-fit bg-darker px-3 cursor-pointer active:scale-95 py-1"
                        onClick={() => {
                          let carts = [...cartItems];
                          const collectionId =
                            grantCollection[nextItem]?.collectionId;
                          let existingAmount = 0;

                          carts.forEach((item) => {
                            if (item.collectionId === collectionId) {
                              existingAmount += item.purchaseAmount;
                            }
                          });

                          let purchaseAmountValue = purchaseAmount;

                          if (
                            purchaseAmount + 1 + existingAmount <=
                            grantCollection[nextItem]?.tokenIds.length!
                          ) {
                            purchaseAmountValue = purchaseAmount + 1;
                            setPurchaseAmount(purchaseAmountValue);
                          } else {
                            setPurchaseAmount(purchaseAmountValue);
                            dispatch(
                              setError({
                                actionValue: true,
                                actionMessage: "Items exceed token limit.",
                              })
                            );
                          }
                        }}
                      >
                        +
                      </div>
                      <div
                        className="relative w-fit h-fit bg-darker px-3 cursor-pointer active:scale-95 py-1"
                        onClick={() =>
                          setPurchaseAmount(
                            purchaseAmount > 0 ? purchaseAmount - 1 : 0
                          )
                        }
                      >
                        -
                      </div>
                    </div>
                  </div>
                  <div
                    className={`relative w-fif h-fit flex flex-col justify-center items-center font-earl text-sm px-1.5 py-1 bg-darker text-white ${
                      (!grantCollection[nextItem]?.grantCollectorsOnly ||
                        (grantCollection[nextItem]?.grantCollectorsOnly &&
                          canCollect)) &&
                      "cursor-pointer active:scale-95"
                    }`}
                    onClick={() =>
                      (!grantCollection[nextItem]?.grantCollectorsOnly ||
                        (grantCollection[nextItem]?.grantCollectorsOnly &&
                          canCollect)) &&
                      addItemToCart()
                    }
                  >
                    {!grantCollection[nextItem]?.grantCollectorsOnly ||
                    (grantCollection[nextItem]?.grantCollectorsOnly &&
                      canCollect)
                      ? "add to cart"
                      : "exclusive to grant collectors"}
                  </div>
                </div>
              </div>
              <div className="relative w-full h-full flex flex-row gap-4 items-end justify-end">
                <div className="relative w-full h-full flex flex-col justify-center items-start gap-2">
                  <div className="relative w-fit h-fit flex font-mega text-mazul text-sm">
                    Amount
                  </div>
                  <div className="relative w-1/4 h-8 flex items-center justify-center rounded-md border border-black font-earl">
                    <div className="absolute w-full h-full flex opacity-70">
                      <Image
                        layout="fill"
                        src={`${INFURA_GATEWAY}/Qme3dKpZyyv9oMEu9AbaS3Q3xXGcbXj5V2JXhhJW8bRfQV`}
                        draggable={false}
                      />
                    </div>
                    {grantCollection[nextItem]?.amount}
                  </div>
                </div>
                <div className="relative w-fit h-full flex items-end justify-end">
                  <div
                    className={`relative border border-black flex w-16 text-center text-sm justify-center items-center h-8 py-1.5 font-earl text-white uppercase px-3 cursor-pointer active:scale-95 bg-darker`}
                    onClick={() =>
                      setNextItem(
                        nextItem < grantCollection.length - 1 ? nextItem + 1 : 0
                      )
                    }
                  >
                    {"-->"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {!collapseNumber[index] && (
          <div className="flex absolute w-10 h-10 -bottom-3 -right-3">
            <Image
              src={`${INFURA_GATEWAY}/QmfFZs7NE11VhEMg2bf4XeuQ37mPhrEwq1XKAFzM6eyVQQ`}
              layout="fill"
              draggable={false}
            />
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default StoreFrontBox;
