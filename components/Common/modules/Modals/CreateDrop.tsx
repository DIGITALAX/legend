import { FunctionComponent } from "react";
import { CreateDropProps } from "../../types/common.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import TopBarTwo from "../TopBarTwo";
import { setDropModal } from "@/redux/reducers/dropModalSlice";
import { AiOutlineLoading } from "react-icons/ai";
import { Collection } from "@/components/Launch/types/launch.types";

const CreateDrop: FunctionComponent<CreateDropProps> = ({
  dispatch,
  message,
  createDrop,
  dropLoading,
  storefrontValues,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-20 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-full lg:w-[50vw] h-fit col-start-1 place-self-center bg-white rounded-lg">
        <div className="relative w-full row-start-2 h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center">
            <div className="relative w-full h-full grid grid-flow-row auto-rows-auto gap-4 pb-8">
              <div className="relative w-full h-10">
                <TopBarTwo
                  deleteFunction={() =>
                    dispatch(
                      setDropModal({
                        actionMessage: undefined,
                        actionValue: false,
                      })
                    )
                  }
                />
              </div>
              <div className="relative w-full h-fit flex flex-col items-center justify-center px-4 gap-6">
                <div className="relative w-3/4 h-fit justify-center items-center text-black font-mega text-sm text-center">
                  {message}
                </div>
                <div className="relative w-fit  h-full">
                  <div className="relative w-full h-full flex flex-row gap-1.5 overflow-x-scroll">
                    {storefrontValues?.map(
                      (item: Collection, index: number) => {
                        return (
                          <div
                            className="relative w-40 h-40 justify-center items-center rounded-lg border border-black"
                            id="staticLoad"
                          >
                            <Image
                              src={`${INFURA_GATEWAY}/${item.uri.image}`}
                              layout="fill"
                              objectFit="cover"
                              className="rounded-lg"
                            />
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
                <div
                  className={`relative bg-darker border border-black flex w-28 text-center text-base justify-center items-center h-10 p-1 font-earl text-white uppercase cursor-pointer active:scale-95`}
                  onClick={() => createDrop()}
                >
                  {dropLoading ? (
                    <div className="relative w-fit h-fit flex items-center justify-center animate-spin">
                      <AiOutlineLoading color="white" size={15} />
                    </div>
                  ) : (
                    "create drop"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDrop;
