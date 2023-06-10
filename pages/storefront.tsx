import useStorefront from "@/components/StoreFront/hooks/useStorefront";
import AllStore from "@/components/StoreFront/modules/AllStore";
import Filters from "@/components/StoreFront/modules/Filters";
import { RootState } from "@/redux/store";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

const StoreFront: NextPage = (): JSX.Element => {
  const { collectionsLoading, handleFindGrant } = useStorefront();
  const router = useRouter();
  const dispatch = useDispatch();
  const allCollections = useSelector(
    (state: RootState) => state.app.allCollectionsReducer.value
  );
  const filterValues = useSelector(
    (state: RootState) => state.app.filtersReducer
  );
  return (
    <div className="relative w-full h-full flex flex-row pt-10 px-6 gap-8 justify-center">
      <Filters
        dispatch={dispatch}
        filterValues={filterValues}
        handleFindGrant={handleFindGrant}
      />
      <AllStore
        router={router}
        collectionsLoading={collectionsLoading}
        allCollections={allCollections}
        filterValues={filterValues}
      />
    </div>
  );
};

export default StoreFront;
