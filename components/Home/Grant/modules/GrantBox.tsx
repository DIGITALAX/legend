import { INFURA_GATEWAY } from "@/lib/constants";
import { setCollapseItem } from "@/redux/reducers/collapseItemSlice";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import Draggable from "react-draggable";
import { GrantBoxProps } from "../types/grant.types";

const GrantBox: FunctionComponent<GrantBoxProps> = ({
  collapseNumber,
  dispatch,
  index,
  mainPostInfo,
  mainPostLoading,
}): JSX.Element => {
  return (
    <Draggable
      enableUserSelectHack={false}
      //   nodeRef={grantRef as any}
      cancel=".stopDrag"
    >
      <div
        className={`absolute z-1 w-98 flex p-1 -bottom-48 left-12 drop-shadow-2xl ${
          collapseNumber[index] ? "h-7" : "h-60"
        }`}
      >
        <Image
          layout="fill"
          src={`${INFURA_GATEWAY}/QmQKkeT32AXWzHmZ28wfjwAfegqhjG3Uc9pEj4VmMZZbXP`}
          className="w-full h-full flex relative"
          draggable={false}
        />
        <div
          className="stopDrag flex absolute w-3/4 h-4 top-1 left-0 px-3 cursor-pointer"
          onClick={() =>
            dispatch(
              setCollapseItem(
                [...collapseNumber].map((item, i) =>
                  i === index ? !item : item
                )
              )
            )
          }
        >
          <div className="relative flex justify-center items-center w-full h-full">
            <Image
              src={`${INFURA_GATEWAY}/QmYfpEREcRAMyretbQbT7YFtJHZLeR948iCezLTgvcUFYS`}
              layout="fill"
              draggable={false}
            />
          </div>
        </div>
        <div className="relative w-full h-fit flex flex-col gap-2 px-3 py-5">
        <div className="relative w-fit h-fit flex overflow-y-scroll items-start justify-start font-earl">
            {mainPostInfo?.metadata?.name}
          </div>
          <div className="relative w-fit h-24 flex overflow-y-scroll items-start justify-start font-earl">
            {mainPostInfo?.metadata.content}
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default GrantBox;
