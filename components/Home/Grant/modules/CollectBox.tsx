import { INFURA_GATEWAY } from "@/lib/constants";
import { setCollapseItem } from "@/redux/reducers/collapseItemSlice";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import Draggable from "react-draggable";
import { CollectBoxProps } from "../types/grant.types";
import { AiOutlineLoading } from "react-icons/ai";
import InfiniteScroll from "react-infinite-scroll-component";
import createProfilePicture from "@/lib/lens/helpers/createProfilePicture";

const CollectBox: FunctionComponent<CollectBoxProps> = ({
  collapseNumber,
  dispatch,
  index,
  collectGrant,
  collectors,
  collectorsLoading,
  collectLoading,
  getMorePostCollects,
  hasMoreCollects,
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
        <div className="relative w-full h-full top-5 flex flex-col gap-2">
          <div className="relative w-full h-fit flex flex-col">
            <InfiniteScroll
              hasMore={hasMoreCollects}
              dataLength={collectors?.length}
              next={getMorePostCollects}
              loader={""}
              height={"10rem"}
              className="relative w-full h-fit flex flex-col px-4 gap-2 overflow-y-scroll"
            >
              {collectors?.map((collector: any, index: number) => {
                const profileImage = createProfilePicture(
                  collector.defaultProfile
                );

                return (
                  <div
                    key={index}
                    className="relative w-full h-fit p-2 drop-shadow-lg flex flex-row bg-gradient-to-r from-offBlack via-gray-600 to-black auto-cols-auto rounded-lg border border-black font-economica text-white cursor-pointer"
                  >
                    <div className="relative w-fit h-fit flex flex-row gap-6">
                      <div
                        className="relative w-6 h-6 rounded-full col-start-1"
                        id="crt"
                      >
                        {profileImage && (
                          <Image
                            src={profileImage}
                            objectFit="cover"
                            layout="fill"
                            alt="pfp"
                            className="relative w-fit h-fit rounded-full self-center flex"
                            draggable={false}
                          />
                        )}
                      </div>
                      <div
                        id="handle"
                        className="relative w-fit h-fit justify-center flex"
                      >
                        @{collector.defaultProfile?.handle?.split(".lens")[0]}
                      </div>
                    </div>
                  </div>
                );
              })}
            </InfiniteScroll>
          </div>
          <div
            className={`relative w-fit h-fit bg-darker ${
              !collectLoading && "cursor-pointer active scale:95"
            }`}
            onClick={() => !collectLoading && collectGrant()}
          >
            {collectLoading ? (
              <div className="relative w-fit h-fit animate-spin">
                <AiOutlineLoading size={10} color="white" />
              </div>
            ) : (
              <div className="relative w-fit h-fit font-earl text-white px-2">
                collect grant
              </div>
            )}
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default CollectBox;
