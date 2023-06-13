import { useDispatch, useSelector } from "react-redux";
import CreateDrop from "./CreateDrop";
import { FunctionComponent } from "react";
import { RootState } from "@/redux/store";
import useStorefront from "@/components/Launch/hooks/useStorefront";
import ImageViewer from "./ImageViewer";
import CollectInfo from "./CollectInfo";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import useMainGrant from "@/components/Home/Grant/hooks/useMainGrant";
import useSignIn from "@/components/Layout/hooks/useSignIn";
import { useAccount } from "wagmi";

const Modals: FunctionComponent = (): JSX.Element => {
  const dispatch = useDispatch();
  const dropModal = useSelector(
    (state: RootState) => state.app.dropModalReducer
  );
  const storefrontValues = useSelector(
    (state: RootState) => state.app.storefrontValuesReducer.value
  );
  const collectModuleValues = useSelector(
    (state: RootState) => state.app.commentCollectReducer
  );
  const imageViewer = useSelector(
    (state: RootState) => state.app.imageViewerReducer
  );
  const collectInfoModal = useSelector(
    (state: RootState) => state.app.collectInfoReducer
  );
  const lensProfile = useSelector(
    (state: RootState) => state.app.profileReducer.profile?.id
  );
  const { address } = useAccount();
  const { dropLoading, createDrop } = useStorefront();
  const {
    collectInfoLoading,
    approvalLoading,
    collectCommentLoading,
    approveCurrency,
    collectGrant,
    collectLoading,
  } = useMainGrant();
  const { openConnectModal } = useConnectModal();
  const { handleLensSignIn } = useSignIn();

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
      {collectInfoModal.open && (
        <CollectInfo
          collectInfoLoading={collectInfoLoading}
          approvalLoading={approvalLoading}
          address={address}
          collectModuleValues={collectModuleValues}
          lensProfile={lensProfile}
          collectComment={collectGrant}
          collectLoading={collectCommentLoading[collectInfoModal?.index!]}
          approveCurrency={approveCurrency}
          handleLensSignIn={handleLensSignIn}
          commentId={collectInfoModal?.id}
          dispatch={dispatch}
          openConnectModal={openConnectModal}
        />
      )}
    </>
  );
};

export default Modals;
