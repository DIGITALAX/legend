import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import Draggable from "react-draggable";

const StoreFrontBox: FunctionComponent = (): JSX.Element => {
  return (
    <Draggable
      enableUserSelectHack={false}
      //   nodeRef={grantRef as any}
    >
      <div className="absolute -bottom-40 right-10 w-80 h-100 flex p-1 drop-shadow-2xl">
        <Image
          layout="fill"
          src={`${INFURA_GATEWAY}/QmUX8xCW3ErrfdQgv5LKwqgjgmbGn98PJ9cPNyPmtqF2hy`}
          className="w-full h-full flex relative"
          draggable={false}
        />
        <div className="flex absolute w-full h-4 top-1 left-0 px-3">
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
      </div>
    </Draggable>
  );
};

export default StoreFrontBox;
