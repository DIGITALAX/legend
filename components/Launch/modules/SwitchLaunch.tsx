import { FunctionComponent } from "react";
import PostDetails from "./PostDetails";
import { SwitchLaunchProps } from "../types/launch.types";
import Keeper from "./Keeper";
import Live from "./Live";
import Store from "./Store";
import Contracts from "./Contracts";
import usePost from "../hooks/usePost";
import Preview from "./Preview";

const SwitchLaunch: FunctionComponent<SwitchLaunchProps> = ({
  authStatus,
  profile,
  address,
}): JSX.Element => {
  let action: string;
  const decideStringAction = () => {
    if (authStatus && address && profile?.handle) {
      action = "post";
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
    enabledCurrencies
  } = usePost();

  switch (decideStringAction()) {
    case "live":
      return <Live />;

    case "keeper":
      return <Keeper />;

    case "store":
      return <Store />;

    case "contracts":
      return <Contracts />;

    case "post":
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
          />
          <Preview
            title={title}
            postDescription={postDescription}
            referralFee={referralFee}
            recipients={recipients}
            editionAmount={editionAmount}
            valueAmount={valueAmount}
            currency={currency}
          />
        </div>
      );

    default:
      return (
        <div className="font-earl text-black flex flex-col items-center justify-center text-center w-full h-full">
          Connect to Launch a Grant
        </div>
      );
  }
};

export default SwitchLaunch;
