import useStorefront from "@/components/StoreFront/hooks/useStorefront";
import AllStore from "@/components/StoreFront/modules/AllStore";
import Filters from "@/components/StoreFront/modules/Filters";
import { RootState } from "@/redux/store";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const StoreFront: NextPage = (): JSX.Element => {
  const { collectionsLoading } = useStorefront();
  const router = useRouter();
  const allCollections = useSelector(
    (state: RootState) => state.app.allCollectionsReducer.value
  );
  return (
    <div className="relative w-full h-full flex flex-row pt-10 px-6">
      <Filters />
      <AllStore
        router={router}
        collectionsLoading={collectionsLoading}
        allCollections={allCollections}
      />
    </div>
  );
};

export default StoreFront;
