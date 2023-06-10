import { NextPage } from "next";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Head from "next/head";
import { INFURA_GATEWAY } from "@/lib/constants";

const Collection: NextPage = (): JSX.Element => {
  const chosenCollection = useSelector(
    (state: RootState) => state.app.chosenCollectionReducer.value
  );
  return (
    <div className="relative h-fit w-full bg-black/70 grid grid-flow-col auto-col-auto overflow-hidden">
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
      <div></div>
    </div>
  );
};

export default Collection;
