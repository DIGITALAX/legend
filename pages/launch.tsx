import NextButton from "@/components/Launch/modules/NextButton";
import SwitchLaunch from "@/components/Launch/modules/SwitchLaunch";
import { setDropModal } from "@/redux/reducers/dropModalSlice";
import { setLaunchPageCount } from "@/redux/reducers/launchPageCountSlice";
import { RootState } from "@/redux/store";
import { NextPage } from "next";
import { useDispatch, useSelector } from "react-redux";

const Launch: NextPage = (): JSX.Element => {
  const dispatch = useDispatch();
  const page = useSelector(
    (state: RootState) => state.app.launchPageCountReducer.value
  );
  const fillAmount = useSelector(
    (state: RootState) => state.app.postValuesReducer.value.filledInAmount
  );
  const profile = useSelector(
    (state: RootState) => state.app.profileReducer.profile
  );
  const storefrontValues = useSelector(
    (state: RootState) => state.app.storefrontValuesReducer.value
  );

  return (
    <div className="relative w-full h-screen flex flex-col z-1">
      <SwitchLaunch profile={profile} page={page} />
      <div className="flex flex-row gap-3 justify-end items-center w-full p-3 h-20">
        {page > 0 && (
          <NextButton
            text={"BACK"}
            setPage={() =>
              dispatch(setLaunchPageCount(page > 0 ? page - 1 : 0))
            }
          />
        )}
        {((page === 0 && fillAmount === 7) || page > 0) && (
          <NextButton
            text={"NEXT"}
            setPage={
              page === 4 && storefrontValues.length > 0
                ? () =>
                    dispatch(
                      setDropModal({
                        actionMessage:
                          "Happy with your collections? Mint them together in your grant drop. you can always add more later.",
                        actionValue: true,
                      })
                    )
                : () => dispatch(setLaunchPageCount(page < 5 ? page + 1 : 5))
            }
          />
        )}
      </div>
    </div>
  );
};

export default Launch;
