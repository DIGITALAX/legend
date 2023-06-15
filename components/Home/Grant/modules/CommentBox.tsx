import { INFURA_GATEWAY } from "@/lib/constants";
import { setCollapseItem } from "@/redux/reducers/collapseItemSlice";
import moment from "moment";
import Image from "next/legacy/image";
import {
  ClipboardEvent,
  FormEvent,
  FunctionComponent,
  KeyboardEvent,
} from "react";
import Draggable from "react-draggable";
import { CommentBoxProps } from "../types/grant.types";
import syncScroll from "@/lib/lens/helpers/syncScroll";
import createProfilePicture from "@/lib/lens/helpers/createProfilePicture";
import InfiniteScroll from "react-infinite-scroll-component";
import descriptionRegex from "@/lib/lens/helpers/descriptionRegex";
import { MediaSet } from "@/components/home.types";
import { AiOutlineLoading } from "react-icons/ai";
import { setSecondaryComment } from "@/redux/reducers/secondaryCommentSlice";
import { setCollectInfo } from "@/redux/reducers/collectInfoSlice";
import { setFollowerOnly } from "@/redux/reducers/followerOnlySlice";
import { setError } from "@/redux/reducers/errorSlice";
import CollectButton from "@/components/Common/modules/CollectButton";
import CollectInput from "@/components/Common/modules/CollectInput";
import BoxImages from "@/components/Common/modules/BoxImages";
import Options from "@/components/Common/modules/Options";

const CommentBox: FunctionComponent<CommentBoxProps> = ({
  collapseNumber,
  dispatch,
  index,
  commentGrant,
  commentors,
  getMorePostComments,
  commentsLoading,
  hasMoreComments,
  hasMirrored,
  hasReacted,
  commentorLoading,
  likeCommentLoading,
  mirrorCommentLoading,
  collectCommentLoading,
  textElement,
  preElement,
  handleCommentDescription,
  handleKeyDownDelete,
  handleImagePaste,
  setImageLoading,
  commentLoading,
  commentDescription,
  canComment,
  caretCoord,
  mentionProfiles,
  commentId,
  handleMentionClick,
  profilesOpen,
  lensProfile,
  authStatus,
  collectGrant,
  likeGrant,
  mirrorGrant,
  handleLensSignIn,
  handleConnect,
  handleGif,
  handleSetGif,
  handleGifSubmit,
  collectNotif,
  gifOpen,
  setGifOpen,
  collectOpen,
  collectible,
  referral,
  setReferral,
  setCollectible,
  setCollectibleDropDown,
  chargeCollect,
  setChargeCollectDropDown,
  chargeCollectDropDown,
  collectibleDropDown,
  audienceTypes,
  setAudienceType,
  audienceType,
  audienceDropDown,
  setAudienceDropDown,
  limitedEdition,
  limit,
  limitedDropDown,
  setLimitedDropDown,
  setTimeLimit,
  setChargeCollect,
  timeLimitDropDown,
  setTimeLimitDropDown,
  enabledCurrency,
  timeLimit,
  setCurrencyDropDown,
  setLimitedEdition,
  setLimit,
  enabledCurrencies,
  setEnabledCurrency,
  setValue,
  value,
  currencyDropDown,
  handleRemoveImage,
  mappedFeaturedFiles,
  commentImages,
  videoLoading,
  imageLoading,
  uploadVideo,
  uploadImage,
}): JSX.Element => {
  return (
    <Draggable
      enableUserSelectHack={false}
      // nodeRef={commentRef as any}
      cancel=".stopDrag"
    >
      <div
        className={`absolute z-1 w-80 flex drop-shadow-2xl ${
          collapseNumber[index] ? "h-4" : "h-100"
        }`}
      >
        <Image
          layout="fill"
          src={`${INFURA_GATEWAY}/QmbpFBk93UDXB5PKLhhXbn6tNKG1XDUJjS6SiSeG7S2GMB`}
          className="w-full h-full flex relative"
          draggable={false}
        />
        <div
          className="stopDrag flex absolute w-full h-4 top-1 left-0 px-3 cursor-pointer"
          onClick={() =>
            dispatch(
              setCollapseItem(
                [...collapseNumber].map((item, i) =>
                  i === index ? !item : item
                )
              )
            )
          }
        >
          <div className="relative flex justify-center items-center w-full h-full">
            <Image
              src={`${INFURA_GATEWAY}/QmYfpEREcRAMyretbQbT7YFtJHZLeR948iCezLTgvcUFYS`}
              layout="fill"
              draggable={false}
            />
          </div>
        </div>
        <div>
          <div className="relative w-full h-fit flex flex-col items-center justify-center gap-5 top-5">
            <div className="relative w-full h-fit overflow-y-scroll gap-1 flex">
              {(mappedFeaturedFiles?.length !== 0 ||
                commentImages?.length !== 0) && (
                <BoxImages
                  handleRemoveImage={handleRemoveImage}
                  commentLoading={commentLoading}
                  postImagesDispatched={commentImages}
                />
              )}
            </div>
            <div className="relative w-full h-60 grid grid-flow-row auto-rows-auto gap-5 overflow-y-scroll">
              <InfiniteScroll
                className={`relative row-start-1 w-full h-full overflow-y-scroll`}
                hasMore={hasMoreComments}
                height={"27.7rem"}
                loader={""}
                dataLength={commentors?.length}
                next={getMorePostComments}
              >
                <div className="relative w-full h-fit grid grid-flow-row auto-rows-auto gap-3">
                  {commentors?.map((comment: any, index: number) => {
                    const profileImage = createProfilePicture(comment, true);
                    return (
                      <div
                        key={index}
                        className="relative w-full h-fit flex flex-row font-arcade text-sm items-start gap-3 p-3"
                      >
                        <div className="relative w-fit h-full flex items-start justify-start cursor-pointer">
                          <div
                            className="relative w-6 h-6 border border-white"
                            id="crt"
                          >
                            {profileImage !== "" && (
                              <Image
                                objectFit="cover"
                                alt="pfp"
                                layout="fill"
                                className="relative w-full h-full flex"
                                src={profileImage}
                                draggable={false}
                              />
                            )}
                          </div>
                        </div>
                        <div className="relative w-full h-full flex flex-col gap-2">
                          <div className="relative w-full h-full text-ama justify-start flex cursor-pointer">
                            @{comment?.profile?.handle?.split(".lens")[0]}
                          </div>
                          <div className="relative w-full h-full text-verde flex flex-col">
                            <div
                              className="relative w-full h-full flex"
                              dangerouslySetInnerHTML={{
                                __html: descriptionRegex(
                                  comment?.metadata?.content
                                ),
                              }}
                            ></div>
                            <div className="relative w-44 h-fit overflow-x-scroll grid grid-flow-col auto-cols-auto gap-3 z-10">
                              {comment?.metadata?.media?.map(
                                (media: MediaSet, index: number) => {
                                  let formattedImageURL: string;
                                  if (
                                    media?.original?.url?.includes("ipfs://")
                                  ) {
                                    formattedImageURL = `${INFURA_GATEWAY}/${
                                      media?.original?.url?.split("://")[1]
                                    }`;
                                  } else {
                                    formattedImageURL = media?.original?.url;
                                  }
                                  return (
                                    <div
                                      key={index}
                                      className="relative w-24 h-24 grid grid-flow-col auto-cols-auto"
                                    >
                                      {media?.original?.mimeType !==
                                      "video/mp4" ? (
                                        <Image
                                          src={formattedImageURL}
                                          layout="fill"
                                          objectFit="cover"
                                          draggable={false}
                                          className="rounded-lg"
                                        />
                                      ) : (
                                        <video
                                          muted
                                          controls
                                          playsInline
                                          autoPlay
                                          loop
                                          className="rounded-md absolute w-full h-full object-cover"
                                        >
                                          <source
                                            src={formattedImageURL}
                                            type="video/mp4"
                                          />
                                        </video>
                                      )}
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                          <div className="relative w-full h-full text-moda justify-start flex">
                            {moment(`${comment?.createdAt}`).fromNow()}
                          </div>
                        </div>
                        <div className="relative grid grid-rows-2 w-full h-full gap-2 items-end justify-end flex-wrap">
                          <div className="relative w-full h-full grid grid-cols-2 gap-2 items-center justify-end">
                            <div
                              className={`relative w-full h-full grid grid-flow-col auto-cols-auto items-center justify-end flex-row gap-2 ${
                                lensProfile && authStatus && "cursor-pointer"
                              }`}
                              onClick={() => likeGrant(comment?.id)}
                            >
                              {likeCommentLoading[index] ? (
                                <AiOutlineLoading
                                  size={9}
                                  color="white"
                                  className={`${
                                    likeCommentLoading?.[index] &&
                                    "animate-spin"
                                  }
                                `}
                                />
                              ) : hasReacted?.[index] ? (
                                <Image
                                  src={`${INFURA_GATEWAY}/Qmc3KCKWRgN8iKwwAPM5pYkAYNeVwWu3moa5RDMDTBV6ZS`}
                                  width={12}
                                  height={12}
                                  alt="mirror"
                                  draggable={false}
                                />
                              ) : (
                                <Image
                                  src={`${INFURA_GATEWAY}/QmSX1Y5cKp8p53jv2CnfQBuhu3dgLANjZMTyAMKtgFtvV6`}
                                  width={12}
                                  height={12}
                                  alt="backward"
                                  draggable={false}
                                />
                              )}
                              <div className="relative w-fit h-fit font-arcade text-xs text-white flex">
                                {comment?.stats?.totalUpvotes}
                              </div>
                            </div>
                            <div
                              className={`relative w-full h-full grid grid-flow-col auto-cols-auto items-center justify-end flex-row gap-2 cursor-pointer`}
                              onClick={() =>
                                dispatch(setSecondaryComment(comment?.id))
                              }
                            >
                              <Image
                                src={`${INFURA_GATEWAY}/QmeuR9Fzv8QF9R6ntjGKB78GteQgmEcXhBfVPhsTyWbumA`}
                                width={12}
                                height={12}
                                alt="backward"
                                draggable={false}
                              />
                              <div className="relative w-fit h-fit font-arcade text-xs text-white flex">
                                {comment?.stats?.totalAmountOfComments}
                              </div>
                            </div>
                          </div>
                          <div className="relative w-full h-full grid grid-cols-2 gap-2 items-center justify-end">
                            <div
                              className={`relative w-full h-full grid grid-flow-col auto-cols-auto items-center justify-end flex-row gap-2 ${
                                comment?.collectModule?.type !==
                                  "RevertCollectModule" &&
                                authStatus &&
                                lensProfile &&
                                "cursor-pointer"
                              }`}
                              onClick={
                                comment?.collectModule?.type ===
                                "RevertCollectModule"
                                  ? () => {}
                                  : comment?.collectModule?.followerOnly &&
                                    !comment?.profile?.isFollowedByMe
                                  ? () =>
                                      dispatch(
                                        setFollowerOnly({
                                          actionOpen: true,
                                          actionFollowerId:
                                            comment?.profile?.id,
                                          actionId: comment?.id,
                                          actionIndex: index,
                                        })
                                      )
                                  : comment?.collectModule?.type ===
                                      "FreeCollectModule" ||
                                    ((comment?.collectModule?.__typename ===
                                      "SimpleCollectModuleSettings" ||
                                      comment?.collectModule?.type ===
                                        "SimpleCollectModule") &&
                                      !comment?.collectModule?.amount &&
                                      !comment?.collectModule
                                        ?.optionalCollectLimit &&
                                      !comment?.collectModule
                                        ?.optionalEndTimestamp)
                                  ? () => collectGrant(comment?.id)
                                  : () =>
                                      dispatch(
                                        setCollectInfo({
                                          actionOpen: true,
                                          actionId: comment?.id,
                                          actionIndex: index,
                                        })
                                      )
                              }
                            >
                              {collectCommentLoading[index] ? (
                                <AiOutlineLoading
                                  size={9}
                                  color="white"
                                  className={`${
                                    collectCommentLoading?.[index] &&
                                    "animate-spin"
                                  }
                                `}
                                />
                              ) : comment?.hasCollectedByMe ? (
                                <Image
                                  src={`${INFURA_GATEWAY}/QmXG1mnHdBDXMzMZ9t1wE1Tqo8DRXQ1oNLUxpETdUw17HU`}
                                  width={12}
                                  height={12}
                                  alt="collect"
                                  draggable={false}
                                />
                              ) : (
                                <Image
                                  src={`${INFURA_GATEWAY}/QmRGf1cz8h9bdw9VKp9zYXZoDfy15nRA1fKc7ARhxnRPwr`}
                                  width={12}
                                  height={12}
                                  alt="collect"
                                  draggable={false}
                                />
                              )}
                              <div className="relative w-fit h-fit font-arcade text-xs text-white">
                                {comment?.stats?.totalAmountOfCollects}
                              </div>
                            </div>
                            <div
                              className={`relative w-full h-full grid grid-flow-col auto-cols-auto items-center justify-end flex-row gap-2 ${
                                lensProfile && authStatus && "cursor-pointer"
                              }`}
                              onClick={() => mirrorGrant(comment?.id)}
                            >
                              {mirrorCommentLoading?.[index] ? (
                                <AiOutlineLoading
                                  size={9}
                                  color="white"
                                  className={`${
                                    mirrorCommentLoading?.[index] &&
                                    "animate-spin"
                                  }
                                `}
                                />
                              ) : hasMirrored?.[index] ? (
                                <Image
                                  src={`${INFURA_GATEWAY}/QmcMNSnbKvUfx3B3iHBd9deZCDf7E4J8W6UtyNer3xoMsB`}
                                  width={12}
                                  height={12}
                                  alt="mirror"
                                  draggable={false}
                                />
                              ) : (
                                <Image
                                  src={`${INFURA_GATEWAY}/QmXZi8e6UQaXm3BMMdsAUTnxoQSEr97nvuc19v7kBAgFsY`}
                                  width={12}
                                  height={12}
                                  alt="mirror"
                                  draggable={false}
                                />
                              )}
                              <div className="relative w-fit h-fit font-arcade text-xs text-white">
                                {comment?.stats?.totalAmountOfMirrors}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </InfiniteScroll>
            </div>
            <div className="relative w-full h-40 border border-black p-px rounded-md top-5 flex justify-center items-center bg-white flex-col">
              {collectOpen ? (
                <div className="relative w-full h-full flex overflow-y-scroll">
                  <div className="relative w-fit h-full flex auto-rows-auto gap-10">
                    <div className="relative w-fit h-fit row-start-1 flex flex-col flex-wrap place-self-start gap-3">
                      <div className="relative flex flex-col galaxy:flex-row">
                        <CollectButton
                          col={"1"}
                          row={"1"}
                          selectFunction={setCollectible}
                          openDropdown={collectibleDropDown}
                          handleOpenDropdown={setCollectibleDropDown}
                          selectValue={collectible}
                          label={"Collectible?"}
                        />
                        {collectible === "yes" && (
                          <CollectButton
                            col={"1"}
                            row={"1"}
                            values={audienceTypes}
                            selectFunction={setAudienceType}
                            openDropdown={audienceDropDown}
                            handleOpenDropdown={setAudienceDropDown}
                            selectValue={audienceType}
                            label={"Who can collect?"}
                          />
                        )}
                        {collectible === "yes" && (
                          <CollectButton
                            col={"1"}
                            row={"1"}
                            selectFunction={setChargeCollect}
                            openDropdown={chargeCollectDropDown}
                            handleOpenDropdown={setChargeCollectDropDown}
                            selectValue={chargeCollect}
                            label={"Creator award?"}
                          />
                        )}
                      </div>
                      <div className="relative flex flex-col galaxy:flex-row">
                        {collectible === "yes" && chargeCollect === "yes" && (
                          <CollectButton
                            col={"1"}
                            row={"1"}
                            selectFunction={setTimeLimit}
                            openDropdown={timeLimitDropDown}
                            handleOpenDropdown={setTimeLimitDropDown}
                            selectValue={timeLimit}
                            label={"24 Hour Collect"}
                          />
                        )}
                        {collectible === "yes" && (
                          <CollectButton
                            col={"1"}
                            row={"1"}
                            selectFunction={setLimitedEdition}
                            openDropdown={limitedDropDown}
                            handleOpenDropdown={setLimitedDropDown}
                            selectValue={limitedEdition}
                            label={"Limited edition?"}
                          />
                        )}
                        {collectible === "yes" && limitedEdition === "yes" && (
                          <CollectInput
                            min="1"
                            step="1"
                            defaultValue={limit.toString()}
                            placeholder={limit.toString()}
                            id="collectLimit"
                            label="Edition Amount"
                            name="collectLimit"
                            col={"1"}
                            row={"1"}
                            handleValueChange={setLimit}
                          />
                        )}
                      </div>
                      <div className="relative flex flex-col galaxy:flex-row w-full">
                        {collectible === "yes" && chargeCollect === "yes" && (
                          <CollectButton
                            col={"1"}
                            row={"1"}
                            values={enabledCurrencies}
                            selectFunction={setEnabledCurrency}
                            openDropdown={currencyDropDown}
                            handleOpenDropdown={setCurrencyDropDown}
                            selectValue={enabledCurrency}
                            label={"Award currency"}
                          />
                        )}
                        {collectible === "yes" && chargeCollect === "yes" && (
                          <CollectInput
                            min="0"
                            defaultValue={value.toString()}
                            placeholder={value.toString()}
                            id="valueAmount"
                            label="Award amount"
                            name="valueAmount"
                            col={"1"}
                            row={"1"}
                            step="0.00001"
                            handleValueChange={setValue}
                          />
                        )}
                        {collectible === "yes" && chargeCollect === "yes" && (
                          <CollectInput
                            min="0"
                            defaultValue={referral.toString()}
                            placeholder={referral.toString()}
                            id="referral"
                            label="Mirrored posts (%)"
                            name="referral"
                            col={"1"}
                            row={"1"}
                            step="0.1"
                            handleValueChange={setReferral}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : gifOpen ? (
                <div></div>
              ) : (
                <div className="relative w-full h-full border border-black p-px rounded-md grid grid-flow-col auto-cols-auto">
                  <textarea
                    id="post2"
                    onScroll={() => syncScroll(textElement, preElement)}
                    onInput={(e: FormEvent) => {
                      handleCommentDescription(e);
                      syncScroll(textElement, preElement);
                    }}
                    onKeyDown={(e: KeyboardEvent<Element>) =>
                      handleKeyDownDelete(e)
                    }
                    onPaste={(e: ClipboardEvent<HTMLTextAreaElement>) =>
                      handleImagePaste(e, setImageLoading)
                    }
                    style={{ resize: "none" }}
                    className="relative w-full h-full font-earl text-black p-2 z-1 rounded-lg overflow-y-auto"
                    ref={textElement}
                    value={commentDescription}
                    disabled={commentLoading || !canComment ? true : false}
                  ></textarea>
                  <pre
                    id="highlighting2"
                    className={`absolute w-full h-full font-earl text-black p-2 rounded-lg overflow-y-auto ${
                      !canComment && "opacity-70"
                    }`}
                    ref={preElement}
                  >
                    <code
                      id="highlighted-content2"
                      className={`w-full h-full place-self-center text-left whitespace-pre-wrap overflow-y-auto z-0`}
                    >
                      {!canComment
                        ? "Looks Like Only Select Profiles Can Comment on this Post ATM"
                        : commentId !== ""
                        ? "Reply with a Comment?"
                        : "Have Something to Say?"}
                    </code>
                  </pre>
                  {mentionProfiles?.length > 0 && profilesOpen && (
                    <div
                      className={`absolute w-44 max-h-28 h-fit flex flex-col overflow-y-scroll items-start justify-start z-2 rounded-lg`}
                      style={{
                        top: caretCoord.y + 30,
                        left: caretCoord.x,
                      }}
                    >
                      {mentionProfiles?.map((user: any, index: number) => {
                        const profileImage: string = createProfilePicture(user);
                        return (
                          <div
                            key={index}
                            className={`relative w-full h-fit px-3 py-2 bg-white flex flex-row gap-3 cursor-pointer items-center justify-center border-y border-black hover:bg-rosa/70 z-2`}
                            onClick={() => {
                              handleMentionClick(user);
                            }}
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
              )}
            </div>
            <div className="relative w-full h-fit justify-end flex flex-row gap-2 items-center">
              <Options
                videoLoading={videoLoading}
                imageLoading={imageLoading}
                commentLoading={commentLoading}
                uploadImage={uploadImage}
                uploadVideo={uploadVideo}
                setGifOpen={setGifOpen}
                gifOpen={gifOpen}
                collectOpen={collectOpen}
                dispatch={dispatch}
                commentImages={commentImages}
              />
              <div className="relative w-24 min-w-fit h-10 border-white border rounded-tr-xl rounded-bl-xl py-2 px-4 flex items-center cursor-pointer active:scale-95 hover:bg-moda justify-center">
                <div
                  className={`relative w-full h-full flex text-white font-arcade items-center text-center justify-center ${
                    commentLoading && "animate-spin"
                  }`}
                  onClick={
                    !authStatus && !lensProfile
                      ? () => handleConnect()
                      : authStatus && !lensProfile
                      ? () => handleLensSignIn()
                      : commentLoading
                      ? () => {}
                      : collectNotif !== ""
                      ? () =>
                          dispatch(
                            setError({
                              actionValue: true,
                              actionMessage: collectNotif,
                            })
                          )
                      : () => commentGrant()
                  }
                >
                  {!authStatus && !lensProfile ? (
                    "CONNECT"
                  ) : authStatus && !lensProfile ? (
                    "SIGN IN"
                  ) : commentLoading ? (
                    <AiOutlineLoading size={10} color="white" />
                  ) : (
                    "SEND IT"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default CommentBox;
