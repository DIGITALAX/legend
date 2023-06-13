import { getAllGrants } from "@/graphql/subgraph/query/getAllGrants";
import { setGrants } from "@/redux/reducers/grantsSlice";
import { setHomeGrant } from "@/redux/reducers/homeGrantSlice";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { waitForTransaction } from "@wagmi/core";
import { useDispatch, useSelector } from "react-redux";
import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
  useSignTypedData,
} from "wagmi";
import DynamicNFTABI from "./../../../../abi/DynamicNFT.json";
import CollectNFTABI from "./../../../../abi/CollectNFT.json";
import {
  getPublication,
  getPublicationAuth,
} from "@/graphql/lens/query/getPublication";
import {
  ApprovedAllowanceAmount,
  Profile,
  Publication,
} from "@/components/home.types";
import checkIfMirrored from "@/lib/lens/helpers/checkIfMirrored";
import checkPostReactions from "@/lib/lens/helpers/checkPostReactions";
import { getProfiles } from "@/graphql/lens/query/getProfiles";
import { setIndexModal } from "@/redux/reducers/indexSlice";
import handleIndexCheck from "@/lib/lens/helpers/handleIndexCheck";
import { setError } from "@/redux/reducers/errorSlice";
import splitSignature from "@/lib/lens/helpers/splitSignature";
import broadcast from "@/graphql/lens/mutate/broadcast";
import omit from "@/lib/lens/helpers/omit";
import { setReactId } from "@/redux/reducers/reactIdSlice";
import addReaction from "@/graphql/lens/mutate/react";
import { mirror, mirrorDispatcher } from "@/graphql/lens/mutate/mirror";
import collect from "@/graphql/lens/mutate/collect";
import { LENS_HUB_PROXY_ADDRESS_MUMBAI } from "@/lib/constants";
import LensHubProxy from "./../../../../abi/LensHubProxy.json";
import useInteractions from "./useInteractions";
import pollUntilIndexed from "@/graphql/lens/query/checkIndexed";
import checkApproved from "@/lib/lens/helpers/checkApproved";
import { setCommentCollectValues } from "@/redux/reducers/commentCollectSlice";

const useMainGrant = () => {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const { commentors } = useInteractions();
  const allGrants = useSelector(
    (state: RootState) => state.app.grantsReducer.value
  );
  const authStatus = useSelector(
    (state: RootState) => state.app.reactIdReducer.value
  );
  const approvalArgs = useSelector(
    (state: RootState) => state.app.approvalArgsReducer.args
  );
  const lensProfile = useSelector(
    (state: RootState) => state.app.profileReducer.profile
  );
  const homeGrant = useSelector(
    (state: RootState) => state.app.homeGrantReducer.value
  );
  const collectInfo = useSelector(
    (state: RootState) => state.app.collectInfoReducer
  );
  const dispatcher = useSelector(
    (state: RootState) => state.app.dispatcherReducer.value
  );
  const [hasMoreProfiles, setHasMoreProfiles] = useState<boolean>(true);
  const [grantsLoading, setGrantsLoading] = useState<boolean>(false);
  const [mainPostLoading, setMainPostLoading] = useState<boolean>(false);
  const [slice, setSlice] = useState<number[]>([20, 40]);
  const [profilesPaginated, setProfilesPaginated] = useState<any>();
  const [NFTCollectors, setNFTCollectors] = useState<Profile[]>([]);
  const [mainPostInfo, setMainPostInfo] = useState<Publication>();
  const [mintLoading, setMintLoading] = useState<boolean>(false);
  const [canMint, setCanMint] = useState<boolean>(false);
  const [collectAddress, setCollectAddress] = useState<string>("");
  const [currentCounter, setCurrentCounter] = useState<number>(0);
  const [editionAmount, setEditionAmount] = useState<number>(0);
  const [mainURI, setMainURI] = useState<string>("");
  const [likeLoading, setLikeLoading] = useState<boolean>(false);
  const [collectLoading, setCollectLoading] = useState<boolean>(false);
  const [mirrorLoading, setMirrorLoading] = useState<boolean>(false);
  const [mirrorArgs, setMirrorArgs] = useState<any>();
  const [collectArgs, setCollectArgs] = useState<any>();
  const [approvalLoading, setApprovalLoading] = useState<boolean>(false);
  const [collectInfoLoading, setCollectInfoLoading] = useState<boolean>(false);
  const [mirrorCommentLoading, setMirrorCommentLoading] = useState<boolean[]>(
    Array.from({ length: commentors?.length }, () => false)
  );
  const [likeCommentLoading, setLikeCommentLoading] = useState<boolean[]>(
    Array.from({ length: commentors?.length }, () => false)
  );
  const [collectCommentLoading, setCollectCommentLoading] = useState<boolean[]>(
    Array.from({ length: commentors?.length }, () => false)
  );

  const { config: mirrorConfig, isSuccess } = usePrepareContractWrite({
    address: LENS_HUB_PROXY_ADDRESS_MUMBAI,
    abi: LensHubProxy,
    functionName: "mirrorWithSig",
    enabled: Boolean(mirrorArgs),
    args: [mirrorArgs],
  });

  const { writeAsync: mirrorWriteAsync } = useContractWrite(mirrorConfig);

  const { config: collectConfig, isSuccess: isSuccessCollect } =
    usePrepareContractWrite({
      address: LENS_HUB_PROXY_ADDRESS_MUMBAI,
      abi: LensHubProxy,
      functionName: "collectWithSig",
      enabled: Boolean(collectArgs),
      args: [collectArgs],
    });
  const { writeAsync: collectWriteAsync } = useContractWrite(collectConfig);

  const getGrants = async () => {
    setGrantsLoading(true);
    try {
      const data = await getAllGrants();

      if (
        !data ||
        !data.data.factoryDeployeds ||
        data.data.factoryDeployeds.length < 1
      ) {
        return;
      }
      dispatch(setGrants(data?.data?.factoryDeployeds));
      dispatch(setHomeGrant(data?.data?.factoryDeployeds[0]));
    } catch (err: any) {
      console.error(err.message);
    }
    setGrantsLoading(false);
  };

  const { data } = useContractReads({
    contracts: [
      {
        address: homeGrant?.dynamicNFTAddress as `0x${string}`,
        abi: DynamicNFTABI as any,
        functionName: "getCurrentCounter",
      },
      {
        address: homeGrant?.dynamicNFTAddress as `0x${string}`,
        abi: DynamicNFTABI as any,
        functionName: "getEditionAmount",
      },
      {
        address: homeGrant?.dynamicNFTAddress as `0x${string}`,
        abi: DynamicNFTABI as any,
        functionName: "tokenURI",
        args: [1],
      },
      {
        address: homeGrant?.dynamicNFTAddress as `0x${string}`,
        abi: DynamicNFTABI as any,
        functionName: "getCollectNFTAddress",
      },
      {
        address: homeGrant?.dynamicNFTAddress as `0x${string}`,
        abi: DynamicNFTABI as any,
        functionName: "getAllCollectors",
      },
    ],
    enabled: Boolean(homeGrant?.dynamicNFTAddress),
  });

  const { data: collectData } = useContractRead({
    address: collectAddress as `0x${string}`,
    abi: CollectNFTABI,
    functionName: "getCollectionSupply",
    enabled: Boolean(
      collectAddress &&
        collectAddress !== "0x0000000000000000000000000000000000000000"
    ),
  });

  const { config } = usePrepareContractWrite({
    address: homeGrant?.dynamicNFTAddress as `0x${string}`,
    abi: DynamicNFTABI,
    functionName: "safeMint",
    enabled: Boolean(canMint),
  });

  const { writeAsync } = useContractWrite(config);

  const canMintNFT = () => {
    if (!collectData) return;
    if (parseInt(String(collectData)) > 0) {
      setCanMint(true);
    }
  };

  const getNFTDetails = async () => {
    if (!data) return;
    setCollectAddress(data?.[3]?.result as any);
    setCurrentCounter(parseInt(data?.[0]?.result as any));
    setEditionAmount(parseInt(data?.[1]?.result as any));
    setMainURI(data?.[2]?.result as any);

    if (!data?.[4]?.result || data?.[4]?.result.length < 1) return;
    // get profiles
    try {
      const profs = await getProfiles({
        ownedBy: data?.[4]?.result?.slice(0, 20) as string[],
        limit: 20,
      });
      if (data?.[4]?.result?.length > 20) {
        setHasMoreProfiles(true);
      } else {
        setHasMoreProfiles(false);
      }
      setNFTCollectors(profs?.data?.profiles?.items);
      setProfilesPaginated(profs?.data?.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getMoreProfiles = async () => {
    try {
      if (!data?.[4]?.result) return;
      const profs = await getProfiles({
        ownedBy: data?.[4]?.result?.slice(...slice) as string[],
        limit: 20,
        cursor: profilesPaginated?.next,
      });
      if (data?.[4]?.result?.length > 20) {
        setHasMoreProfiles(true);
      } else {
        setHasMoreProfiles(false);
      }
      setNFTCollectors([...NFTCollectors, ...profs?.data?.profiles?.items]);
      setProfilesPaginated(profs?.data?.pageInfo);
      setSlice([slice[0] + 20, slice[1] + 20]);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleMintDynamicNFT = async () => {
    setMintLoading(true);
    try {
      const tx = await writeAsync?.();
      const res = await waitForTransaction({
        hash: tx?.hash!,
      });
      if (res.status === "success") {
        // dispatch success minted modal
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setMintLoading(false);
  };

  const getPostInfo = async () => {
    setMainPostLoading(true);
    try {
      let pubData;
      if (lensProfile?.id) {
        const { data } = await getPublicationAuth(
          {
            publicationId:
              lensProfile?.id +
              "-0x" +
              Number(homeGrant?.pubId).toString(16).padStart(2, "0"),
          },
          lensProfile?.id
        );

        pubData = data;
      } else {
        const { data } = await getPublication({
          publicationId:
            lensProfile?.id +
            "-0x" +
            Number(homeGrant?.pubId).toString(16).padStart(2, "0"),
        });
        pubData = data;
      }

      if (!pubData) {
        setMainPostLoading(false);
        return;
      }

      setMainPostInfo(pubData?.publication);

      let hasMirroredArr, hasReactedArr;
      if (lensProfile?.id) {
        hasMirroredArr = await checkIfMirrored(
          [pubData?.publication],
          lensProfile?.id
        );
        hasReactedArr = await checkPostReactions(
          {
            publicationId:
              lensProfile?.id +
              "-0x" +
              Number(homeGrant?.pubId).toString(16).padStart(2, "0"),
          },
          lensProfile?.id,
          true
        );
      }
      // dispatch(
      //   setIndividualFeedCount({
      //     actionLike: pubData?.publication?.stats.totalUpvotes,
      //     actionMirror: pubData?.publication?.stats.totalAmountOfMirrors,
      //     actionCollect: pubData?.publication?.stats.totalAmountOfCollects,
      //     actionComment: pubData?.publication?.stats.totalAmountOfComments,
      //     actionHasLiked: hasReactedArr ? hasReactedArr?.[0] : false,
      //     actionHasMirrored: hasMirroredArr ? hasMirroredArr?.[0] : false,
      //     actionHasCollected: decryptedData?.hasCollectedByMe,
      //   })
      // );
    } catch (err: any) {
      console.error(err.message);
    }
    setMainPostLoading(false);
  };

  const likeGrant = async (id?: string): Promise<void> => {
    let index: any, react: any;
    if (!id) {
      setLikeLoading(true);
      dispatch(
        setReactId(
          lensProfile?.id +
            "-0x" +
            Number(homeGrant?.pubId).toString(16).padStart(2, "0")
        )
      );
    } else {
      index = commentors?.findIndex((commentor) => commentor.id === id);
      if (index >= 0) {
        setLikeCommentLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = true;
          return updatedArray;
        });
      }
      setLikeLoading(true);
    }
    if (!lensProfile?.id && !authStatus) {
      setLikeLoading(false);
      if (index >= 0) {
        setLikeCommentLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = false;
          return updatedArray;
        });
      }
      return;
    }
    try {
      react = await addReaction({
        profileId: lensProfile?.id,
        reaction: "UPVOTE",
        publicationId: id
          ? id
          : lensProfile?.id +
            "-0x" +
            Number(homeGrant?.pubId).toString(16).padStart(2, "0"),
      });
    } catch (err: any) {
      setLikeLoading(false);
      console.error(err.message);
    }
    if (!id) {
      setLikeLoading(false);
    } else {
      setLikeCommentLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = false;
        return updatedArray;
      });
    }
    dispatch(
      setIndexModal({
        actionValue: true,
        actionMessage: "Successfully Indexed",
      })
    );
    setTimeout(() => {
      dispatch(
        setIndexModal({
          actionValue: false,
          actionMessage: undefined,
        })
      );
    }, 4000);
  };

  const mirrorGrant = async (id?: string): Promise<void> => {
    let index: any;

    if (!id) {
      setMirrorLoading(true);
      dispatch(
        setReactId(
          lensProfile?.id +
            "-0x" +
            Number(homeGrant?.pubId).toString(16).padStart(2, "0")
        )
      );
    } else {
      index = commentors.findIndex((commentor) => commentor.id === id);
      if (index >= 0) {
        setMirrorCommentLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = true;
          return updatedArray;
        });
      }
    }

    if (!lensProfile?.id && !authStatus) {
      setMirrorLoading(false);
      if (index >= 0) {
        setMirrorCommentLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = false;
          return updatedArray;
        });
      }
      return;
    }
    let mirrorPost: any;
    try {
      if (dispatcher) {
        mirrorPost = await mirrorDispatcher({
          profileId: lensProfile?.id,
          publicationId: id
            ? id
            : lensProfile?.id +
              "-0x" +
              Number(homeGrant?.pubId).toString(16).padStart(2, "0"),
          referenceModule: {
            followerOnlyReferenceModule: false,
          },
        });
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Indexing Interaction",
          })
        );
        setTimeout(async () => {
          await handleIndexCheck(
            mirrorPost?.data?.createMirrorViaDispatcher?.txHash,
            dispatch,
            true
          );
        }, 7000);
      } else {
        mirrorPost = await mirror({
          profileId: lensProfile?.id,
          publicationId: id
            ? id
            : lensProfile?.id +
              "-0x" +
              Number(homeGrant?.pubId).toString(16).padStart(2, "0"),
          referenceModule: {
            followerOnlyReferenceModule: false,
          },
        });

        const typedData: any = mirrorPost.data.createMirrorTypedData.typedData;

        const signature: any = await signTypedDataAsync({
          domain: omit(typedData?.domain, ["__typename"]),
          types: omit(typedData?.types, ["__typename"]) as any,
          message: omit(typedData?.value, ["__typename"]) as any,
          primaryType: "MirrorWithSig",
        });

        const broadcastResult: any = await broadcast({
          id: mirrorPost?.data?.createMirrorTypedData?.id,
          signature,
        });

        if (broadcastResult?.data?.broadcast?.__typename !== "RelayerResult") {
          const { v, r, s } = splitSignature(signature);
          const mirrorArgs = {
            profileId: typedData.value.profileId,
            profileIdPointed: typedData.value.profileIdPointed,
            pubIdPointed: typedData.value.pubIdPointed,
            referenceModuleData: typedData.value.referenceModuleData,
            referenceModule: typedData.value.referenceModule,
            referenceModuleInitData: typedData.value.referenceModuleInitData,
            sig: {
              v,
              r,
              s,
              deadline: typedData.value.deadline,
            },
          };
          setMirrorArgs(mirrorArgs);
        } else {
          dispatch(
            setIndexModal({
              actionValue: true,
              actionMessage: "Indexing Interaction",
            })
          );
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
    if (!id) {
      setMirrorLoading(false);
    } else {
      setMirrorCommentLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = false;
        return updatedArray;
      });
    }
  };

  const mirrorWrite = async (): Promise<void> => {
    setMirrorLoading(true);
    try {
      const tx = await mirrorWriteAsync?.();
      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: "Indexing Interaction",
        })
      );
      const res = await waitForTransaction({
        hash: tx?.hash!,
      });
      await handleIndexCheck(res?.transactionHash, dispatch, true);
    } catch (err: any) {
      setMirrorLoading(false);
      console.error(err.message);
    }
    setMirrorLoading(false);
  };

  const collectGrant = async (id?: string): Promise<void> => {
    let index: any;
    if (!id) {
      setCollectLoading(true);
      dispatch(
        setReactId(
          lensProfile?.id +
            "-0x" +
            Number(homeGrant?.pubId).toString(16).padStart(2, "0")
        )
      );
    } else {
      index = commentors.findIndex((commentor) => commentor.id === id);
      if (index >= 0) {
        setCollectCommentLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = true;
          return updatedArray;
        });
      }
    }

    if (!lensProfile?.id && !authStatus) {
      setCollectLoading(false);
      if (index >= 0) {
        setCollectCommentLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = false;
          return updatedArray;
        });
      }
      return;
    }
    try {
      const collectPost = await collect({
        publicationId: id
          ? id
          : lensProfile?.id +
            "-0x" +
            Number(homeGrant?.pubId).toString(16).padStart(2, "0"),
      });
      const typedData: any = collectPost.data.createCollectTypedData.typedData;
      const signature: any = await signTypedDataAsync({
        domain: omit(typedData?.domain, ["__typename"]),
        types: omit(typedData?.types, ["__typename"]) as any,
        message: omit(typedData?.value, ["__typename"]) as any,
        primaryType: "CollectWithSig",
      });

      const broadcastResult: any = await broadcast({
        id: collectPost?.data?.createCollectTypedData?.id,
        signature,
      });

      if (broadcastResult?.data?.broadcast?.__typename !== "RelayerResult") {
        const { v, r, s } = splitSignature(signature);
        const collectArgs = {
          collector: address,
          profileId: typedData.value.profileId,
          pubId: typedData.value.pubId,
          data: typedData.value.data,
          sig: {
            v,
            r,
            s,
            deadline: typedData.value.deadline,
          },
        };
        setCollectArgs(collectArgs);
      } else {
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Indexing Interaction",
          })
        );
        setTimeout(async () => {
          await handleIndexCheck(
            broadcastResult?.data?.broadcast?.txHash,
            dispatch,
            false
          );
        }, 7000);
      }
    } catch (err: any) {
      setCollectLoading(false);
      if (err.message.includes("You do not have enough")) {
        dispatch(
          setError({
            actionValue: true,
            actionMessage: "Insufficient Balance to Collect.",
          })
        );
      }
      console.error(err.message);
    }
    if (!id) {
      setCollectLoading(false);
    } else {
      if (index >= 0) {
        setCollectCommentLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = false;
          return updatedArray;
        });
      }
    }
  };

  const collectWrite = async (): Promise<void> => {
    setCollectLoading(true);
    try {
      const tx = await collectWriteAsync?.();
      // dispatch(
      //   setPurchase({
      //     actionOpen: false,
      //     actionId: "",
      //     actionIndex: undefined,
      //   })
      // );
      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: "Indexing Interaction",
        })
      );
      const res = await waitForTransaction({
        hash: tx?.hash!,
      });
      await handleIndexCheck(res?.transactionHash, dispatch, false);
    } catch (err: any) {
      console.error(err.message);
      if (err.message.includes("You do not have enough")) {
        dispatch(
          setError({
            actionValue: true,
            actionMessage: "Insufficient Balance to Collect.",
          })
        );
      }
      setCollectLoading(false);
    }
    setCollectLoading(false);
  };

  const getCollectInfo = async (): Promise<void> => {
    setCollectInfoLoading(true);
    try {
      let pubData: any;
      if (lensProfile?.id) {
        const { data } = await getPublicationAuth(
          {
            publicationId: collectInfo.id,
          },
          lensProfile?.id
        );
        pubData = data;
      } else {
        const { data } = await getPublication({
          publicationId: collectInfo.id,
        });
        pubData = data;
      }
      const collectModule = pubData?.publication?.collectModule;

      const approvalData: ApprovedAllowanceAmount | void = await checkApproved(
        collectModule?.amount?.asset?.address,
        collectModule?.type,
        null,
        null,
        collectModule?.amount?.value,
        dispatch,
        address,
        lensProfile?.id
      );
      const isApproved = parseInt(approvalData?.allowance as string, 16);
      dispatch(
        setCommentCollectValues({
          actionType: collectModule?.type,
          actionLimit: collectModule?.collectLimit,
          actionRecipient: collectModule?.recipient,
          actionReferralFee: collectModule?.referralFee,
          actionEndTime: collectModule?.endTimestamp,
          actionValue: collectModule?.value,
          actionFollowerOnly: collectModule?.followerOnly,
          actionAmount: {
            asset: {
              address: collectModule?.amount?.asset?.address,
              decimals: collectModule?.amount?.asset?.decimals,
              name: collectModule?.amount?.asset?.name,
              symbol: collectModule?.amount?.asset?.symbol,
            },
            value: collectModule?.amount?.value,
          },
          actionCanCollect: pubData?.publication?.hasCollectedByMe,
          actionApproved:
            collectModule?.type === "FreeCollectModule" ||
            isApproved > collectModule?.amount?.value ||
            (collectModule?.__typename === "SimpleCollectModuleSettings" &&
              !collectModule.amount &&
              !collectModule.optionalCollectLimit &&
              !collectModule.optionalEndTimestamp)
              ? true
              : false,
          actionTotalCollects:
            pubData?.publication?.stats?.totalAmountOfCollects,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setCollectInfoLoading(false);
  };

  const { config: approvalConfig } = usePrepareSendTransaction({
    to: approvalArgs?.to,
    account: approvalArgs?.from as `0x${string}`,
    value: approvalArgs?.data as any,
    // enabled: Boolean(approvalSendEnabled),
  });

  const { sendTransactionAsync, isSuccess: approvalSuccess } =
    useSendTransaction(approvalConfig);

  const callApprovalSign = async (): Promise<void> => {
    try {
      const tx = await sendTransactionAsync?.();
      const res = await waitForTransaction({
        hash: tx?.hash!,
      });
      await pollUntilIndexed(res?.transactionHash as string, false);
      await getCollectInfo();
    } catch (err: any) {
      setApprovalLoading(false);
      console.error(err.message);
    }
  };

  const approveCurrency = async (): Promise<void> => {
    setApprovalLoading(true);
    try {
      await callApprovalSign();
    } catch (err: any) {
      console.error(err.message);
    }
    setApprovalLoading(false);
  };

  useEffect(() => {
    if (isSuccess) {
      mirrorWrite();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccessCollect) {
      collectWrite();
    }
  }, [isSuccessCollect]);

  useEffect(() => {
    if (
      collectAddress &&
      collectAddress !== "0x0000000000000000000000000000000000000000"
    ) {
      canMintNFT();
    }
  }, [collectAddress]);

  useEffect(() => {
    if (allGrants.length < 1) {
      getGrants();
    }
  }, [allGrants]);

  useEffect(() => {
    if (homeGrant) {
      getNFTDetails();
    }
  }, [homeGrant, data]);

  useEffect(() => {
    if (homeGrant) {
      getPostInfo();
    }
  }, [homeGrant]);

  return {
    grantsLoading,
    mainURI,
    handleMintDynamicNFT,
    currentCounter,
    editionAmount,
    canMint,
    mintLoading,
    NFTCollectors,
    mainPostLoading,
    mainPostInfo,
    getMoreProfiles,
    collectGrant,
    mirrorGrant,
    likeGrant,
    likeLoading,
    collectLoading,
    mirrorLoading,
    mirrorCommentLoading,
    collectCommentLoading,
    likeCommentLoading,
    collectInfoLoading,
    approvalLoading,
    approveCurrency,
    hasMoreProfiles,
  };
};

export default useMainGrant;
