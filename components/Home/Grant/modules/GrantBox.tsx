import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import Draggable from "react-draggable";

const GrantBox: FunctionComponent= (): JSX.Element => {
  return (
    <Draggable
      enableUserSelectHack={false}
      //   nodeRef={grantRef as any}
    >
      <div className="absolute w-98 h-60 flex p-1 -bottom-48 left-12 drop-shadow-2xl">
        <Image
          layout="fill"
          src={`${INFURA_GATEWAY}/QmQKkeT32AXWzHmZ28wfjwAfegqhjG3Uc9pEj4VmMZZbXP`}
          className="w-full h-full flex relative"
          draggable={false}
        />
        <div className="flex absolute w-3/4 h-4 top-1 left-0 px-3">
          <div className="relative flex justify-center items-center w-full h-full">
            <Image
              src={`${INFURA_GATEWAY}/QmYfpEREcRAMyretbQbT7YFtJHZLeR948iCezLTgvcUFYS`}
              layout="fill"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default GrantBox;
