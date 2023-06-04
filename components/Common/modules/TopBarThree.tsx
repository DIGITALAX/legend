import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";

const TopBarOne: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-row border-b border-mazul border-b-2">
      <div className="absolute w-full h-full opacity-30">
        <Image
          layout="fill"
          src={`${INFURA_GATEWAY}/QmaCMECk5avUxcLT2oYTiJ3CLXQF1uvHSwuhq8ZrVpm6Bg`}
          objectFit="cover"
          draggable={false}
        />
      </div>
      <div className="flex flex-row relative w-full h-full items-center px-2">
        <div className="justify-start flex flex-row relative font-mega text-sm text-gris w-full h-fit ">
          GRANT PREVIEW
        </div>
        <div className="relative flex flex-row gap-2 justify-end p-1.5 w-full">
          <div className="border border-black bg-medio h-4 w-4 items-center justify-center flex font-mega text-xs p-1">
            <div className="relative w-fit h-fit items-center justify-center flex">
              x
            </div>
          </div>
          <div className="border border-black bg-medio h-4 w-4 items-center justify-center flex font-mega text-xs p-1">
            <div className="relative w-fit h-fit items-center justify-center flex">
              -
            </div>
          </div>
          <div className="border border-black bg-medio h-4 w-4 items-center justify-center flex font-mega p-1">
            <div className="flex w-full h-full items-center justify-center border border-black"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBarOne;
