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
import { setKeeperAddress } from "@/redux/reducers/keeperAddressSlice";

const useContracts = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const profileId = useSelector(
    (state: RootState) => state.app.profileReducer.profile?.id
  );
  const postValues = useSelector(
    (state: RootState) => state.app.postValuesReducer.value
  );
  const NFTValues = useSelector(
    (state: RootState) => state.app.NFTImageArrayReducer.value
  );
  const [pubId, setPubId] = useState<number>();
  const [URIValues, setURIValues] = useState<string[]>([]);
  const [createContractsLoading, setCreateContractsLoading] =
    useState<boolean>(false);
  const [addresses, setAddresses] = useState<string[]>([]);

  const { config } = usePrepareContractWrite({
    address: FACTORY_CONTRACT_MUMBAI,
    abi: LegendFactoryAbi,
    args: [
      pubId,
      profileId && parseInt(profileId, 16),
      {
        lensHubProxyAddress: LENS_HUB_PROXY_ADDRESS_MUMBAI,
        legendFactoryAddress: FACTORY_CONTRACT_MUMBAI,
        URIArrayValue: URIValues,
        grantNameValue: postValues.title,
        editionAmountValue: postValues.editionAmount,
      },
    ],
    functionName: "createContracts",
    enabled: Boolean(URIValues.length > 0),
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
        setPubId(1);
      } else {
        const next = nextHex(data?.publications?.items[0]?.id.split("-")[1]);
        setPubId(parseInt(next, 16));
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const updateNFTArray = () => {
    let adjustedArray: string[] = [];
    const inputLength = NFTValues.length;

    if (inputLength === postValues.editionAmount) {
      return NFTValues;
    } else if (inputLength > postValues.editionAmount) {
      return NFTValues.slice(0, postValues.editionAmount);
    } else {
      let multiple = Math.floor(postValues.editionAmount / inputLength);
      let remainder = postValues.editionAmount % inputLength;

      for (let i = 0; i < inputLength; i++) {
        let tempArray = new Array(multiple).fill(NFTValues[i]);

        if (remainder > 0) {
          tempArray.push(NFTValues[i]);
          remainder--;
        }

        adjustedArray = [...adjustedArray, ...tempArray];
      }
    }
    setURIValues(adjustedArray);
  };

  const createContracts = async () => {
    setCreateContractsLoading(true);
    try {
      const tx = await writeAsync?.();
      const res = await waitForTransaction({
        hash: tx?.hash!,
      });
      if (res.status === "success") {
        setAddresses(res.logs.map((log) => log.address));
        dispatch(setKeeperAddress(res.logs.map((log) => log.address)[1]));
        // for (let i = 0; i < addresses.length; i++) {
        //   await fetch("/api/etherscan", {
        //     method: "POST",
        //     body: JSON.stringify({
        //       address: addresses[i],
        //     }),
        //   });
        // }
      } else {
        // cause an error here
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setCreateContractsLoading(false);
  };

  useEffect(() => {
    if (router.asPath.includes("launch") && profileId) {
      getLastPost();
      updateNFTArray();
    }
  }, [profileId, router.asPath]);

  return {
    createContractsLoading,
    createContracts,
    addresses,
  };
};

export default useContracts;
