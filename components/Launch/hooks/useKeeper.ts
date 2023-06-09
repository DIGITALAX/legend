import { useEffect, useState } from "react";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import UpkeepAbi from "./../../../abi/Upkeep.json";
import LinkAbi from "./../../../abi/LinkToken.json";
import {
  MATIC_LINK_TOKEN,
  MUMBAI_LINK_TOKEN,
  MUMBAI_UPKEEP,
} from "@/lib/constants";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { waitForTransaction } from "@wagmi/core";
import { useBalance } from "wagmi";
import { setUpkeepID } from "@/redux/reducers/upkeepIDSlice";

const useKeeper = () => {
  const legendKeeperAddress = useSelector(
    (state: RootState) => state.app.contractValuesReducer.value[0]
  );
  const upkeepId = useSelector(
    (state: RootState) => state.app.upkeepIDReducer.upkeepID
  );
  const postValues = useSelector(
    (state: RootState) => state.app.postValuesReducer.value
  );
  const dispatch = useDispatch();
  const { address } = useAccount();
  const [balanceAmount, setBalanceAmount] = useState<number>();
  const [text, setText] = useState<string>("send link");
  const [keeperRegisterLoading, setKeeperRegisterLoading] =
    useState<boolean>(false);
  const balance = useBalance({
    address: address,
    token: MUMBAI_LINK_TOKEN,
  });

  const { config, error } = usePrepareContractWrite({
    address: MUMBAI_UPKEEP,
    abi: UpkeepAbi,
    args: [
      postValues.title,
      "0x00",
      legendKeeperAddress,
      500000,
      address,
      "0x00",
      "0x00",
      "2000000000000000000",
    ],
    functionName: "registerAndPredictID",
    enabled: Boolean(legendKeeperAddress),
  });

  const { writeAsync } = useContractWrite(config);

  const { config: sendConfig } = usePrepareContractWrite({
    address: MUMBAI_LINK_TOKEN,
    abi: LinkAbi,
    args: [MUMBAI_UPKEEP, Number("2000000000000000000")],
    functionName: "transfer",
    enabled: Boolean(legendKeeperAddress),
  });

  const { writeAsync: sendWriteAsync } = useContractWrite(sendConfig);

  const registerUpkeep = async () => {
    setKeeperRegisterLoading(true);
    try {
      const tx = await writeAsync?.();
      const res = await waitForTransaction({
        hash: tx?.hash!,
      });
      if (res.status === "success") {
        dispatch(
          setUpkeepID(
            res.logs[3].topics[1] && BigInt(res.logs[3].topics[1]).toString()
          )
        );
        setText("view register");
      } else {
        // cause an error here / dispatch / cant have same name!!
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setKeeperRegisterLoading(false);
  };

  const sendLink = async () => {
    if (
      !balance.data?.value ||
      parseInt(balance.data?.value.toString()) < Number("2000000000000000000")
    ) {
      return;
    }
    setKeeperRegisterLoading(true);
    try {
      const tx = await sendWriteAsync?.();
      const res = await waitForTransaction({
        hash: tx?.hash!,
      });
      if (res.status === "success") {
        setText("register keeper");
      } else {
        // error here
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setKeeperRegisterLoading(false);
  };

  useEffect(() => {
    if (!balanceAmount && balance.data?.value) {
      setBalanceAmount(parseInt(balance.data?.value.toString()));
    }
  }, [balance.data?.value]);

  useEffect(() => {
    if (upkeepId) {
      setText("view register");
    }
  }, []);

  return {
    keeperRegisterLoading,
    registerUpkeep,
    sendLink,
    balanceAmount,
    text,
  };
};

export default useKeeper;
