import { FunctionComponent } from "react";
import { AllStoreProps, CollectionGraph } from "../types/storefront.types";
import Item from "./Item";

const AllStore: FunctionComponent<AllStoreProps> = ({
  collectionsLoading,
  allCollections,
  router,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-row flex-wrap gap-5">
      {allCollections?.map((collection: CollectionGraph, index: number) => {
        return <Item collection={collection} key={index} router={router} />;
      })}
    </div>
  );
};

export default AllStore;
