import { Erc20, Profile } from "@/components/home.types";
import createProfilePicture from "@/lib/lens/helpers/createProfilePicture";
import syncScroll from "@/lib/lens/helpers/syncScroll";
import Image from "next/legacy/image";
import { FormEvent, FunctionComponent, KeyboardEvent } from "react";
import { PostDetailsProps } from "../types/launch.types";
import Draggable from "react-draggable";
import { INFURA_GATEWAY } from "@/lib/constants";
import SmallBox from "@/components/Common/modules/SmallBox";
import TopBarOne from "@/components/Common/modules/TopBarOne";

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
    <div className="relative w-full h-full flex flex-col items-center">
      <Draggable enableUserSelectHack={false}>
        <div className="relative w-72 h-fit flex gap-3 bg-mal rounded-md border-2 border-mora p-6">
          <div className="relative w-full h-full bg-otra items-center flex flex-col">
            <TopBarOne />
            <div className="p-2 flex w-full h-full flex-col gap-3">
              <div className="relative w-fit h-fit flex font-mega text-mazul text-xl uppercase">
                What's the name of your grant?
              </div>
              <div className="relative w-full h-full flex flex-col bg-mazul border border-black gap-3 p-2">
                <div className="relative w-fit h-fit flex font-mega text-white uppercase text-center flex flex-col gap-1">
                  <div className="text-sm"> Be creative!</div>
                  <div className="text-2xl"> REMEMBER, </div>
                  <div className="text-sm">
                    you want your grant to stand out.
                  </div>
                </div>
                <div className="relative w-full h-full flex items-center justify-center rounded-md">
                  <div className="absolute w-full h-full flex">
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/Qme3dKpZyyv9oMEu9AbaS3Q3xXGcbXj5V2JXhhJW8bRfQV`}
                      draggable={false}
                    />
                  </div>
                  <textarea
                    className="relative w-full h-full flex cursor-white bg-mold border border-lily text-black font-mega text-sm p-1 rounded-md"
                    style={{ resize: "none" }}
                    onChange={(e: FormEvent) =>
                      setTitle((e.target as HTMLFormElement).value)
                    }
                    value={title}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Draggable>
      <Draggable enableUserSelectHack={false}>
        <div className="relative w-96 h-fit flex gap-3 bg-darker rounded-md border-2 border-mora p-6">
          <div className="relative w-full h-full bg-otra items-center flex flex-col">
            <TopBarOne />
            <div className="p-2 flex w-full h-full flex-col gap-3">
              <div className="relative w-fit h-fit flex font-mega text-mazul text-xl uppercase">
                What's being built?
              </div>
              <div className="relative w-full h-full flex flex-col bg-lily border border-black gap-3 p-2">
                <div className="relative w-fit h-fit flex font-mega text-black uppercase flex flex-col gap-1 text-xs">
                  Describe what your grant is for, what the final product will
                  be, and who it benefits the most.
                </div>
                <div className="relative w-full h-full p-px rounded-md">
                  <div className="relative w-full h-80 border border-white p-px rounded-md grid grid-flow-col auto-cols-auto">
                    <textarea
                      id="post"
                      onScroll={(e: any) => syncScroll(textElement, preElement)}
                      onInput={(e: FormEvent) => {
                        handlePostDescription(e);
                        syncScroll(textElement, preElement);
                      }}
                      onKeyDown={(e: KeyboardEvent<Element>) =>
                        handleKeyDownDelete(e)
                      }
                      style={{ resize: "none" }}
                      className="relative w-full h-full bg-mazul font-earl text-white p-2 z-1 rounded-lg overflow-y-scroll"
                      ref={textElement}
                      value={postDescription}
                      disabled={postLoading ? true : false}
                    ></textarea>
                    <pre
                      id="highlighting"
                      className={`absolute w-full h-full bg-mazul font-earl text-white p-2 rounded-lg overflow-y-auto`}
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
                        {mentionProfiles?.map(
                          (user: Profile, index: number) => {
                            const profileImage: string =
                              createProfilePicture(user);
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
                          }
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Draggable>
      <SmallBox
        title={"How many editions?"}
        onChangeFunction={(e: FormEvent) =>
          setEditionAmount((e.target as HTMLFormElement).value)
        }
        value={editionAmount}
      />
      <SmallBox
        title={"How much?"}
        onChangeFunction={(e: FormEvent) =>
          setValueAmount((e.target as HTMLFormElement).value)
        }
        value={valueAmount}
      />
      <SmallBox
        title={"Referral Fee?"}
        onChangeFunction={(e: FormEvent) =>
          setReferralFee((e.target as HTMLFormElement).value)
        }
        value={referralFee}
      />
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
