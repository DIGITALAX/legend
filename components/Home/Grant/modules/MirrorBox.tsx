import { INFURA_GATEWAY } from "@/lib/constants";
import { setCollapseItem } from "@/redux/reducers/collapseItemSlice";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import Draggable from "react-draggable";
import { MirrorBoxProps } from "../types/grant.types";
import createProfilePicture from "@/lib/lens/helpers/createProfilePicture";
import { AiOutlineLoading } from "react-icons/ai";

const MirrorBox: FunctionComponent<MirrorBoxProps> = ({
  collapseNumber,
  dispatch,
  index,
  mirrorGrant,
  mirrorInfoLoading,
  mirrorLoading,
  mirrorers,
  likeGrant,
  likeLoading,
  reactInfoLoading,
  reacters,
  hasMoreMirror,
  hasMoreReact,
  getMorePostMirrors,
  getMorePostReactions,
}): JSX.Element => {
  return (
    <Draggable
      enableUserSelectHack={false}
      //   nodeRef={grantRef as any}
      cancel=".stopDrag"
    >
      <div
        className={`absolute z-1 right-10 -bottom-40 w-80 flex p-1 drop-shadow-2xl ${
          collapseNumber[index] ? "h-4" : "h-100 "
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
        <div className="flex absolute w-10 h-10 -bottom-3 -right-3">
          <Image
            src={`${INFURA_GATEWAY}/QmfFZs7NE11VhEMg2bf4XeuQ37mPhrEwq1XKAFzM6eyVQQ`}
            layout="fill"
            draggable={false}
          />
        </div>
        <div className="relative w-full h-full top-5 flex flex-col gap-2">
          <div className="relative w-full h-fit flex flex-col">
            <InfiniteScroll
              hasMore={hasMoreMirror}
              dataLength={mirrorers?.length}
              next={getMorePostMirrors}
              loader={""}
              height={"10rem"}
              className="relative w-full h-fit flex flex-col px-4 gap-2 overflow-y-scroll"
            >
              {mirrorers?.map((mirrorer: any, index: number) => {
                const profileImage = createProfilePicture(mirrorer);

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
                        @{mirrorer?.handle?.split(".lens")[0]}
                      </div>
                    </div>
                  </div>
                );
              })}
            </InfiniteScroll>
          </div>
          <div
            className={`relative w-fit h-fit bg-darker ${
              !mirrorLoading && "cursor-pointer active scale:95"
            }`}
            onClick={() => !mirrorLoading && mirrorGrant()}
          >
            {mirrorLoading ? (
              <div className="relative w-fit h-fit animate-spin">
                <AiOutlineLoading size={10} color="white" />
              </div>
            ) : (
              <div className="relative w-fit h-fit font-earl text-white px-2">
                mirror grant
              </div>
            )}
          </div>
          <div className="relative w-full h-fit flex flex-col">
            <InfiniteScroll
              hasMore={hasMoreReact}
              dataLength={reacters?.length}
              next={getMorePostReactions}
              loader={""}
              height={"10rem"}
              className="relative w-full h-fit flex flex-col px-4 gap-2 overflow-y-scroll"
            >
              {reacters?.map((reacter: any, index: number) => {
                const profileImage = createProfilePicture(reacter?.profile);

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
                        @{reacter?.profile?.handle?.split(".lens")[0]}
                      </div>
                    </div>
                  </div>
                );
              })}
            </InfiniteScroll>
          </div>
          <div
            className={`relative w-fit h-fit bg-darker ${
              !likeLoading && "cursor-pointer active scale:95"
            }`}
            onClick={() => !likeLoading && likeGrant()}
          >
            {likeLoading ? (
              <div className="relative w-fit h-fit animate-spin">
                <AiOutlineLoading size={10} color="white" />
              </div>
            ) : (
              <div className="relative w-fit h-fit font-earl text-white px-2">
                like grant
              </div>
            )}
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default MirrorBox;
