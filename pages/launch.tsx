import NextButton from "@/components/Launch/modules/NextButton";
import SwitchLaunch from "@/components/Launch/modules/SwitchLaunch";
import { RootState } from "@/redux/store";
import { NextPage } from "next";
import { useState } from "react";
import { useSelector } from "react-redux";

const Launch: NextPage = (): JSX.Element => {
  const [page, setPage] = useState<number>(0);
  const profile = useSelector(
    (state: RootState) => state.app.profileReducer.profile
  );

  return (
    <div className="relative w-full h-full flex flex-col z-1">
      <SwitchLaunch
        profile={profile}
        page={page}
      />
      <NextButton page={page} setPage={setPage} />
    </div>
  );
};

export default Launch;
