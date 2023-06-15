import { ACCEPTED_TOKENS_MUMBAI, LEGEND_MARKET_MUMBAI } from "@/lib/constants";
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
    ACCEPTED_TOKENS_MUMBAI.filter(
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
  });

  const { config, error } = usePrepareContractWrite({
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
        : /* :  currency === "WMATIC"
        // ? {
        //     constant: false,
        //     inputs: [
        //       { name: "guy", type: "address" },
        //       { name: "wad", type: "uint256" },
        //     ],
        //     name: "approve",
        //     outputs: [{ name: "", type: "bool" }],
        //     payable: false,
        //     stateMutability: "nonpayable",
        //     type: "function",
        //   } */
          {
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
      (addressArg?.totalPrice ? addressArg?.totalPrice : 0) as any,
    ],
    enabled: Boolean(addressArg?.newAddress),
    value: 0 as any,
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
    enabled: Boolean(addressArg),
  });

  const { writeAsync, isSuccess, error: aerror } = useContractWrite(config);
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

  const approveSpend = async (
    newAddress: string,
    totalPrice: number,
    index: number
  ) => {
    setPurchaseLoading(true);
    try {
      setIndex(index);
      setAddressArg({
        newAddress,
        totalPrice: Number(
          BigNumber.from(
            totalPrice.toString() +
              (newAddress === "USDT" ? "000000" : "000000000000000000")
          )
        ) as any,
      });
      await writeSpend();
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
      const newApproved = approved.map((value, indexTwo) => {
        const totalPrice = totalAmounts[indexTwo]?.totalPrice || 0;
        const isApproved =
          Number(data?.toString()) /
            (currency === "USDT" ? 10 ** 6 : 10 ** 18) >=
          totalPrice;
        return indexTwo === index ? isApproved : value;
      });
      setApproved(newApproved);
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
        const purchaseAddress = ACCEPTED_TOKENS_MUMBAI.find(
          ([c]) => c === purchaseToken
        )?.[1] as string;

        const totalPrice = cartItems
          .filter((obj) => obj.purchaseToken === purchaseToken)
          .reduce(
            (total, obj) =>
              total + obj.purchaseAmount * Number(obj.purchasePrice),
            0
          );

        return {
          purchaseToken: purchaseAddress,
          totalPrice,
        };
      });
      setTotalAmounts(newAmounts);
    }
  }, [cartItems]);

  const addItemToCart = () => {
    let existingItemIndex = -1;
    cartItems.forEach((item, index) => {
      if (
        item.collectionId === chosenCollection?.collectionId &&
        item.size === size &&
        item.baseColor === baseColor &&
        item.purchaseToken === currency
      ) {
        existingItemIndex = index;
      }
    });

    let updatedCartItems = cartItems.map((item, index) => {
      if (index === existingItemIndex) {
        return {
          ...item,
          purchaseAmount: item.purchaseAmount + purchaseAmount,
        };
      }
      return item;
    });

    if (existingItemIndex === -1) {
      if (
        purchaseAmount > chosenCollection?.tokenIds.length! ||
        purchaseAmount + cartItems.length > chosenCollection?.tokenIds.length!
      ) {
        dispatch(
          setError({
            actionValue: true,
            actionMessage: "Items exceed token limit.",
          })
        );
        return;
      }

      updatedCartItems.push({
        ...chosenCollection,
        purchaseToken: currency,
        purchasePrice:
          purchasePrice === "0" || !purchasePrice
            ? chosenCollection?.basePrices[
                chosenCollection?.acceptedTokens
                  .map((token) => token.toLowerCase())
                  .indexOf(
                    ACCEPTED_TOKENS_MUMBAI.find(
                      (value) =>
                        value[0].toLowerCase() === currency.toLowerCase()
                    )?.[1]?.toLowerCase()!
                  )
              ]
            : purchasePrice,
        purchaseAmount,
        size,
        baseColor,
      } as any);
    }

    dispatch(setCartItems(updatedCartItems));
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
