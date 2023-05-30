import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import Draggable from "react-draggable";
import { CommentBoxProps } from "../types/grant.types";

const CommentBox: FunctionComponent<CommentBoxProps> = ({
  commentRef,
}): JSX.Element => {
  return (
    <Draggable
      enableUserSelectHack={false}
      // nodeRef={commentRef as any}
    >
      <div className="relative w-80 h-100 flex drop-shadow-2xl">
        <Image
          layout="fill"
          src={`${INFURA_GATEWAY}/QmbpFBk93UDXB5PKLhhXbn6tNKG1XDUJjS6SiSeG7S2GMB`}
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
      </div>
    </Draggable>
  );
};

export default CommentBox;
