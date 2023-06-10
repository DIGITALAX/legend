import { FunctionComponent, useMemo } from "react";
import { AllStoreProps, CollectionGraph } from "../types/storefront.types";
import Item from "./Item";

const AllStore: FunctionComponent<AllStoreProps> = ({
  collectionsLoading,
  allCollections,
  router,
  filterValues,
}): JSX.Element => {
  const filteredCollections = useMemo(() => {
    let filtered = [...allCollections];

    if (filterValues.grant) {
      filtered = filtered.filter((collection) =>
        collection.grantName
          .toLowerCase()
          .startsWith(filterValues.grant!.toLowerCase())
      );
    }

    if (filterValues.tokens.length > 0) {
      filtered = filtered.filter((collection) =>
        filterValues.tokens.some((token) =>
          collection.acceptedTokens.some(
            (acceptedToken) =>
              acceptedToken.toLowerCase() === token.toLowerCase()
          )
        )
      );
    }
    if (filterValues.print.length > 0) {
      filtered = filtered.filter((collection) =>
        filterValues.print.includes(collection.printType)
      );
    }

    if (filterValues.timestamp) {
      filtered = filtered.sort((a, b) => a.blockTimestamp - b.blockTimestamp);
    } else {
      filtered = filtered.sort((a, b) => b.blockTimestamp - a.blockTimestamp);
    }

    if (!filterValues.collectors) {
      filtered = filtered.filter(
        (collection) => collection.grantCollectorsOnly
      );
    }

    if (!filterValues.discount) {
      filtered = filtered.filter((collection) => collection.discount > 0);
    }

    return filtered;
  }, [allCollections, filterValues]);

  return (
    <div className="relative w-full h-fit flex flex-row flex-wrap gap-5 justify-center">
      {filteredCollections?.map(
        (collection: CollectionGraph, index: number) => {
          return <Item collection={collection} key={index} router={router} />;
        }
      )}
    </div>
  );
};

export default AllStore;
