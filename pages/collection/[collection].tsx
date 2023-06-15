import { NextPage } from "next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Head from "next/head";
import { ACCEPTED_TOKENS_MUMBAI, INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import lodash from "lodash";
import createProfilePicture from "@/lib/lens/helpers/createProfilePicture";
import { setImageViewer } from "@/redux/reducers/imageViewerSlice";
import Draggable from "react-draggable";
import useFulfillment from "@/components/StoreFront/hooks/useFulfillment";
import { setError } from "@/redux/reducers/errorSlice";

const Collection: NextPage = (): JSX.Element => {
  const chosenCollection = useSelector(
    (state: RootState) => state.app.chosenCollectionReducer.value
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartItemsReducer.value
  );
  const dispatch = useDispatch();
  const profile = createProfilePicture(chosenCollection?.profile);
  const {
    currency,
    setCurrency,
    size,
    setSize,
    canCollect,
    baseColor,
    setBaseColor,
    addItemToCart,
    setPurchaseAmount,
    purchaseAmount,
    setPurchasePrice,
  } = useFulfillment();
  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
      <Head>
        <title>{chosenCollection?.uri.name}</title>
        <meta
          name="og:url"
          content={`https://legend.irrevocable.xyz/collection/${chosenCollection?.collectionId}`}
        />
        <meta name="og:title" content={chosenCollection?.uri.name} />
        <meta
          name="og:description"
          content={chosenCollection?.uri.description}
        />
        <meta
          name="og:image"
          content={`${INFURA_GATEWAY}/${
            chosenCollection?.uri.image?.split("ipfs://")[1]
          }`}
        />
        <meta name="twitter:card" content="summary" />
        <meta
          name="og:url"
          content={`https://legend.irrevocable.xyz/collection/${chosenCollection?.collectionId}`}
        />
        <meta
          name="og:image"
          content={`${INFURA_GATEWAY}/${
            chosenCollection?.uri.image?.split("ipfs://")[1]
          }`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@digitalax" />
        <meta name="twitter:creator" content="@digitalax" />
        <meta
          name="twitter:image"
          content={`${INFURA_GATEWAY}/${
            chosenCollection?.uri.image?.split("ipfs://")[1]
          }`}
        />
        <meta
          name="twitter:url"
          content={`${INFURA_GATEWAY}/${
            chosenCollection?.uri.image?.split("ipfs://")[1]
          }`}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="canonical"
          content={`${INFURA_GATEWAY}/${
            chosenCollection?.uri.image?.split("ipfs://")[1]
          }`}
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/vcr.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="/fonts/EarlsRevenge.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="/fonts/MegamaxJones.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
      </Head>
      <div className="relative w-full h-full flex flex-row items-center justify-center gap-4">
        <Draggable enableUserSelectHack={false}>
          <div
            className={`relative w-80 flex drop-shadow-2xl h-100 cursor-grab active:cursor-grabbing`}
          >
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/QmbpFBk93UDXB5PKLhhXbn6tNKG1XDUJjS6SiSeG7S2GMB`}
              className="w-full h-full flex relative"
              draggable={false}
            />
            <div className="flex absolute w-full h-full h-4 top-1 left-0 p-3 flex flex-col gap-3">
              <div className="relative w-fit h-fit flex items-center justify-center flex-row gap-2">
                <div className="relative w-6 h-6 rounded-full bg-darker border border-black">
                  <Image
                    src={profile}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                    draggable={false}
                  />
                </div>
                <div className="relative text-black font-mega text-sm">
                  @{chosenCollection?.profile?.handle}
                </div>
              </div>
              <div className="relative w-full items-start justify-center flex h-fit break-words font-earl text-sm text-left text-black">
                {chosenCollection?.profile?.bio}
              </div>
              <div className="relative w-full items-start justify-center flex h-fit break-words font-earl text-sm text-black">
                {chosenCollection?.grantName}
              </div>
              <div className="relative w-full items-start justify-center flex h-fit break-words font-earl text-sm text-black">
                {!chosenCollection?.soldTokens ||
                chosenCollection?.soldTokens.length < 1
                  ? `0/${chosenCollection?.tokenIds?.length}`
                  : `${chosenCollection?.soldTokens?.length}/${chosenCollection?.tokenIds.length}`}
              </div>
              <div className="relative w-full h-fit justify-center items-center flex gap-2 flex-row">
                <div className="relative w-fit h-fit font-mega">
                  {chosenCollection?.printType}
                </div>
                <div className="relative w-7 h-7 items-center justify-center flex border border-white bg-darker rounded-full p-1.5">
                  <div className="relative w-full h-full">
                    <Image
                      src={`${INFURA_GATEWAY}/${
                        lodash.find(
                          [
                            [
                              "QmaZtrnJTEFFjDHn32ABFhzafakP8o9D3yMFfX2GZuvWLe",
                              "poster",
                            ],
                            [
                              "QmdBGb4C82EMpi7NxSpuCgTmaVYKsWBdao41GJoQoawX6G",
                              "sticker",
                            ],
                            [
                              "QmYdNGhxLN5hHhi8r3QLKd232fEzW97dia58RZog8yqFSw",
                              "shirt",
                            ],
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
                          ],
                          ["1", chosenCollection?.printType]
                        )?.[0]
                      }`}
                      layout="fill"
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
              <div className="relative w-full items-start justify-center flex h-fit break-words font-earl text-sm text-left text-black">
                Fulfiller Details
              </div>
            </div>
          </div>
        </Draggable>
        <div
          className="relative w-128 h-100 rounded-md bg-gris flex flex-col p-3 gap-5 cursor-pointer"
          onClick={() => {
            dispatch(
              setImageViewer({
                actionValue: true,
                actionImage: chosenCollection?.uri.image,
              })
            );
          }}
        >
          <div className="relative w-full h-full border-2 border-rosa">
            <Image
              src={`${INFURA_GATEWAY}/${chosenCollection?.uri?.image}`}
              layout="fill"
              objectFit="cover"
              draggable={false}
            />
            {chosenCollection?.grantCollectorsOnly && (
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
            <div className="absolute w-fit h-fit bottom-2 right-2">
              <div className="relative w-7 h-7 items-center justify-center flex border border-white bg-darker rounded-full p-1.5">
                <div className="relative w-full h-full">
                  <Image
                    src={`${INFURA_GATEWAY}/${
                      lodash.find(
                        [
                          [
                            "QmaZtrnJTEFFjDHn32ABFhzafakP8o9D3yMFfX2GZuvWLe",
                            "poster",
                          ],
                          [
                            "QmdBGb4C82EMpi7NxSpuCgTmaVYKsWBdao41GJoQoawX6G",
                            "sticker",
                          ],
                          [
                            "QmYdNGhxLN5hHhi8r3QLKd232fEzW97dia58RZog8yqFSw",
                            "shirt",
                          ],
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
                        ],
                        ["1", chosenCollection?.printType]
                      )?.[0]
                    }`}
                    layout="fill"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="relative bg-purp border-2 border-rosa w-full h-16 py-1 px-2 flex flex-row gap-3">
            <div className="relative w-full h-full flex flex-col gap-1 justify-center items-center">
              <div className="font-mega text-white text-xl">
                {chosenCollection?.uri.name}
              </div>
              <div className="relative w-fit h-60 text-sm font-mega text-white/80 overflow-y-scroll flex justify-start items-start">
                {chosenCollection?.uri.description}
              </div>
            </div>
          </div>
        </div>
        <Draggable enableUserSelectHack={false}>
          <div
            className={`relative w-80 flex drop-shadow-2xl h-100 cursor-grab active:cursor-grabbing`}
          >
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/QmbpFBk93UDXB5PKLhhXbn6tNKG1XDUJjS6SiSeG7S2GMB`}
              className="w-full h-full flex relative"
              draggable={false}
            />
            <div className="flex absolute w-full h-full h-4 top-1 left-0 p-3 flex-col gap-3">
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
              {chosenCollection?.discount && chosenCollection?.discount > 0 && (
                <div className="relative flex flex-col w-full h-fit gap-1.5 font-mega text-black">
                  <div className="relative w-fit h-fit font-mega text-sm">
                    Grant Collector Discount
                  </div>
                  <div className="w-full h-fit relative flex flex-wrap gap-2">
                    {chosenCollection?.discount}%
                  </div>
                </div>
              )}
              <div className="relative w-full h-fit flex justify-center items-center gap-2">
                {ACCEPTED_TOKENS_MUMBAI.map((token) => {
                  const tokenIndex: number =
                    chosenCollection?.acceptedTokens.indexOf(token[1].toLowerCase())!;
                  if (tokenIndex !== -1) {
                    return {
                      ...token,
                      price: chosenCollection?.basePrices[tokenIndex],
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
              {chosenCollection?.grantCollectorsOnly && (
                <div className="relative w-fif h-fit flex flex-col justify-center items-center font-mega text-black text-sm">
                  exclusive to grant collectors
                </div>
              )}
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
                        const collectionId = chosenCollection?.collectionId;
                        let existingAmount = 0;

                        carts.forEach((item) => {
                          if (item.collectionId === collectionId) {
                            existingAmount += item.purchaseAmount;
                          }
                        });

                        let purchaseAmountValue = purchaseAmount;

                        if (
                          purchaseAmount + 1 + existingAmount <=
                          chosenCollection?.tokenIds.length!
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
                    (!chosenCollection?.grantCollectorsOnly ||
                      (chosenCollection?.grantCollectorsOnly && canCollect)) &&
                    "cursor-pointer active:scale-95"
                  }`}
                  onClick={() =>
                    (!chosenCollection?.grantCollectorsOnly ||
                      (chosenCollection?.grantCollectorsOnly && canCollect)) &&
                    addItemToCart()
                  }
                >
                  {!chosenCollection?.grantCollectorsOnly ||
                  (chosenCollection?.grantCollectorsOnly && canCollect)
                    ? "add to cart"
                    : "exclusive to grant collectors"}
                </div>
              </div>
            </div>
          </div>
        </Draggable>
      </div>
    </div>
  );
};

export default Collection;
