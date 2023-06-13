import { LENS_HUB_PROXY_ADDRESS_MATIC } from "@/lib/constants";
import {
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { waitForTransaction } from "@wagmi/core";
import {
  useContractWrite,
  usePrepareContractWrite,
  useSignTypedData,
} from "wagmi";
import LensHubProxy from "../../../../abi/LensHubProxy.json";
import { RootState } from "@/redux/store";
import { splitSignature } from "ethers/lib/utils.js";
import { omit } from "lodash";
import {
  getCommentData,
  removeCommentData,
  setCommentData,
} from "@/lib/lens/utils";
import { MediaType, Profile, UploadedMedia } from "@/components/home.types";
import getPostHTML from "@/lib/lens/helpers/getPostHTML";
import { setIndexModal } from "@/redux/reducers/indexSlice";
import uploadPostContent from "@/lib/lens/helpers/uploadPostContent";
import {
  createCommentTypedData,
  createDispatcherCommentData,
} from "@/graphql/lens/mutate/comment";
import handleIndexCheck from "@/lib/lens/helpers/handleIndexCheck";
import broadcast from "@/graphql/lens/mutate/broadcast";
import getCaretPos from "@/lib/lens/helpers/getCaretPos";
import { searchProfile } from "@/graphql/lens/query/searchProfile";
import useImageUpload from "@/components/Launch/hooks/useImageUpload";
import { setCommentImages } from "@/redux/reducers/commentImagesSlice";
import { setCollectOpen } from "@/redux/reducers/collectOpenSlice";

const useComment = () => {
  const [commentLoading, setCommentLoading] = useState<boolean>(false);
  const [commentArgs, setCommentArgs] = useState<any>();
  const [commentDescription, setCommentDescription] = useState<string>("");
  const [caretCoord, setCaretCoord] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [gifOpen, setGifOpen] = useState<boolean>(false);
  const [profilesOpen, setProfilesOpen] = useState<boolean>(false);
  const textElement = useRef<HTMLTextAreaElement>(null);
  const preElement = useRef<HTMLPreElement>(null);
  const [mentionProfiles, setMentionProfiles] = useState<Profile[]>([]);
  const [results, setResults] = useState<any>([]);
  const [gifs, setGifs] = useState<UploadedMedia[]>(
    JSON.parse(getCommentData() || "{}").images || []
  );
  const [searchGif, setSearchGif] = useState<boolean>(false);
  const [commentHTML, setCommentHTML] = useState<string>("");
  const [contentURI, setContentURI] = useState<string>();
  const { signTypedDataAsync } = useSignTypedData();
  const { uploadImage } = useImageUpload();
  const dispatch = useDispatch();
  const profileId = useSelector(
    (state: RootState) => state.app.profileReducer.profile?.id
  );
  const homeGrant = useSelector(
    (state: RootState) => state.app.homeGrantReducer.value
  );
  const collectOpen = useSelector(
    (state: RootState) => state.app.collectOpenReducer.value
  );
  const commentId = useSelector(
    (state: RootState) => state.app.secondaryCommentReducer.value
  );
  const dispatcher = useSelector(
    (state: RootState) => state.app.dispatcherReducer.value
  );
  const commentImages = useSelector(
    (state: RootState) => state?.app?.commentImagesReducer?.value
  );
  const collectModuleType = useSelector(
    (state: RootState) => state?.app?.collectValueTypeReducer?.type
  );

  const { config: commentConfig, isSuccess: commentSuccess } =
    usePrepareContractWrite({
      address: LENS_HUB_PROXY_ADDRESS_MATIC,
      abi: LensHubProxy,
      functionName: "commentWithSig",
      enabled: Boolean(commentArgs),
      args: [commentArgs],
    });

  const { writeAsync: commentWriteAsync } = useContractWrite(commentConfig);

  const handleGif = (e: FormEvent): void => {
    setSearchGif((e.target as HTMLFormElement).value);
  };

  const handleGifSubmit = async (): Promise<void> => {
    const getGifs = await fetch("/api/giphy", {
      method: "POST",
      body: JSON.stringify(searchGif),
    });
    const allGifs = await getGifs.json();
    setResults(allGifs?.json?.results);
  };

  const handleSetGif = (result: any): void => {
    if ((commentImages as any)?.length < 4) {
      setGifs([
        ...(commentImages as any),
        {
          cid: result,
          type: MediaType.Gif,
        },
      ]);
      const postStorage = JSON.parse(getCommentData() || "{}");
      setCommentData(
        JSON.stringify({
          ...postStorage,
          images: [
            ...(commentImages as any),
            {
              cid: result,
              type: MediaType.Gif,
            },
          ],
        })
      );
    }
  };

  const handleKeyDownDelete = (e: KeyboardEvent<Element>) => {
    const highlightedContent = document.querySelector("#highlighted-content2")!;
    const selection = window.getSelection();
    const postStorage = JSON.parse(getCommentData() || "{}");
    if (e.key === "Backspace" && selection?.toString() !== "") {
      const start = textElement.current!.selectionStart;
      const end = textElement.current!.selectionEnd;

      if (start === 0 && end === textElement.current!.value?.length) {
        setCommentDescription("");
        setCommentHTML("");
        // highlightedContent.innerHTML = "";
        setCommentData(
          JSON.stringify({
            ...postStorage,
            post: "",
          })
        );
      } else {
        const selectedText = selection!.toString();
        const selectedHtml = highlightedContent.innerHTML.substring(start, end);
        const strippedHtml = selectedHtml?.replace(
          /( style="[^"]*")|( style='[^']*')/g,
          ""
        );
        const strippedText = selectedText?.replace(/<[^>]*>/g, "");

        const newHTML =
          commentHTML.slice(0, start) + strippedHtml + commentHTML.slice(end);
        const newDescription =
          commentDescription.slice(0, start) +
          strippedText +
          commentDescription.slice(end);

        setCommentHTML(newHTML);
        setCommentDescription(newDescription);
        (e.currentTarget! as any).value = newDescription;
        // highlightedContent.innerHTML = newHTML;
        setCommentData(
          JSON.stringify({
            ...postStorage,
            post: newDescription,
          })
        );
      }
    } else if (
      e.key === "Backspace" &&
      commentDescription?.length === 0 &&
      commentHTML?.length === 0
    ) {
      (e.currentTarget! as any).value = "";
      // highlightedContent.innerHTML = "";
      setCommentData(
        JSON.stringify({
          ...postStorage,
          post: "",
        })
      );
      e.preventDefault();
    }
  };

  const handleCommentDescription = async (e: any): Promise<void> => {
    let resultElement = document.querySelector("#highlighted-content2");
    const newValue = e.target.value.endsWith("\n")
      ? e.target.value + " "
      : e.target.value;
    setCommentHTML(getPostHTML(e, resultElement as Element));
    setCommentDescription(newValue);
    const postStorage = JSON.parse(getCommentData() || "{}");
    setCommentData(
      JSON.stringify({
        ...postStorage,
        post: e.target.value,
      })
    );
    if (
      e.target.value.split(" ")[e.target.value.split(" ")?.length - 1][0] ===
        "@" &&
      e.target.value.split(" ")[e.target.value.split(" ")?.length - 1]
        ?.length === 1
    ) {
      setCaretCoord(getCaretPos(e, textElement));
      setProfilesOpen(true);
    }
    if (
      e.target.value.split(" ")[e.target.value.split(" ")?.length - 1][0] ===
      "@"
    ) {
      const allProfiles = await searchProfile({
        query: e.target.value.split(" ")[e.target.value.split(" ")?.length - 1],
        type: "PROFILE",
        limit: 10,
      });
      setMentionProfiles(allProfiles?.data?.search?.items);
    } else {
      setProfilesOpen(false);
      setMentionProfiles([]);
    }
  };

  const clearComment = () => {
    setCommentLoading(false);
    setCommentDescription("");
    setCommentHTML("");
    setGifs([]);
    dispatch(setCommentImages([]));
    dispatch(setCollectOpen(false));
    setGifOpen(false);
    // (document as any).querySelector("#highlighted-content").innerHTML = "";
    removeCommentData();
    dispatch(
      setIndexModal({
        actionValue: true,
        actionMessage: "Indexing Interaction",
      })
    );
  };

  const commentGrant = async (): Promise<void> => {
    if (
      (!commentDescription ||
        commentDescription === "" ||
        commentDescription.trim()?.length < 0) &&
      (!commentImages?.length || commentImages?.length < 1)
    ) {
      return;
    }
    setCommentLoading(true);
    let result: any;
    try {
      const contentURIValue = await uploadPostContent(
        commentImages,
        commentDescription,
        setContentURI,
        contentURI,
        dispatch
      );
      if (dispatcher) {
        result = await createDispatcherCommentData({
          profileId: profileId,
          publicationId:
            commentId !== ""
              ? commentId
              : profileId +
                "-0x" +
                Number(homeGrant?.pubId).toString(16).padStart(2, "0"),
          contentURI: "ipfs://" + contentURIValue,
          collectModule: collectModuleType,
          referenceModule: {
            followerOnlyReferenceModule: false,
          },
        });
        clearComment();
        setTimeout(async () => {
          await handleIndexCheck(
            result?.data?.createCommentViaDispatcher?.txHash,
            dispatch,
            true
          );
        }, 7000);
      } else {
        result = await createCommentTypedData({
          profileId: profileId,
          publicationId:
            commentId !== ""
              ? commentId
              : profileId +
                "-0x" +
                Number(homeGrant?.pubId).toString(16).padStart(2, "0"),
          contentURI: "ipfs://" + contentURIValue,
          collectModule: collectModuleType,
          referenceModule: {
            followerOnlyReferenceModule: false,
          },
        });

        const typedData: any = result.data.createCommentTypedData.typedData;

        const signature: any = await signTypedDataAsync({
          domain: omit(typedData?.domain, ["__typename"]),
          types: omit(typedData?.types, ["__typename"]) as any,
          message: omit(typedData?.value, ["__typename"]) as any,
          primaryType: "CommentWithSig",
        });

        const broadcastResult: any = await broadcast({
          id: result?.data?.createCommentTypedData?.id,
          signature,
        });

        if (broadcastResult?.data?.broadcast?.__typename !== "RelayerResult") {
          const { v, r, s } = splitSignature(signature);

          const commentArgs = {
            profileId: typedData.value.profileId,
            contentURI: typedData.value.contentURI,
            profileIdPointed: typedData.value.profileIdPointed,
            pubIdPointed: typedData.value.pubIdPointed,
            referenceModuleData: typedData.value.referenceModuleData,
            referenceModule: typedData.value.referenceModule,
            referenceModuleInitData: typedData.value.referenceModuleInitData,
            collectModule: typedData.value.collectModule,
            collectModuleInitData: typedData.value.collectModuleInitData,
            sig: {
              v,
              r,
              s,
              deadline: typedData.value.deadline,
            },
          };
          setCommentArgs(commentArgs);
        } else {
          clearComment();
          setTimeout(async () => {
            await handleIndexCheck(
              broadcastResult?.data?.broadcast?.txHash,
              dispatch,
              true
            );
          }, 7000);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setCommentLoading(false);
  };

  const handleCommentWrite = async (): Promise<void> => {
    setCommentLoading(true);
    try {
      const tx = await commentWriteAsync?.();
      clearComment();
      const res = await waitForTransaction({
        hash: tx?.hash!,
      });
      await handleIndexCheck(res?.transactionHash, dispatch, true);
    } catch (err) {
      console.error(err);
      setCommentLoading(false);
    }
  };

  const handleImagePaste = async (
    e: ClipboardEvent<HTMLTextAreaElement>,
    setImageLoading: (e: boolean) => void
  ) => {
    setImageLoading(true);
    const items = e.clipboardData?.items;
    if (!items) return;
    let files: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        e.preventDefault();
        e.stopPropagation();
        const file = items[i].getAsFile();
        files.push(file as File); // Add the File to the array.
      }
    }
    if (files.length > 0) {
      await uploadImage(files, true);
      setImageLoading(false);
    } else {
      setImageLoading(false);
    }
  };

  const handleMentionClick = (user: any) => {
    setProfilesOpen(false);
    let resultElement = document.querySelector("#highlighted-content2");
    const newHTMLPost =
      commentHTML?.substring(0, commentHTML.lastIndexOf("@")) +
      `@${user?.handle}</span>`;
    const newElementPost =
      commentDescription?.substring(0, commentDescription.lastIndexOf("@")) +
      `@${user?.handle}`;
    setCommentDescription(newElementPost);

    const postStorage = JSON.parse(getCommentData() || "{}");
    setCommentData(
      JSON.stringify({
        ...postStorage,
        post: newElementPost,
      })
    );

    // if (newHTMLPost) (resultElement as any).innerHTML = newHTMLPost;
    setCommentHTML(newHTMLPost);
  };

  useEffect(() => {
    if (commentSuccess) {
      handleCommentWrite();
    }
  }, [commentSuccess]);

  useEffect(() => {
    const savedData = getCommentData();
    if (savedData && JSON.parse(savedData).post) {
      setCommentDescription(JSON.parse(savedData).post);

      let resultElement = document.querySelector("#highlighted-content2");
      if (
        JSON.parse(savedData).post[JSON.parse(savedData).post?.length - 1] ==
        "\n"
      ) {
        JSON.parse(savedData).post += " ";
      }
      setCommentHTML(
        getPostHTML(JSON.parse(savedData).post, resultElement as Element, true)
      );
    }
  }, []);

  useEffect(() => {
    dispatch(setCommentImages(gifs));
  }, [gifs]);

  useEffect(() => {
    if (document.querySelector("#highlighted-content2")) {
      document.querySelector("#highlighted-content2")!.innerHTML =
        commentHTML.length === 0 ? "Have something to say?" : commentHTML;
    }
  }, [commentHTML, gifOpen, collectOpen]);

  return {
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
  };
};

export default useComment;
