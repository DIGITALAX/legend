import { FunctionComponent } from "react";
import PostDetails from "./PostDetails";
import { SwitchLaunchProps } from "../types/launch.types";
import Keeper from "./Keeper";
import Live from "./Live";
import Store from "./Store";
import Contracts from "./Contracts";
import usePost from "../hooks/usePost";
import Preview from "./Preview";
import ImageUploadDynamic from "./ImageUploadDynamic";
import useImageUpload from "../hooks/useImageUpload";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import useContracts from "../hooks/useContracts";

const SwitchLaunch: FunctionComponent<SwitchLaunchProps> = ({
  profile,
  page,
}): JSX.Element => {
  let action: string;
  const decideStringAction = () => {
    if (!profile?.handle) {
      action = "sign in";
    } else {
      action = String(page);
    }
    return action;
  };

  const {
    textElement,
    preElement,
    handlePostDescription,
    postLoading,
    postDescription,
    mentionProfiles,
    profilesOpen,
    caretCoord,
    handleMentionClick,
    handleKeyDownDelete,
    title,
    setTitle,
    recipients,
    setRecipients,
    editionAmount,
    setEditionAmount,
    currency,
    setCurrency,
    valueAmount,
    setValueAmount,
    setReferralFee,
    referralFee,
    enabledCurrencies,
    sustained,
    setSustained,
    involved,
    setInvolved,
    filledInAmount,
  } = usePost();

  const {
    uploadZip,
    fileUploadCount,
    fileUploadAmount,
    imagePreviews,
    zipLoading,
    currentImageIndex,
    setCurrentImageIndex,
  } = useImageUpload();

  const { createContracts, addresses, createContractsLoading } = useContracts();

  const editionDispatch = useSelector(
    (state: RootState) => state.app.postValuesReducer.value.editionAmount
  );

  switch (decideStringAction()) {
    case "5":
      return <Live />;

    case "4":
      return <Keeper />;

    case "3":
      return <Store />;

    case "2":
      return (
        <Contracts
          createContracts={createContracts}
          createContractsLoading={createContractsLoading}
          addresses={addresses}
        />
      );

    case "1":
      return (
        <ImageUploadDynamic
          zipLoading={zipLoading}
          uploadZip={uploadZip}
          fileUploadCount={fileUploadCount}
          editionAmount={editionDispatch}
          fileUploadAmount={fileUploadAmount}
          imagePreviews={imagePreviews}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex}
        />
      );

    case "sign in":
      return (
        <div className="font-earl text-white flex flex-col items-center justify-center text-center w-full h-full">
          Connect to Launch a Grant
        </div>
      );

    default:
      return (
        <div className="relative w-full h-full flex flex-row gap-3 items-center justify-center">
          <PostDetails
            textElement={textElement}
            preElement={preElement}
            handlePostDescription={handlePostDescription}
            postLoading={postLoading}
            postDescription={postDescription}
            mentionProfiles={mentionProfiles}
            profilesOpen={profilesOpen}
            caretCoord={caretCoord}
            handleMentionClick={handleMentionClick}
            handleKeyDownDelete={handleKeyDownDelete}
            title={title}
            setTitle={setTitle}
            recipients={recipients}
            setRecipients={setRecipients}
            editionAmount={editionAmount}
            setEditionAmount={setEditionAmount}
            currency={currency}
            setCurrency={setCurrency}
            valueAmount={valueAmount}
            setValueAmount={setValueAmount}
            setReferralFee={setReferralFee}
            referralFee={referralFee}
            enabledCurrencies={enabledCurrencies}
            sustained={sustained}
            involved={involved}
            setSustained={setSustained}
            setInvolved={setInvolved}
            filledInAmount={filledInAmount}
          />
          <Preview
            title={title}
            postDescription={postDescription}
            referralFee={referralFee}
            recipients={recipients}
            editionAmount={editionAmount}
            valueAmount={valueAmount}
            currency={currency}
            sustained={sustained}
            involved={involved}
          />
        </div>
      );
  }
};

export default SwitchLaunch;
