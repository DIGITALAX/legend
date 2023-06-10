import { NextPage } from "next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Head from "next/head";
import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import lodash from "lodash";
import createProfilePicture from "@/lib/lens/helpers/createProfilePicture";
import { setImageViewer } from "@/redux/reducers/imageViewerSlice";
import Draggable from "react-draggable";

const Collection: NextPage = (): JSX.Element => {
  const chosenCollection = useSelector(
    (state: RootState) => state.app.chosenCollectionReducer.value
  );
  const dispatch = useDispatch();
  const profile = createProfilePicture(chosenCollection?.profile);
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
            chosenCollection?.uri.image.split("ipfs://")[1]
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
            chosenCollection?.uri.image.split("ipfs://")[1]
          }`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@digitalax" />
        <meta name="twitter:creator" content="@digitalax" />
        <meta
          name="twitter:image"
          content={`${INFURA_GATEWAY}/${
            chosenCollection?.uri.image.split("ipfs://")[1]
          }`}
        />
        <meta
          name="twitter:url"
          content={`${INFURA_GATEWAY}/${
            chosenCollection?.uri.image.split("ipfs://")[1]
          }`}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="canonical"
          content={`${INFURA_GATEWAY}/${
            chosenCollection?.uri.image.split("ipfs://")[1]
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
        <Draggable enableUserSelectHack={false} cancel=".stopDrag">
          <div
            className={`relative w-80 flex drop-shadow-2xl h-100 cursor-grab active:cursor-grabbing`}
          >
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/QmbpFBk93UDXB5PKLhhXbn6tNKG1XDUJjS6SiSeG7S2GMB`}
              className="w-full h-full flex relative"
              draggable={false}
            />
            <div className="stopDrag flex absolute w-full h-4 top-1 left-0 px-3 cursor-pointer"></div>
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
            <div className="relative w-fit h-full flex items-center justify-center">
              <div className="relative w-6 h-6 rounded-full bg-darker border border-white">
                <Image
                  src={profile}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
            </div>
            <div className="relative w-full h-full flex flex-col gap-1">
              <div className="font-mega text-white">
                {chosenCollection?.uri.name}
              </div>
              <div className="font-mega text-white text-xxs">
                {chosenCollection?.grantName}
              </div>
            </div>
          </div>
        </div>
        <Draggable enableUserSelectHack={false} cancel=".stopDrag">
          <div
            className={`relative w-80 flex drop-shadow-2xl h-100 cursor-grab active:cursor-grabbing`}
          >
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/QmbpFBk93UDXB5PKLhhXbn6tNKG1XDUJjS6SiSeG7S2GMB`}
              className="w-full h-full flex relative"
              draggable={false}
            />
            <div className="stopDrag flex absolute w-full h-4 top-1 left-0 px-3 cursor-pointer"></div>
          </div>
        </Draggable>
      </div>
    </div>
  );
};

export default Collection;
