import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { DynamicNFTProps } from "../types/grant.types";

const DynamicNFT: FunctionComponent<DynamicNFTProps> = ({
  mainURI,
  currentCounter,
  editionAmount,
  handleMintDynamicNFT,
  canMint,
  mintLoading
}): JSX.Element => {
  return (
    <div className="relative w-98 h-100 rounded-md bg-gris top-10 flex flex-col p-3 gap-5">
      <div className="relative w-full h-full border-2 border-rosa">
        <Image
          src={`${INFURA_GATEWAY}/${
            mainURI?.includes("ipfs://")
              ? mainURI?.split("ipfs://")[1]
              : mainURI
          }`}
          layout="fill"
          objectFit="cover"
          draggable={false}
        />
      </div>
      <div className="relative bg-purp border-2 border-rosa w-full h-16 flex flex-row">
        <div className="relative w-fit h-fit flex items-center justify-start font-mega">
          {currentCounter} / {editionAmount}
        </div>
        <div
          className={`relative w-fit h-fit flex items-center justify-start font-earl bg-darker rounded-md text-white px-2 ${
            canMint && "cursor-pointer active:scale-95"
          }`}
        >
          <div className="relative w-fit h-fit">
            {canMint ? "MINT" : "COLLECT 2 MINT"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicNFT;
