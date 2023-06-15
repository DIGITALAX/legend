import { CollectionGraph } from "@/components/StoreFront/types/storefront.types";
import getDefaultProfile from "@/graphql/lens/query/getDefaultProfile";
import { getCollectionsGrant } from "@/graphql/subgraph/query/getAllCollections";
import { getAllDrops } from "@/graphql/subgraph/query/getAllDrops";
import { ACCEPTED_TOKENS_MUMBAI } from "@/lib/constants";
import fetchIPFSJSON from "@/lib/lens/helpers/fetchIPFSJSON";
import { setCartItems } from "@/redux/reducers/cartItemsSlice";
import { setError } from "@/redux/reducers/errorSlice";
import { setGrantCollection } from "@/redux/reducers/grantCollectionSlice";
import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount, useContractRead } from "wagmi";
import DynamicNFTABI from "./../../../../abi/DynamicNFT.json";

const useStore = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { address } = useAccount();
  const grantCollection = useSelector(
    (state: RootState) => state.app.grantCollectionReducer.value
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartItemsReducer.value
  );
  const homeGrant = useSelector(
    (state: RootState) => state.app.homeGrantReducer.value
  );

  const [nextItem, setNextItem] = useState<number>(0);
  const [storeLoading, setStoreLoading] = useState<boolean>(false);
  const [baseColor, setBaseColor] = useState<string>("blue");
  const [canCollect, setCanCollect] = useState<boolean>(true);
  const [purchaseAmount, setPurchaseAmount] = useState<number>(0);
  const [purchasePrice, setPurchasePrice] = useState<string>("0");
  const [size, setSize] = useState<string>("m");
  const [currency, setCurrency] = useState<string>(
    ACCEPTED_TOKENS_MUMBAI.filter(
      (token) =>
        token[1]?.toLowerCase() ===
        grantCollection[nextItem]?.acceptedTokens?.[0]?.toLowerCase()
    )?.[0]?.[0] ?? "MONA"
  );

  const { data: canCollectData } = useContractRead({
    address: grantCollection[nextItem]?.dynamicNFTAddress as `0x${string}`,
    abi: DynamicNFTABI,
    functionName: "getCollectorClaimedNFT",
    args: [address as `0x${string}`],
    enabled: Boolean(grantCollection[nextItem]?.dynamicNFTAddress),
  });

  const getGrantStore = async () => {
    try {
      setStoreLoading(true);
      const data = await getCollectionsGrant(homeGrant?.name as string);
      if (!data) {
        setStoreLoading(false);
        return;
      }
      const drops = await getAllDrops();

      const validCollections = data?.data?.collectionMinteds.filter(
        (item: CollectionGraph) => {
          return item.dropId > 0;
        }
      );

      const collections = await Promise.all(
        validCollections.map(
          async (collection: CollectionGraph, index: number) => {
            const json = await fetchIPFSJSON(
              (collection.uri as any)
                ?.split("ipfs://")[1]
                ?.replace(/"/g, "")
                ?.trim()
            );

            let collectionDrops;

            collectionDrops = drops.data.dropCreateds
              ?.filter((drop: any) =>
                drop.collectionIds?.includes(collection.collectionId)
              )
              ?.sort((a: any, b: any) => b.dropId - a.dropId);

            let dropjson;
            if (collectionDrops?.length > 0) {
              dropjson = await fetchIPFSJSON(
                collectionDrops[0]?.dropURI.includes("ipfs://")
                  ? collectionDrops[0]?.dropURI
                      ?.split("ipfs://")[1]
                      ?.replace(/"/g, "")
                      ?.trim()
                  : collectionDrops[0]?.dropURI
              );
            }
            const defaultProfile = await getDefaultProfile(collection.owner);

            return {
              ...collection,
              uri: json,
              profile: defaultProfile?.data?.defaultProfile,
              drop: {
                name: dropjson?.name,
                image: dropjson?.image,
              },
            };
          }
        )
      );
      dispatch(setGrantCollection(collections));
    } catch (err: any) {
      console.error(err.message);
    }
    setStoreLoading(false);
  };

  useEffect(() => {
    if (grantCollection?.length < 1 && homeGrant) {
      getGrantStore();
    }
  }, [grantCollection, homeGrant]);

  const addItemToCart = () => {
    let existingItemIndex = -1;
    cartItems.forEach((item, index) => {
      if (
        item.collectionId === grantCollection[nextItem]?.collectionId &&
        item.size === size &&
        item.baseColor === baseColor &&
        item.purchaseToken === currency
      ) {
        existingItemIndex = index;
      }
    });

    let updatedCartItems = cartItems.map((item, index) => {
      if (index === existingItemIndex) {
        return {
          ...item,
          purchaseAmount: item.purchaseAmount + purchaseAmount,
        };
      }
      return item;
    });

    if (existingItemIndex === -1) {
      if (
        purchaseAmount > grantCollection[nextItem]?.tokenIds.length! ||
        purchaseAmount + cartItems.length >
          grantCollection[nextItem]?.tokenIds.length!
      ) {
        dispatch(
          setError({
            actionValue: true,
            actionMessage: "Items exceed token limit.",
          })
        );
        return;
      }

      updatedCartItems.push({
        ...grantCollection[nextItem],
        purchaseToken: currency,
        purchasePrice:
          purchasePrice === "0" || !purchasePrice
            ? grantCollection[nextItem]?.basePrices[
                grantCollection[nextItem]?.acceptedTokens
                  .map((token) => token.toLowerCase())
                  .indexOf(
                    ACCEPTED_TOKENS_MUMBAI.find(
                      (value) =>
                        value[0].toLowerCase() === currency.toLowerCase()
                    )?.[1]?.toLowerCase()!
                  )
              ]
            : purchasePrice,
        purchaseAmount,
        size,
        baseColor,
      });
    }

    dispatch(setCartItems(updatedCartItems));
  };

  useEffect(() => {
    if (canCollectData !== undefined) {
      setCanCollect(canCollectData as boolean);
    }
  }, [canCollectData]);

  return {
    storeLoading,
    nextItem,
    setNextItem,
    baseColor,
    setBaseColor,
    canCollect,
    size,
    setSize,
    currency,
    setCurrency,
    purchaseAmount,
    setPurchaseAmount,
    setPurchasePrice,
    addItemToCart,
  };
};

export default useStore;
