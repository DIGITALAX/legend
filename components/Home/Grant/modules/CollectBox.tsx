import { INFURA_GATEWAY } from "@/lib/constants";
import { setCollapseItem } from "@/redux/reducers/collapseItemSlice";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import Draggable from "react-draggable";
import { CollectBoxProps } from "../types/grant.types";

const CollectBox: FunctionComponent<CollectBoxProps> = ({
  collapseNumber,
  dispatch,
  index,
  collectGrant,
  collectors,
  collectorsLoading,
  collectLoading, 
  getMorePostCollects,
  hasMoreCollects
}): JSX.Element => {

  return (
    <Draggable
      enableUserSelectHack={false}
      //   nodeRef={grantRef as any}
      cancel=".stopDrag"
    >
      <div
        className={`relative w-80 z-1 flex p-1 drop-shadow-2xl ${
          collapseNumber[index] ? "h-4" : "h-100"
        }`}
      >
        <Image
          layout="fill"
          src={`${INFURA_GATEWAY}/QmUX8xCW3ErrfdQgv5LKwqgjgmbGn98PJ9cPNyPmtqF2hy`}
          className="w-full h-full flex relative"
          draggable={false}
        />
        <div
          className="stopDrag flex absolute w-full h-4 top-1 left-0 px-3 cursor-pointer"
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
        <div className="relative w-full h-full">
            {
              collectors?.map((item, index: number) => {
                return (
                  <div key={index}></div>
                )
              })
            }
        </div>
      </div>
    </Draggable>
  );
};

export default CollectBox;
