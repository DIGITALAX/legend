import {
  FACTORY_CONTRACT_MUMBAI,
  LENS_HUB_PROXY_ADDRESS_MUMBAI,
} from "@/lib/constants";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import LegendFactoryAbi from "./../../../abi/LegendFactory.json";
import { useEffect, useState } from "react";
import { waitForTransaction } from "@wagmi/core";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import { setContractValues } from "@/redux/reducers/contractValuesSlice";
import { setPubId } from "@/redux/reducers/pubIdSlice";
import LensHubProxyABI from "./../../../abi/LensHubProxy.json";

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

  const { config, error } = usePrepareContractWrite({
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
    enabled: Boolean(NFTValues.length > 0 && profileId),
  });

  const { writeAsync } = useContractWrite(config);

  const { data } = useContractRead({
    address: LENS_HUB_PROXY_ADDRESS_MUMBAI,
    abi: LensHubProxyABI,
    functionName: "getPubCount",
    args: [parseInt(profileId, 16)],
    enabled: Boolean(profileId),
  });

  const getLastPost = async () => {
    try {
      if (!data) return;
      if (parseInt(String(data)) === 0) {
        dispatch(setPubId(1));
      } else {
        // const next = nextHex(String(parseInt(String(data))));
        dispatch(setPubId(parseInt(String(data)) + 1));
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
