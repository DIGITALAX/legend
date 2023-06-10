import { useDispatch, useSelector } from "react-redux";
import CreateDrop from "./CreateDrop";
import { FunctionComponent } from "react";
import { RootState } from "@/redux/store";
import useStorefront from "@/components/Launch/hooks/useStorefront";
import ImageViewer from "./ImageViewer";

const Modals: FunctionComponent = (): JSX.Element => {
  const dispatch = useDispatch();
  const dropModal = useSelector(
    (state: RootState) => state.app.dropModalReducer
  );
  const storefrontValues = useSelector(
    (state: RootState) => state.app.storefrontValuesReducer.value
  );
  const imageViewer = useSelector(
    (state: RootState) => state.app.imageViewerReducer
  );
  const { dropLoading, createDrop } = useStorefront();

  return (
    <>
      {imageViewer.value && (
        <ImageViewer dispatch={dispatch} mainImage={imageViewer.image} />
      )}
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
