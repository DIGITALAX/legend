import { ACCEPTED_TOKENS, LEGEND_MARKET_MUMBAI } from "@/lib/constants";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { waitForTransaction } from "@wagmi/core";
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useAccount,
} from "wagmi";
import { BigNumber } from "ethers";
import LegendMarketplaceABI from "./../../../abi/LegendMarketplace.json";
import { setIndexModal } from "@/redux/reducers/indexSlice";
import { setError } from "@/redux/reducers/errorSlice";
import { setCartItems } from "@/redux/reducers/cartItemsSlice";
import DynamicNFTABI from "./../../../abi/DynamicNFT.json";
import { useRouter } from "next/router";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { setLitClient } from "@/redux/reducers/litClientSlice";

const useFulfillment = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const chosenCollection = useSelector(
    (state: RootState) => state.app.chosenCollectionReducer.value
  );
  const lit = useSelector((state: RootState) => state.app.litClientReducer);
  const cartItems = useSelector(
    (state: RootState) => state.app.cartItemsReducer.value
  );
  const { address } = useAccount();
  const [tokenIds, setTokenIds] = useState<
    { tokenId: string; chosenAddress: string }[]
  >([]);
  const [baseColor, setBaseColor] = useState<string>("blue");
  const [canCollect, setCanCollect] = useState<boolean>(true);
  const [fulfillmentDetails, setFulfillmentDetails] = useState<
    string | undefined
  >();
  const [purchaseAmount, setPurchaseAmount] = useState<number>(0);
  const [purchasePrice, setPurchasePrice] = useState<string>("0");
  const [size, setSize] = useState<string>("m");
  const [currency, setCurrency] = useState<string>(
    ACCEPTED_TOKENS.filter(
      (token) =>
        token[1]?.toLowerCase() ===
        chosenCollection?.acceptedTokens?.[0]?.toLowerCase()
    )?.[0]?.[0] ?? "MONA"
  );
  const [purchaseLoading, setPurchaseLoading] = useState<boolean>(false);
  const [totalAmounts, setTotalAmounts] = useState<
    { purchaseToken: string; totalPrice: number }[]
  >([]);
  const [index, setIndex] = useState<number>();
  const [approved, setApproved] = useState<boolean[]>(
    Array.from({ length: totalAmounts.length })
  );
  const [addressArg, setAddressArg] = useState<
    | {
        newAddress: string;
        totalPrice: bigint;
      }
    | undefined
  >();

  const { data: canCollectData } = useContractRead({
    address: chosenCollection?.dynamicNFTAddress as `0x${string}`,
    abi: DynamicNFTABI,
    functionName: "getCollectorClaimedNFT",
    args: [address as `0x${string}`],
    enabled: Boolean(router.asPath.includes("collection")),
  });

  const { data } = useContractRead({
    address: addressArg?.newAddress as `0x${string}`,
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
        ],
        name: "allowance",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "allowance",
    args: [address as `0x${string}`, LEGEND_MARKET_MUMBAI],
    enabled: Boolean(addressArg?.newAddress),
  });

  const { config } = usePrepareContractWrite({
    address: addressArg?.newAddress as `0x${string}`,
    abi: [
      currency === "MONA"
        ? {
            inputs: [
              { internalType: "address", name: "spender", type: "address" },
              { internalType: "uint256", name: "tokens", type: "uint256" },
            ],
            name: "approve",
            outputs: [{ internalType: "bool", name: "success", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
          }
        : currency === "WMATIC"
        ? {
            constant: false,
            inputs: [
              { name: "guy", type: "address" },
              { name: "wad", type: "uint256" },
            ],
            name: "approve",
            outputs: [{ name: "", type: "bool" }],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          }
        : {
            inputs: [
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "approve",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
    ],
    functionName: "approve",
    args: [
      LEGEND_MARKET_MUMBAI,
      addressArg?.totalPrice
        ? addressArg?.totalPrice
        : BigNumber.from("0").toBigInt(),
    ],
    enabled: Boolean(addressArg?.newAddress),
  });

  const { config: buyNFTConfig } = usePrepareContractWrite({
    address: LEGEND_MARKET_MUMBAI,
    abi: LegendMarketplaceABI,
    args: [
      tokenIds.map((item) => item.tokenId),
      tokenIds.map((item) => item.chosenAddress),
      fulfillmentDetails,
    ],
    functionName: "buyTokens",
    enabled: Boolean(fulfillmentDetails),
  });

  const { writeAsync, isSuccess } = useContractWrite(config);
  const { writeAsync: buyNFTAsync, isSuccess: isSuccessNFT } =
    useContractWrite(buyNFTConfig);

  const getTokenIds = (): void => {
    let newTokenIds: { tokenId: string; chosenAddress: string }[] = [];
    let highestSoldTokensPerCollection: { [key: string]: number } = {};

    cartItems.forEach((item) => {
      let highestSoldToken =
        highestSoldTokensPerCollection[item.collectionId] || 0;
      if (item?.soldTokens && item?.soldTokens.length > 0) {
        highestSoldToken = Math.max(highestSoldToken, ...item.soldTokens);
      }

      for (let j = 0; j < item.purchaseAmount; j++) {
        newTokenIds.push({
          tokenId: String(highestSoldToken + j + 1),
          chosenAddress: item.purchaseToken,
        });
      }

      highestSoldTokensPerCollection[item.collectionId] =
        highestSoldToken + item.purchaseAmount;
    });

    setTokenIds(newTokenIds);
  };

  console.log({ tokenIds });

  const approveSpend = async (
    newAddress: string,
    totalPrice: number,
    index: number
  ) => {
    setPurchaseLoading(true);
    try {
      setIndex(index);
      setAddressArg({
        newAddress: ACCEPTED_TOKENS.find(
          ([tokenName]) => tokenName === newAddress
        )?.[1]!,
        totalPrice: BigNumber.from(
          (totalPrice.toString() + newAddress === "USDT"
            ? "000000"
            : "000000000000000000"
          ).slice(0, 78)
        ).toBigInt(),
      });
    } catch (err: any) {
      setPurchaseLoading(false);
      console.error(err.message);
    }
    setPurchaseLoading(false);
  };

  const writeSpend = async () => {
    setPurchaseLoading(true);
    try {
      const tx = await writeAsync?.();
      const res = await waitForTransaction({
        hash: tx?.hash!,
      });
      if (res.status === "success") {
        setApproved(
          approved.map((value, indexTwo) => (indexTwo === index ? true : value))
        );
        setAddressArg(undefined);
      }
    } catch (err: any) {
      setPurchaseLoading(false);
      console.error(err.message);
    }
    setPurchaseLoading(false);
  };

  const connectLit = async () => {
    try {
      const client = new LitJsSdk.LitNodeClient({ debug: false });
      await client.connect();
      dispatch(
        setLitClient({
          actionClient: client,
          actionDecrypt: lit.decrypt,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const buyNFT = async (): Promise<void> => {
    if (!tokenIds?.length || tokenIds?.length < 1) return;
    setPurchaseLoading(true);
    try {
      // encrypt fulfillment
      await connectLit();
      const authSig = await LitJsSdk.checkAndSignAuthMessage({
        chain: "mumbai",
      });
      const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
        fulfillmentDetails as string
      );
      const encryptedSymmetricKey = await lit.client.saveEncryptionKey({
        accessControlConditions: [
          {
            contractAddress: "",
            standardContractType: "",
            chain: "mumbai",
            method: "eth_getBalance",
            parameters: [":userAddress"],
            returnValueTest: {
              comparator: ">=",
              value: "0",
            },
          },
        ],
        symmetricKey,
        authSig,
        chain: "mumbai",
      });
      const storageString = await encryptedString.arrayBuffer();
      setFulfillmentDetails(
        JSON.stringify({
          encryptedString: JSON.stringify(
            Array.from(new Uint8Array(storageString))
          ),
          encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
            encryptedSymmetricKey,
            "base16"
          ),
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setPurchaseLoading(false);
  };

  const writeBuy = async () => {
    setPurchaseLoading(true);
    try {
      const tx = await buyNFTAsync?.();
      await waitForTransaction({
        hash: tx?.hash!,
      });
      //   dispatch(
      //     setSuccess({
      //       actionOpen: true,
      //       actionMedia: success.media,
      //       actionName: success.name,
      //     })
      //   );
      setTimeout(() => {
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Purchase Successful",
          })
        );
      }, 5000);
      setTimeout(() => {
        dispatch(
          setIndexModal({
            actionValue: false,
            actionMessage: undefined,
          })
        );
      }, 8000);
      router.push("/success");
    } catch (err: any) {
      setPurchaseLoading(false);
      if (!err.message.includes("User rejected request")) {
        dispatch(
          setError({
            actionValue: true,
            actionMessage: "Looks like something went wrong. Try again.",
          })
        );
      }
      console.error(err.message);
    }
    setPurchaseLoading(false);
  };

  useEffect(() => {
    if (address) {
      for (let i = 0; i <= totalAmounts?.length; i++) {
        if (
          Number(data?.toString()) /
            (currency === "USDT" ? 10 ** 6 : 10 ** 18) >=
          totalAmounts[i]?.totalPrice
        ) {
          setApproved(
            approved.map((value, indexTwo) =>
              indexTwo === index ? true : value
            )
          );
        } else {
          setApproved(
            approved.map((value, indexTwo) =>
              indexTwo === index ? false : value
            )
          );
        }
      }
    }
  }, [address, totalAmounts, chosenCollection, data]);

  useEffect(() => {
    if (chosenCollection) {
      getTokenIds();
    }
  }, [cartItems]);

  useEffect(() => {
    if (canCollectData !== undefined) {
      setCanCollect(canCollectData as boolean);
    }
  }, [canCollectData]);

  useEffect(() => {
    if (isSuccessNFT) {
      writeBuy();
    }
  }, [isSuccessNFT]);

  useEffect(() => {
    if (isSuccess) {
      writeSpend();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (cartItems.length > 0) {
      const newAmounts = Array.from(
        new Set(cartItems?.map((obj) => obj.purchaseToken))
      )?.map((purchaseToken) => {
        const totalPrice = cartItems
          .filter((obj) => obj.purchaseToken === purchaseToken)
          .reduce(
            (total, obj) =>
              total + obj.purchaseAmount * Number(obj.purchasePrice),
            0
          );

        return {
          purchaseToken,
          totalPrice,
        };
      });
      setTotalAmounts(newAmounts);
    }
  }, [cartItems]);

  const addItemToCart = () => {
    let existingAmount = 0;
    cartItems.forEach((item) => {
      if (item.collectionId === chosenCollection?.collectionId) {
        existingAmount += item.purchaseAmount;
      }
    });
    if (purchaseAmount + existingAmount > chosenCollection?.tokenIds.length!) {
      dispatch(
        setError({
          actionValue: true,
          actionMessage: "Items exceed token limit.",
        })
      );
      return;
    }

    dispatch(
      setCartItems([
        ...cartItems,
        {
          ...chosenCollection,
          purchaseToken: currency,
          purchasePrice,
          purchaseAmount,
          size,
          baseColor,
        } as any,
      ])
    );
  };

  return {
    baseColor,
    setBaseColor,
    currency,
    setCurrency,
    totalAmounts,
    approved,
    buyNFT,
    approveSpend,
    purchaseLoading,
    size,
    setSize,
    canCollect,
    addItemToCart,
    setPurchaseAmount,
    purchaseAmount,
    setPurchasePrice,
  };
};

export default useFulfillment;
