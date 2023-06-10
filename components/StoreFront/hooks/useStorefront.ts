import { getCollections } from "@/graphql/subgraph/query/getAllCollections";
import fetchIPFSJSON from "@/lib/lens/helpers/fetchIPFSJSON";
import { FormEvent, useEffect, useState } from "react";
import { CollectionGraph } from "../types/storefront.types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setAllCollections } from "@/redux/reducers/allCollectionsSlice";
import { getAllDrops } from "@/graphql/subgraph/query/getAllDrops";
import { setAllDrops } from "@/redux/reducers/allDropsSlice";
import getDefaultProfile from "@/graphql/lens/query/getDefaultProfile";
import { setFilters } from "@/redux/reducers/filtersSlice";

const useStorefront = () => {
  const dispatch = useDispatch();
  const collectionsDispatched = useSelector(
    (state: RootState) => state.app.allCollectionsReducer.value
  );
  const filters = useSelector((state: RootState) => state.app.filtersReducer);
  const [collectionsLoading, setCollectionsLoading] = useState<boolean>(false);

  const getAllCollections = async () => {
    setCollectionsLoading(true);
    try {
      const data = await getCollections();
      if (
        !data ||
        data?.data?.collectionMinteds?.length < 1 ||
        !data?.data?.collectionMinteds
      ) {
        setCollectionsLoading(false);
        return;
      }

      const drops = await getAllDrops();
      dispatch(setAllDrops(drops?.data?.dropCreateds));

      const validCollections = [...data?.data?.collectionMinteds].filter(
        (collection: CollectionGraph) => {
          const collectionDrops = [...drops?.data?.dropCreateds]?.filter(
            (drop: any) =>
              drop?.collectionIds?.includes(collection.collectionId)
          );
          return collectionDrops.length > 0;
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
                collectionDrops[0]?.dropURI
                  ?.split("ipfs://")[1]
                  ?.replace(/"/g, "")
                  ?.trim()
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
      dispatch(setAllCollections(collections));
    } catch (err: any) {
      console.error(err.message);
    }
    setCollectionsLoading(false);
  };

  const handleFindGrant = (e: FormEvent) => {
    dispatch(
      setFilters({
        actionPrint: filters.print,
        actionGrant: (e.target as HTMLFormElement).value,
        actionTimestamp: filters.timestamp,
        actionPrice: filters.price,
        actionTokens: filters.tokens,
        actionDiscount: filters.discount,
        actionCollectors: filters.collectors,
      })
    );
  };

  useEffect(() => {
    if (collectionsDispatched.length < 1) {
      getAllCollections();
    }
  }, [collectionsDispatched]);

  return {
    collectionsLoading,
    handleFindGrant,
  };
};

export default useStorefront;
