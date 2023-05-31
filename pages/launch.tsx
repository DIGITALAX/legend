import SwitchLaunch from "@/components/Launch/modules/SwitchLaunch";
import { RootState } from "@/redux/store";
import { NextPage } from "next";
import { useSelector } from "react-redux";
import { useAccount } from "wagmi";

const Launch: NextPage = (): JSX.Element => {
  const auth = useSelector((state: RootState) => state.app.authReducer.value);
  const profile = useSelector(
    (state: RootState) => state.app.profileReducer.profile
  );
  const { address } = useAccount();

  return (
    <div className="relative w-full h-full flex flex-col z-1">
      <SwitchLaunch authStatus={auth} profile={profile} address={address} />
    </div>
  );
};

export default Launch;
