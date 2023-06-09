import { v4 as uuidv4 } from "uuid";
import { useEffect, useRef, useState } from "react";
import {
  getDatabase,
  ref,
  set,
  onValue,
  off,
  onDisconnect,
} from "firebase/database";
import { FirebaseApp } from "firebase/app";
import GrantBox from "@/components/Home/Grant/modules/GrantBox";
import CommentBox from "@/components/Home/Grant/modules/CommentBox";
import DynamicNFT from "@/components/Home/Grant/modules/DynamicNFT";
import MirrorBox from "@/components/Home/Grant/modules/MirrorBox";
import CollectBox from "@/components/Home/Grant/modules/CollectBox";
import StoreFrontBox from "@/components/Home/Grant/modules/StoreFrontBox";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ClaimedNFTBox from "@/components/Home/Grant/modules/ClaimedNFTBox";
import useMainGrant from "@/components/Home/Grant/hooks/useMainGrant";
import useInteractions from "@/components/Home/Grant/hooks/useInteractions";
import useComment from "@/components/Home/Grant/hooks/useCommentGrant";
import useStore from "@/components/Home/Grant/hooks/useStore";
import useImageUpload from "@/components/Launch/hooks/useImageUpload";
import useCollectOptions from "@/components/Home/Grant/hooks/useCollectOptions";
import useSignIn from "@/components/Layout/hooks/useSignIn";

type HomeProps = {
  firebaseApp: FirebaseApp;
};

export default function Home({ firebaseApp }: HomeProps): JSX.Element {
  const {
    grantsLoading,
    mainURI,
    handleMintDynamicNFT,
    currentCounter,
    editionAmount,
    canMint,
    mainPostInfo,
    mainPostLoading,
    mintLoading,
    collectGrant,
    mirrorGrant,
    likeGrant,
    likeCommentLoading,
    likeLoading,
    mirrorCommentLoading,
    mirrorLoading,
    getMoreProfiles,
    collectCommentLoading,
    collectInfoLoading,
    collectLoading,
    NFTCollectors,
    hasMoreProfiles,
  } = useMainGrant();
  const {
    storeLoading,
    nextItem,
    setNextItem,
    size,
    baseColor,
    setSize,
    setBaseColor,
    setPurchasePrice,
    currency,
    setCurrency,
    purchaseAmount,
    setPurchaseAmount,
    addItemToCart,
    canCollect,
  } = useStore();
  const { handleLensSignIn, handleConnect } = useSignIn();
  const {
    commentors,
    getMorePostComments,
    commentsLoading,
    collectors,
    collectorsLoading,
    getMorePostCollects,
    hasMoreCollects,
    hasMoreComments,
    hasMirrored,
    hasReacted,
    getMorePostReactions,
    getMorePostMirrors,
    mirrorers,
    reacters,
    reactInfoLoading,
    mirrorInfoLoading,
    hasMoreReact,
    hasMoreMirror,
  } = useInteractions();
  const {
    commentGrant,
    commentDescription,
    textElement,
    handleCommentDescription,
    commentLoading,
    caretCoord,
    mentionProfiles,
    profilesOpen,
    handleMentionClick,
    handleGifSubmit,
    handleGif,
    results,
    handleSetGif,
    gifOpen,
    setGifOpen,
    handleKeyDownDelete,
    preElement,
    handleImagePaste,
  } = useComment();
  const {
    handleCollectValues,
    collectNotif,
    referral,
    setCollectible,
    collectibleDropDown,
    setCollectibleDropDown,
    collectible,
    setAudienceDropDown,
    audienceType,
    audienceTypes,
    chargeCollect,
    limit,
    limitedEdition,
    audienceDropDown,
    setAudienceType,
    setTimeLimit,
    timeLimit,
    timeLimitDropDown,
    setTimeLimitDropDown,
    setLimitedEdition,
    limitedDropDown,
    setLimitedDropDown,
    setReferral,
    setLimit,
    setChargeCollect,
    setCurrencyDropDown,
    chargeCollectDropDown,
    setChargeCollectDropDown,
    enabledCurrencies,
    enabledCurrency,
    currencyDropDown,
    setEnabledCurrency,
    value,
    setValue,
  } = useCollectOptions();
  const {
    videoLoading,
    imageLoading,
    uploadImage,
    uploadVideo,
    handleRemoveImage,
    mappedFeaturedFiles,
    setImageLoading,
  } = useImageUpload();
  const grantCollection = useSelector(
    (state: RootState) => state.app.grantCollectionReducer.value
  );
  const commentImages = useSelector(
    (state: RootState) => state.app.commentImagesReducer.value
  );
  const collectOpen = useSelector(
    (state: RootState) => state.app.collectOpenReducer.value
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartItemsReducer.value
  );
  const collapseNumber = useSelector(
    (state: RootState) => state.app.collapseItemReducer.value
  );
  const commentId = useSelector(
    (state: RootState) => state.app.secondaryCommentReducer.value
  );
  const canComment = useSelector(
    (state: RootState) => state.app.canCommentReducer.value
  );
  const lensProfile = useSelector(
    (state: RootState) => state.app.profileReducer.profile?.id
  );
  const authStatus = useSelector(
    (state: RootState) => state.app.authReducer.value
  );
  const dispatch = useDispatch();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [dbError, setDbError] = useState<boolean>(false);
  const cursorImage = useRef<HTMLImageElement | null>(null);

  // useEffect(() => {
  //   cursorImage.current = new Image();
  //   cursorImage.current.src = `${INFURA_GATEWAY}/QmSvwVtnD6NRM64xRiPthdYRP8mW3jJHmCEohZMyr7zD4T`;
  //   cursorImage.current.onload = () => setImageLoaded(true);
  // }, []);

  // useEffect(() => {
  //   let userId = sessionStorage.getItem("userId");
  //   if (!userId) {
  //     userId = uuidv4();
  //     sessionStorage.setItem("userId", userId);
  //   }

  //   if (!firebaseApp || !canvasRef.current) {
  //     return;
  //   }

  //   const canvas = canvasRef.current;
  //   canvas.width = window.innerWidth;
  //   canvas.height = window.innerHeight;

  //   const context = canvas.getContext("2d");
  //   if (!context) {
  //     return;
  //   }

  //   try {
  //     const db = getDatabase(firebaseApp);
  //     const cursorRef = ref(db, `cursors/${userId}`);
  //     onDisconnect(cursorRef).remove();

  //     const handleMouseMove = (event: MouseEvent) => {
  //       const cursorPosition = {
  //         x: event.clientX,
  //         y: event.clientY,
  //         id: userId,
  //       };
  //       set(cursorRef, cursorPosition);
  //     };

  //     window.addEventListener("mousemove", handleMouseMove);

  //     const cursorsRef = ref(db, "cursors");
  //     onValue(cursorsRef, (snapshot) => {
  //       const cursorPositions = snapshot.val();
  //       if (cursorPositions) {
  //         context.clearRect(0, 0, canvas.width, canvas.height);
  //         Object.values(cursorPositions).forEach((position: any) => {
  //           if (position.id !== userId && imageLoaded && cursorImage.current) {
  //             context.drawImage(
  //               cursorImage.current,
  //               position.x - cursorImage.current.width / 2,
  //               position.y - cursorImage.current.height / 2
  //             );
  //           }
  //         });
  //       }
  //     });

  //     const handleUnload = () => {
  //       off(cursorRef);
  //       set(cursorRef, null);
  //     };

  //     window.addEventListener("unload", handleUnload);

  //     return () => {
  //       window.removeEventListener("mousemove", handleMouseMove);
  //       off(cursorsRef);
  //       window.removeEventListener("unload", handleUnload);
  //     };
  //   } catch (err: any) {
  //     setDbError(true);
  //     return;
  //   }
  // }, [firebaseApp, imageLoaded]);

  return (
    <div
      className="relative w-full h-full flex flex-col cursor-pixel"
      id="indexBody"
    >
      <div className="relative w-full h-full flex flex-row p-6 gap-10 justify-center z-10">
        <div className="relative w-full h-full flex flex-col items-center">
          <CollectBox
            collapseNumber={collapseNumber}
            dispatch={dispatch}
            index={0}
            collectGrant={collectGrant}
            collectors={collectors}
            collectorsLoading={collectorsLoading}
            collectLoading={collectLoading}
            getMorePostCollects={getMorePostCollects}
            hasMoreCollects={hasMoreCollects}
          />
          <MirrorBox
            collapseNumber={collapseNumber}
            dispatch={dispatch}
            index={1}
            mirrorGrant={mirrorGrant}
            likeGrant={likeGrant}
            mirrorLoading={mirrorLoading}
            likeLoading={likeLoading}
            getMorePostReactions={getMorePostReactions}
            getMorePostMirrors={getMorePostMirrors}
            mirrorers={mirrorers}
            reacters={reacters}
            reactInfoLoading={reactInfoLoading}
            mirrorInfoLoading={mirrorInfoLoading}
            hasMoreReact={hasMoreReact}
            hasMoreMirror={hasMoreMirror}
          />
          <ClaimedNFTBox
            collapseNumber={collapseNumber}
            dispatch={dispatch}
            index={2}
            getMoreProfiles={getMoreProfiles}
            NFTCollectors={NFTCollectors}
            hasMoreProfiles={hasMoreProfiles}
          />
        </div>
        <div className="relative w-full items-center h-full flex flex-col">
          <DynamicNFT
            mainURI={mainURI}
            currentCounter={currentCounter}
            handleMintDynamicNFT={handleMintDynamicNFT}
            editionAmount={editionAmount}
            canMint={canMint}
            mintLoading={mintLoading}
          />
          <GrantBox
            collapseNumber={collapseNumber}
            dispatch={dispatch}
            index={3}
            mainPostInfo={mainPostInfo}
            mainPostLoading={mainPostLoading}
          />
        </div>
        <div className="w-full h-full flex justify-center">
          <CommentBox
            collapseNumber={collapseNumber}
            dispatch={dispatch}
            index={4}
            commentGrant={commentGrant}
            commentors={commentors}
            getMorePostComments={getMorePostComments}
            commentsLoading={commentsLoading}
            hasMoreComments={hasMoreComments}
            hasMirrored={hasMirrored}
            hasReacted={hasReacted}
            commentorLoading={commentLoading}
            likeCommentLoading={likeCommentLoading}
            mirrorCommentLoading={mirrorCommentLoading}
            collectCommentLoading={collectCommentLoading}
            textElement={textElement}
            preElement={preElement}
            handleCommentDescription={handleCommentDescription}
            handleKeyDownDelete={handleKeyDownDelete}
            handleImagePaste={handleImagePaste}
            setImageLoading={setImageLoading}
            commentLoading={commentLoading}
            commentDescription={commentDescription}
            canComment={canComment}
            caretCoord={caretCoord}
            mentionProfiles={mentionProfiles}
            commentId={commentId}
            handleMentionClick={handleMentionClick}
            profilesOpen={profilesOpen}
            handleGifSubmit={handleGifSubmit}
            handleGif={handleGif}
            results={results}
            handleSetGif={handleSetGif}
            gifOpen={gifOpen}
            setGifOpen={setGifOpen}
            lensProfile={lensProfile}
            authStatus={authStatus}
            collectGrant={collectGrant}
            likeGrant={likeGrant}
            mirrorGrant={mirrorGrant}
            collectNotif={collectNotif}
            handleConnect={handleConnect}
            handleLensSignIn={handleLensSignIn}
            collectOpen={collectOpen}
            collectible={collectible}
            referral={referral}
            setReferral={setReferral}
            setCollectible={setCollectible}
            setCollectibleDropDown={setCollectibleDropDown}
            chargeCollect={chargeCollect}
            setChargeCollectDropDown={setChargeCollectDropDown}
            chargeCollectDropDown={chargeCollectDropDown}
            collectibleDropDown={collectibleDropDown}
            audienceTypes={audienceTypes}
            setAudienceType={setAudienceType}
            audienceType={audienceType}
            audienceDropDown={audienceDropDown}
            setAudienceDropDown={setAudienceDropDown}
            limitedEdition={limitedEdition}
            limit={limit}
            limitedDropDown={limitedDropDown}
            setLimitedDropDown={setLimitedDropDown}
            setTimeLimit={setTimeLimit}
            setChargeCollect={setChargeCollect}
            timeLimitDropDown={timeLimitDropDown}
            setTimeLimitDropDown={setTimeLimitDropDown}
            enabledCurrency={enabledCurrency}
            timeLimit={timeLimit}
            setCurrencyDropDown={setCurrencyDropDown}
            setLimitedEdition={setLimitedEdition}
            setLimit={setLimit}
            enabledCurrencies={enabledCurrencies}
            setEnabledCurrency={setEnabledCurrency}
            setValue={setValue}
            value={value}
            currencyDropDown={currencyDropDown}
            handleRemoveImage={handleRemoveImage}
            mappedFeaturedFiles={mappedFeaturedFiles}
            commentImages={commentImages}
            videoLoading={videoLoading}
            imageLoading={imageLoading}
            uploadVideo={uploadVideo}
            uploadImage={uploadImage}
          />
          <StoreFrontBox
            collapseNumber={collapseNumber}
            dispatch={dispatch}
            index={5}
            grantCollection={grantCollection}
            storeLoading={storeLoading}
            nextItem={nextItem}
            setNextItem={setNextItem}
            size={size}
            baseColor={baseColor}
            setSize={setSize}
            setBaseColor={setBaseColor}
            setPurchasePrice={setPurchasePrice}
            currency={currency}
            setCurrency={setCurrency}
            purchaseAmount={purchaseAmount}
            setPurchaseAmount={setPurchaseAmount}
            addItemToCart={addItemToCart}
            canCollect={canCollect}
            cartItems={cartItems}
          />
        </div>
      </div>
      <div className="relative w-full h-full">
        <canvas
          ref={canvasRef}
          className="fixed top-0 left-0 pointer-events-none"
          style={{ zIndex: 9999 }}
        />
      </div>
    </div>
  );
}
