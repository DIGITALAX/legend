import { useDispatch, useSelector } from "react-redux";
import CreateDrop from "./CreateDrop";
import { FunctionComponent } from "react";
import { RootState } from "@/redux/store";
import useStorefront from "@/components/Launch/hooks/useStorefront";

const Modals: FunctionComponent = (): JSX.Element => {
  const dispatch = useDispatch();
  const dropModal = useSelector(
    (state: RootState) => state.app.dropModalReducer
  );
  const storefrontValues = useSelector(
    (state: RootState) => state.app.storefrontValuesReducer.value
  );
  const { dropLoading, createDrop } = useStorefront();

  return (
    <>
      {dropModal.value && (
        <CreateDrop
          dispatch={dispatch}
          message={dropModal.message}
          createDrop={createDrop}
          dropLoading={dropLoading}
          storefrontValues={storefrontValues}
        />
      )}
    </>
  );
};

export default Modals;
