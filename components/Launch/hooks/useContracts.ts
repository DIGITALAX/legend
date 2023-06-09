import {
  FACTORY_CONTRACT_MUMBAI,
  LENS_HUB_PROXY_ADDRESS_MUMBAI,
} from "@/lib/constants";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import LegendFactoryAbi from "./../../../abi/LegendFactory.json";
import { useEffect, useState } from "react";
import { waitForTransaction } from "@wagmi/core";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { profilePublications } from "@/graphql/lens/query/getPublications";
import nextHex from "@/lib/lens/helpers/nextHex";
import { useRouter } from "next/router";
import { setContractValues } from "@/redux/reducers/contractValuesSlice";
import { setPubId } from "@/redux/reducers/pubIdSlice";

const useContracts = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pubId = useSelector(
    (state: RootState) => state.app.pubIdReducer?.pubId
  );
  const profileId = useSelector(
    (state: RootState) => state.app.profileReducer.profile?.id
  );
  const postValues = useSelector(
    (state: RootState) => state.app.postValuesReducer.value
  );
  const NFTValues = useSelector(
    (state: RootState) => state.app.NFTImageArrayReducer.value
  );
  const [createContractsLoading, setCreateContractsLoading] =
    useState<boolean>(false);

  const { config } = usePrepareContractWrite({
    address: FACTORY_CONTRACT_MUMBAI,
    abi: LegendFactoryAbi,
    args: [
      pubId,
      profileId && parseInt(profileId, 16),
      {
        lensHubProxyAddress: LENS_HUB_PROXY_ADDRESS_MUMBAI,
        legendFactoryAddress: FACTORY_CONTRACT_MUMBAI,
        URIArrayValue: NFTValues,
        grantNameValue: postValues.title,
        editionAmountValue: postValues.editionAmount,
      },
    ],
    functionName: "createContracts",
    enabled: Boolean(NFTValues.length > 0),
  });

  const { writeAsync } = useContractWrite(config);

  const getLastPost = async () => {
    try {
      const { data } = await profilePublications({
        profileId,
        publicationTypes: ["POST"],
        limit: 1,
      });
      if (!data || !data || data?.publications?.items?.length < 1) {
        dispatch(setPubId(1));
      } else {
        const next = nextHex(data?.publications?.items[0]?.id.split("-")[1]);
        dispatch(setPubId(parseInt(next, 16)));
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const createContracts = async () => {
    setCreateContractsLoading(true);
    try {
      const tx = await writeAsync?.();
      const res = await waitForTransaction({
        hash: tx?.hash!,
      });
      if (res.status === "success") {
        const cleanedHexString = res.logs[1].data?.slice(2);
        const chunks = cleanedHexString.match(/.{1,64}/g);
        dispatch(
          setContractValues([
            "0x" + chunks?.[0].slice(24),
            "0x" + chunks?.[1].slice(24),
            "0x" + chunks?.[2].slice(24),
          ])
        );
        // set factory deployed text to null so they cant deploy again
      } else {
        // cause an error here / dispatch / cant have same name!!
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setCreateContractsLoading(false);
  };

  useEffect(() => {
    if (router.asPath.includes("launch") && profileId) {
      getLastPost();
    }
  }, [profileId, router.asPath]);

  return {
    createContractsLoading,
    createContracts,
  };
};

export default useContracts;
