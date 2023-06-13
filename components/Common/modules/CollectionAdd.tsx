import { FormEvent, FunctionComponent } from "react";
import Draggable from "react-draggable";
import TopBarTwo from "./TopBarTwo";
import Image from "next/legacy/image";
import { ACCEPTED_TOKENS_MUMBAI, INFURA_GATEWAY } from "@/lib/constants";
import { CollectionAddProps } from "../types/common.types";
import { AiOutlineLoading } from "react-icons/ai";

const CollectionAdd: FunctionComponent<CollectionAddProps> = ({
  deleteFunction,
  position,
  editionAmount,
  productInformation,
  handleTitle,
  handleDescription,
  handleCollectionPrices,
  handleEditionAmount,
  index,
  imageLoading,
  handleImageUpload,
  minted,
  collectionLoading,
  mintCollection,
  handleDiscount,
  handleGrantOnly,
  handlePrintType,
}): JSX.Element => {
  return (
    <Draggable enableUserSelectHack={false}>
      <div
        className={`${
          position ? "absolute" : "relative"
        } w-80 h-fit flex gap-3 bg-white border-2 border-mazul cursor-grab active:cursor-grabbing `}
        style={{
          top: `${position && position.y}px`,
          right: `${position && position.x}px`,
        }}
      >
        <div className="relative w-full h-full items-center flex flex-col">
          <TopBarTwo deleteFunction={deleteFunction} />
          <div className="p-2 flex w-full h-full flex-col gap-3 items-center">
            <label
              className="w-full h-52 border border-black bg-mist items-center justify-center flex cursor-pointer"
              onChange={(e: FormEvent) => handleImageUpload(e, index)}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {imageLoading[index] ? (
                  <div className="relative w-fit h-fit animate-spin flex items-center justify-center">
                    <AiOutlineLoading size={15} color="white" />
                  </div>
                ) : productInformation?.uri?.image ? (
                  <Image
                    layout="fill"
                    src={`${INFURA_GATEWAY}/${productInformation?.uri?.image}`}
                    draggable={false}
                    objectFit="cover"
                  />
                ) : (
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/QmV4pRmrrve6j3n5p8yTpgTcstxggh2Vz48GRg7ryZreNh`}
                      draggable={false}
                    />
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/png"
                hidden
                required
                id="files"
                multiple={false}
                name="images"
                className="caret-transparent"
                disabled={imageLoading[index] || minted[index] ? true : false}
              />
            </label>
            <div className="relative w-full h-full flex flex-row gap-2 items-end">
              <div className="relative w-full h-full flex flex-col justify-center items-start gap-2">
                <div className="relative w-fit justify-start h-fit flex font-mega text-mazul text-lg whitespace-nowrap break-words">
                  Name of Collection
                </div>
                <div className="relative w-full h-8 flex items-center justify-center rounded-md border border-black">
                  <div className="absolute w-full h-full flex opacity-70">
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/Qme3dKpZyyv9oMEu9AbaS3Q3xXGcbXj5V2JXhhJW8bRfQV`}
                      draggable={false}
                    />
                  </div>
                  <textarea
                    className="relative w-full h-full flex p-2 text-black font-earl text-sm bg-transparent rounded-md"
                    style={{ resize: "none" }}
                    onChange={(e: FormEvent) => handleTitle(e, index)}
                    defaultValue={productInformation.uri.name}
                    disabled={minted[index]}
                  ></textarea>
                </div>
              </div>
              <div className="relative w-fit h-full flex flex-col justify-end items-end gap-2">
                <div className="relative w-fit h-fit flex font-mega text-mazul text-xs">
                  Amount
                </div>
                <div className="relative w-full h-8 flex items-center justify-center rounded-md border border-black">
                  <div className="absolute w-full h-full flex opacity-70">
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/Qme3dKpZyyv9oMEu9AbaS3Q3xXGcbXj5V2JXhhJW8bRfQV`}
                      draggable={false}
                    />
                  </div>
                  <input
                    className="relative w-full h-full flex p-2 text-black font-earl text-sm bg-transparent rounded-md"
                    style={{ resize: "none" }}
                    type="number"
                    defaultValue={editionAmount}
                    onChange={(e: FormEvent) => handleEditionAmount(e, index)}
                    disabled={minted[index]}
                  />
                </div>
              </div>
            </div>
            <div className="relative w-full h-full flex flex-col justify-center items-start gap-2">
              <div className="relative w-fit h-fit flex font-mega text-mazul text-sm">
                Description
              </div>
              <div className="relative w-full h-14 flex items-center justify-center rounded-md border border-black">
                <div className="absolute w-full h-full flex opacity-70">
                  <Image
                    layout="fill"
                    src={`${INFURA_GATEWAY}/Qme3dKpZyyv9oMEu9AbaS3Q3xXGcbXj5V2JXhhJW8bRfQV`}
                    draggable={false}
                  />
                </div>
                <textarea
                  className="relative w-full h-full flex p-2 text-black font-earl text-sm bg-transparent rounded-md"
                  style={{ resize: "none" }}
                  onChange={(e: FormEvent) => handleDescription(e, index)}
                  defaultValue={productInformation.uri.description}
                  disabled={minted[index]}
                ></textarea>
              </div>
            </div>
            <div className="relative grid grid-cols-4 gap-2 w-full h-fit font-earl">
              {ACCEPTED_TOKENS_MUMBAI
                .map((item: string[]) => {
                  if (
                    productInformation?.acceptedTokens?.includes(
                      item[1].toLowerCase()
                    )
                  ) {
                    const acceptedTokenIndex =
                      productInformation?.acceptedTokens?.findIndex(
                        (token: string) =>
                          token.toLowerCase() === item[1].toLowerCase()
                      );

                    return {
                      ...item,
                      price: String(
                        productInformation?.basePrices?.[acceptedTokenIndex]
                      ),
                    };
                  } else {
                    return {
                      ...item,
                      price: "",
                    };
                  }
                })
                .map((value: string[], indexTwo: number) => {
                  let price;
                  if (
                    productInformation?.acceptedTokens?.includes(
                      value[1].toLowerCase()
                    )
                  ) {
                    const acceptedTokenIndex =
                      productInformation?.acceptedTokens?.findIndex(
                        (token: string) =>
                          token.toLowerCase() === value[1].toLowerCase()
                      );

                    price = String(
                      productInformation?.basePrices?.[acceptedTokenIndex]
                    );
                  }

                  return (
                    <div
                      key={indexTwo}
                      className="relative w-full h-fit flex flex-col gap-1 items-center justify-start"
                    >
                      <div className="relative flex flex-row gap-1 w-full h-fit items-center">
                        <div className="relative w-4 h-5 flex rounded-full items-center justify-center">
                          <Image
                            src={`${INFURA_GATEWAY}/${value[2]}`}
                            draggable={false}
                            layout="fill"
                            className="flex"
                          />
                        </div>
                        <div className="relative w-fit h-full flex items-center justify-start text-xs">
                          <div className="relative flex w-full h-full items-center top-px">
                            {value[0]}
                          </div>
                        </div>
                      </div>
                      <div className="relative w-full h-8 flex items-center justify-center rounded-md border border-black">
                        <div className="absolute w-full h-full flex opacity-70">
                          <Image
                            layout="fill"
                            src={`${INFURA_GATEWAY}/Qme3dKpZyyv9oMEu9AbaS3Q3xXGcbXj5V2JXhhJW8bRfQV`}
                            draggable={false}
                          />
                        </div>
                        <input
                          className="relative w-full h-full flex p-2 text-black font-earl text-sm bg-transparent rounded-md"
                          style={{ resize: "none" }}
                          type="number"
                          onChange={(e: FormEvent) =>
                            handleCollectionPrices(e, value[1], index)
                          }
                          defaultValue={price}
                          disabled={minted[index]}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="relative w-full h-full flex flex-row gap-4 justify-start">
              <div className="relative w-fit h-full flex flex-col justify-center items-start gap-2">
                <div className="relative w-fit h-fit flex font-earl text-mazul text-xs">
                  Print Type
                </div>
                <div className="relative w-full h-fit flex flex-row gap-1">
                  {Array.from([
                    [
                      "QmaZtrnJTEFFjDHn32ABFhzafakP8o9D3yMFfX2GZuvWLe",
                      "poster",
                    ],
                    [
                      "QmdBGb4C82EMpi7NxSpuCgTmaVYKsWBdao41GJoQoawX6G",
                      "sticker",
                    ],
                    ["QmYdNGhxLN5hHhi8r3QLKd232fEzW97dia58RZog8yqFSw", "shirt"],
                    [
                      "QmdiRJUu3xxEhGZbbRusMUJ8ffStRZeackYRAt8avpd5dn",
                      "jacket",
                    ],
                    [
                      "QmXVFuiHYe5k1J5qvgkMqNbgTKe5ZaP7PoByDKZ98cTFcQ",
                      "longsleeve",
                    ],
                    [
                      "QmcTwmM6LihAEFb8JjPBK2nrVaP3fjf8jwDMsXbwMyNTtn",
                      "hoodie",
                    ],
                  ]).map((image: string[], indexTwo: number) => {
                    return (
                      <div
                        className={`rounded-md relative border border-black flex w-full text-center text-sm justify-center items-center h-fit py-1.5 font-earl text-white uppercase px-2  ${
                          productInformation.printType === image[1]
                            ? "bg-blez"
                            : "bg-mist"
                        } ${
                          !minted[index] && "cursor-pointer active:scale-95"
                        }`}
                        key={indexTwo}
                        onClick={() =>
                          !minted[index] && handlePrintType(image[1], index)
                        }
                      >
                        <div className="relative w-6 h-6 flex items-center justify-center">
                          <Image
                            src={`${INFURA_GATEWAY}/${image[0]}`}
                            layout="fill"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="relative w-full h-full flex flex-row gap-4 items-end justify-end">
              <div className="relative w-fit h-full flex flex-col justify-center items-start gap-2">
                <div className="relative w-fit h-fit flex font-earl text-mazul text-xs">
                  Grant Collectors Only
                </div>
                <div
                  className={`rounded-md relative border border-black flex w-full text-center text-sm justify-center items-center h-fit py-1.5 font-earl text-white uppercase px-3  ${
                    productInformation.grantOnly
                      ? "bg-darker"
                      : "bg-blez opacity-70"
                  } ${!minted[index] && "cursor-pointer active:scale-95"}`}
                  onClick={(e: FormEvent) =>
                    !minted[index] && handleGrantOnly(e, index)
                  }
                >
                  {productInformation.grantOnly ? "yes" : "no"}
                </div>
              </div>
              <div className="relative w-fit h-full flex flex-col justify-center items-start gap-2">
                <div className="relative w-fit h-fit flex font-earl text-mazul text-xs">
                  Grant Collectors Discount %
                </div>
                <div className="relative w-full h-8 flex items-center justify-center rounded-md border border-black">
                  <div className="absolute w-full h-full flex opacity-70">
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/Qme3dKpZyyv9oMEu9AbaS3Q3xXGcbXj5V2JXhhJW8bRfQV`}
                      draggable={false}
                    />
                  </div>
                  <input
                    className="relative w-full h-full flex p-2 text-black font-earl text-sm bg-transparent rounded-md"
                    style={{ resize: "none" }}
                    type="number"
                    defaultValue={productInformation.discount}
                    onChange={(e: FormEvent) => handleDiscount(e, index)}
                    disabled={minted[index]}
                  />
                </div>
              </div>
            </div>
            <div className="relative w-full h-full flex flex-row gap-4 items-end justify-end">
              <div className="relative w-fit h-full flex items-end justify-end">
                <div
                  className={`relative border border-black flex w-16 text-center text-sm justify-center items-center h-8 py-1.5 font-earl text-white uppercase px-3 ${
                    !minted[index] &&
                    productInformation.uri.name !== "" &&
                    productInformation.basePrices.length > 0 &&
                    productInformation.uri.description !== "" &&
                    productInformation.uri.image !== "" &&
                    productInformation.amount !== 0
                      ? "cursor-pointer active:scale-95 bg-darker"
                      : minted[index]
                      ? "bg-mal"
                      : "bg-blez opacity-70"
                  }`}
                  onClick={() =>
                    !minted[index] &&
                    productInformation.uri.name !== "" &&
                    productInformation.basePrices.length > 0 &&
                    productInformation.uri.description !== "" &&
                    productInformation.uri.image !== "" &&
                    productInformation.amount !== 0 &&
                    mintCollection(index)
                  }
                >
                  {collectionLoading[index] ? (
                    <div className="animate-spin w-fit h-fit">
                      <AiOutlineLoading color="white" size={15} />
                    </div>
                  ) : !minted[index] ? (
                    "mint"
                  ) : (
                    "minted"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default CollectionAdd;
