import { FormEvent, useEffect, useState } from "react";
import { Collection } from "../types/launch.types";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { AVAILABLE_TOKENS, LEGEND_COLLECTION_MUMBAI } from "@/lib/constants";
import { waitForTransaction } from "@wagmi/core";
import LegendCollectionAbi from "./../../../abi/LegendCollection.json";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setStorefrontValues } from "@/redux/reducers/storefrontValuesSlice";
import { setProductInformation } from "@/redux/reducers/productInformationSlice";

const useStorefront = () => {
  const dispatch = useDispatch();
  const postValues = useSelector(
    (state: RootState) => state.app.postValuesReducer.value
  );
  const storefrontValues = useSelector(
    (state: RootState) => state.app.storefrontValuesReducer.value
  );
  const NFTValues = useSelector(
    (state: RootState) => state.app.NFTImageArrayReducer.value
  );
  const productInformation = useSelector(
    (state: RootState) => state.app.productInformationReducer.value
  );
  const [imageLoading, setImageLoading] = useState<boolean[]>(
    Array.from({ length: productInformation.length }, () => false)
  );
  const [collectionLoading, setCollectionLoading] = useState<boolean[]>(
    Array.from({ length: productInformation.length }, () => false)
  );
  const [minted, setMinted] = useState<boolean[]>(
    Array.from({ length: productInformation.length }, () => false)
  );
  const [mint, setMint] = useState<number>();
  const [args, setArgs] = useState<any>();
  const [newPosition, setNewPosition] = useState<
    {
      x: string;
      y: string;
    }[]
  >([]);

  const { config } = usePrepareContractWrite({
    address: LEGEND_COLLECTION_MUMBAI,
    abi: LegendCollectionAbi,
    functionName: "mintCollection",
    enabled: Boolean(args),
    args: args,
  });

  const { writeAsync } = useContractWrite(config);

  const handleCollectionPrices = (
    e: FormEvent,
    address: string,
    index: number
  ): void => {
    const updatedProductInformation = [...productInformation];
    const product = { ...updatedProductInformation[index] };

    const value = (e.target as HTMLFormElement).value;
    const formattedValue = value === "" ? "" : Number(value).toFixed(2);

    const tokenIndex = (
      product?.acceptedTokens?.length > 0 ? product.acceptedTokens : []
    )?.findIndex(
      (token: string) => token.toLowerCase() === address.toLowerCase()
    );

    if (formattedValue === "") {
      if (tokenIndex !== -1) {
        product.acceptedTokens = [...product.acceptedTokens];
        product.basePrices = [...product.basePrices];
        product?.acceptedTokens?.splice(tokenIndex, 1);
        product?.basePrices?.splice(tokenIndex, 1);
      }
    } else {
      if (tokenIndex === -1) {
        product.acceptedTokens = [...product.acceptedTokens, address];
        product.basePrices = [...product.basePrices, Number(formattedValue)];
      } else {
        product.basePrices = [...product.basePrices];
        product.basePrices[tokenIndex] = Number(formattedValue);
      }
    }

    updatedProductInformation[index] = product;
    dispatch(setProductInformation(updatedProductInformation));
  };

  const handleTitle = (e: FormEvent, index: number) => {
    const updatedProductInformation = [...productInformation];

    updatedProductInformation[index] = {
      ...updatedProductInformation[index],
      uri: {
        ...updatedProductInformation[index]?.uri,
        name: (e.target as HTMLFormElement).value,
      },
    };
    dispatch(setProductInformation(updatedProductInformation));
  };

  const handleGrantOnly = (e: FormEvent, index: number) => {
    const updatedProductInformation = [...productInformation];

    updatedProductInformation[index] = {
      ...updatedProductInformation[index],
      grantOnly:
        updatedProductInformation[index].grantOnly === true ? false : true,
    };

    dispatch(setProductInformation(updatedProductInformation));
  };

  const handlePrintType = (e: string, index: number) => {
    const updatedProductInformation = [...productInformation];

    updatedProductInformation[index] = {
      ...updatedProductInformation[index],
      printType: e,
    };

    dispatch(setProductInformation(updatedProductInformation));
  };

  const handleDiscount = (e: FormEvent, index: number) => {
    const updatedProductInformation = [...productInformation];

    updatedProductInformation[index] = {
      ...updatedProductInformation[index],
      discount: (e.target as HTMLFormElement).value,
    };

    dispatch(setProductInformation(updatedProductInformation));
  };

  const handleDescription = (e: FormEvent, index: number) => {
    const updatedProductInformation = [...productInformation];

    updatedProductInformation[index] = {
      ...updatedProductInformation[index],
      uri: {
        ...updatedProductInformation[index].uri,
        description: (e.target as HTMLFormElement).value,
      },
    };

    dispatch(setProductInformation(updatedProductInformation));
  };

  const handleEditionAmount = (e: FormEvent, index: number) => {
    const updatedProductInformation = [...productInformation];

    updatedProductInformation[index] = {
      ...updatedProductInformation[index],
      amount: (e.target as HTMLFormElement).value,
    };

    dispatch(setProductInformation(updatedProductInformation));
  };

  const handleImageUpload = async (
    e: FormEvent,
    index: number
  ): Promise<void> => {
    setImageLoading(
      [...imageLoading].map((value, i) => (i === index ? true : value))
    );

    try {
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: (e as any).target.files[0],
      });
      if (response.status !== 200) {
        setImageLoading(
          [...imageLoading].map((value, i) => (i === index ? false : value))
        );
      } else {
        let cid = await response.json();

        const updatedProductInformation = [...productInformation];

        updatedProductInformation[index] = {
          ...updatedProductInformation[index],
          uri: {
            ...updatedProductInformation[index].uri,
            image: String(cid?.cid),
            external_url: "www.irrevocable.legend.xyz",
            type: "image/png",
          },
        };

        dispatch(setProductInformation(updatedProductInformation));
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setImageLoading(
      [...imageLoading].map((value, i) => (i === index ? false : value))
    );
  };

  const mintCollection = async (index: number) => {
    setCollectionLoading(
      [...imageLoading].map((value, i) => (i === index ? true : value))
    );
    try {
      setMint(index);
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: JSON.stringify(productInformation[index].uri),
      });
      const uri = await response.json();
      setArgs([
        productInformation[index].amount,
        {
          acceptedTokens: productInformation[index].acceptedTokens,
          basePrices: productInformation[index].basePrices,
          uri: "ipfs://" + uri.cid,
          printType: productInformation[index].printType,
          fulfillerId: 1,
          discount: productInformation[index].discount,
          grantCollectorsOnly: productInformation[index].grantOnly,
        },
        postValues.title,
      ]);
    } catch (err: any) {
      setCollectionLoading(
        [...imageLoading].map((value, i) => (i === index ? false : value))
      );
      console.error(err.message);
    }
    setCollectionLoading(
      [...imageLoading].map((value, i) => (i === index ? false : value))
    );
  };

  const mintWrite = async (index: number) => {
    setCollectionLoading(
      [...imageLoading].map((value, i) => (i === index ? true : value))
    );
    try {
      const tx = await writeAsync?.();
      const res = await waitForTransaction({
        hash: tx?.hash!,
      });
      setArgs(undefined);
      setMinted([...minted].map((value, i) => (i === index ? true : value)));
      dispatch(
        setStorefrontValues([...storefrontValues, productInformation[index]])
      );
    } catch (err: any) {
      setCollectionLoading(
        [...imageLoading].map((value, i) => (i === index ? false : value))
      );
      console.error(err.message);
    }
    setCollectionLoading(
      [...imageLoading].map((value, i) => (i === index ? false : value))
    );
  };

  const handleAddPosition = () => {
    const positions = [
      { x: "20", y: "100" },
      { x: "60", y: "20" },
      { x: "44", y: "44" },
    ];

    const randomIndex = Math.floor(Math.random() * positions.length);
    const newPositionValue = positions[randomIndex];

    setNewPosition([...newPosition, newPositionValue]);

    dispatch(
      setProductInformation([
        ...productInformation,
        {
          acceptedTokens: [],
          basePrices: [],
          grantOnly: false,
          discount: 0,
          printType: "apparel",
          uri: {
            description: "",
            external_url: "",
            image: "",
            name: "",
            type: "",
          },
          amount: 0,
        },
      ])
    );
    setImageLoading([...imageLoading, false]);
    setCollectionLoading([...collectionLoading, false]);
    setMinted([...minted, false]);
  };

  const handleRemovePosition = (index: number) => {
    const updatedPositions = newPosition.filter((_, i) => i !== index);
    const updatedMinted = minted.filter((_, i) => i !== index + 3);
    const updatedCollectionLoading = collectionLoading.filter(
      (_, i) => i !== index + 3
    );
    const updatedImageLoading = imageLoading.filter((_, i) => i !== index + 3);
    const updatedProductInformation = [...productInformation].filter(
      (_, i) => i !== index + 3
    );
    dispatch(setProductInformation(updatedProductInformation));
    setImageLoading(updatedImageLoading);
    setCollectionLoading(updatedCollectionLoading);
    setMinted(updatedMinted);
    setNewPosition(updatedPositions);
  };

  useEffect(() => {
    if (args) {
      mintWrite(mint as number);
    }
  }, [args]);

  useEffect(() => {
    if (postValues.editionAmount === NFTValues.length) {
      dispatch(
        setProductInformation(
          Array.from({ length: 3 }, () => ({
            acceptedTokens: [],
            basePrices: [],
            grantOnly: false,
            discount: 0,
            printType: "apparel",
            uri: {
              description: "",
              external_url: "",
              image: "",
              name: "",
              type: "",
            },
            amount: postValues.editionAmount,
          }))
        )
      );
    }
  }, [NFTValues.length]);

  return {
    newPosition,
    setNewPosition,
    handleCollectionPrices,
    handleDescription,
    handleTitle,
    handleEditionAmount,
    imageLoading,
    handleImageUpload,
    minted,
    mintCollection,
    collectionLoading,
    handleDiscount,
    handlePrintType,
    handleGrantOnly,
    handleAddPosition,
    handleRemovePosition,
  };
};

export default useStorefront;
