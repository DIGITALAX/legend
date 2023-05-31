import { Erc20, Profile } from "@/components/home.types";
import createProfilePicture from "@/lib/lens/helpers/createProfilePicture";
import syncScroll from "@/lib/lens/helpers/syncScroll";
import Image from "next/legacy/image";
import { FormEvent, FunctionComponent, KeyboardEvent } from "react";
import { PostDetailsProps } from "../types/launch.types";

const PostDetails: FunctionComponent<PostDetailsProps> = ({
  title,
  setTitle,
  recipients,
  setRecipients,
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
  editionAmount,
  setEditionAmount,
  currency,
  setCurrency,
  valueAmount,
  setValueAmount,
  setReferralFee,
  referralFee,
  enabledCurrencies,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col items-center font-earl">
      <div className="relative w-fit h-fit flex flex-col gap-3">
        <div className="relative w-fit h-fit flex">Grant Title</div>
        <input
          className="relative w-fit h-fit flex"
          onChange={(e: FormEvent) =>
            setTitle((e.target as HTMLFormElement).value)
          }
          value={title}
        />
      </div>
      <div className="relative w-fit h-fit flex flex-col gap-3">
        <div className="relative w-fit h-fit flex">Grant Description</div>
        <div className="relative w-full h-full p-px rounded-md">
          <div className="relative w-full h-40 border border-white p-px rounded-md grid grid-flow-col auto-cols-auto">
            <textarea
              id="post"
              onScroll={(e: any) => syncScroll(textElement, preElement)}
              onInput={(e: FormEvent) => {
                handlePostDescription(e);
                syncScroll(textElement, preElement);
              }}
              onKeyDown={(e: KeyboardEvent<Element>) => handleKeyDownDelete(e)}
              style={{ resize: "none" }}
              className="relative w-full h-full bg-white font-earl text-black p-2 z-1 rounded-lg overflow-y-scroll"
              ref={textElement}
              value={postDescription}
              disabled={postLoading ? true : false}
            ></textarea>
            <pre
              id="highlighting"
              className={`absolute w-full h-full bg-white font-earl text-black p-2 rounded-lg overflow-y-auto`}
              ref={preElement}
            >
              <code
                id="highlighted-content"
                className={`w-full h-full place-self-center text-left whitespace-pre-wrap overflow-y-auto z-0`}
              ></code>
            </pre>
            {mentionProfiles?.length > 0 && profilesOpen && (
              <div
                className={`absolute w-44 max-h-28 h-fit flex flex-col overflow-y-auto items-start justify-start z-2 rounded-lg`}
                style={{
                  top: caretCoord.y + 30,
                  left: caretCoord.x,
                }}
              >
                {mentionProfiles?.map((user: Profile, index: number) => {
                  const profileImage: string = createProfilePicture(user);
                  return (
                    <div
                      key={index}
                      className={`relative w-full h-fit px-3 py-2 bg-white flex flex-row gap-3 cursor-pointer items-center justify-center border-y border-black hover:bg-rosa/70 z-2`}
                      onClick={() => handleMentionClick(user)}
                    >
                      <div className="relative flex flex-row w-full h-full text-black font-earl lowercase place-self-center gap-2">
                        <div
                          className={`relative rounded-full flex bg-white w-3 h-3 items-center justify-center col-start-1`}
                          id="crt"
                        >
                          {profileImage !== "" && (
                            <Image
                              src={profileImage}
                              objectFit="cover"
                              alt="pfp"
                              layout="fill"
                              className="relative w-fit h-fit rounded-full items-center justify-center flex"
                              draggable={false}
                            />
                          )}
                        </div>
                        <div className="relative col-start-2 items-center justify-center w-fit h-fit text-xs flex">
                          @{user?.handle?.split(".lens")[0]}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="relative w-fit h-fit flex flex-col gap-3">
        <div className="relative w-fit h-fit flex">How many editions?</div>
        <input
          className="relative w-fit h-fit flex"
          type="number"
          onChange={(e: FormEvent) =>
            setEditionAmount((e.target as HTMLFormElement).value)
          }
          value={editionAmount}
        />
      </div>
      <div className="relative w-fit h-fit flex flex-col gap-3">
        <div className="relative w-fit h-fit flex">How much?</div>
        <input
          className="relative w-fit h-fit flex"
          type="number"
          onChange={(e: FormEvent) =>
            setValueAmount((e.target as HTMLFormElement).value)
          }
          value={valueAmount}
        />
      </div>
      <div className="relative w-fit h-fit flex flex-col gap-3">
        <div className="relative w-fit h-fit flex">Referral Fee?</div>
        <input
          className="relative w-fit h-fit flex"
          type="number"
          onChange={(e: FormEvent) =>
            setReferralFee((e.target as HTMLFormElement).value)
          }
          value={referralFee}
        />
      </div>
      <div className="relative w-fit h-fit flex flex-col gap-3">
        <div className="relative w-fit h-fit flex">Choose Currency</div>
        <div className="relative w-fit h-fit flex flex-row gap-2">
          {enabledCurrencies?.map((currency: Erc20, index: number) => {
            return (
              <div onClick={() => setCurrency(currency.address)} key={index}>
                {currency.symbol}
              </div>
            );
          })}
        </div>
      </div>
      <div className="relative w-fit h-fit flex flex-col gap-3">
        <div className="relative w-fit h-fit flex">Set Recipients</div>
        <div className="relative w-fit h-fit flex flex-col gap-2">
          {recipients?.map(
            (
              recipient: {
                recipient: string;
                split: number;
              },
              index: number
            ) => {
              return (
                <div className="relative flex flex-row gap-2" key={index}>
                  <div className="relative flex flex-col gap-1">
                    <div className="w-fit h-fit"> recipient address</div>
                    <input
                      className="relative w-full h-fit"
                      value={recipient.recipient}
                      onChange={(e) => {
                        const updatedRecipients = recipients.map((r, i) =>
                          i === index
                            ? { ...r, recipient: e.target.value.trim() }
                            : r
                        );
                        setRecipients(updatedRecipients);
                      }}
                    />
                  </div>
                  <div className="relative flex flex-col gap-1">
                    <div className="w-fit h-fit"> recipient split %</div>
                    <input
                      className="relative w-20 h-fit"
                      type="number"
                      value={recipient.split}
                      onChange={(e) => {
                        const updatedRecipients = recipients.map((r, i) =>
                          i === index
                            ? { ...r, split: parseInt(e.target.value) }
                            : r
                        );
                        setRecipients(updatedRecipients);
                      }}
                    />
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
