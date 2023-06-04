import { FunctionComponent } from "react";
import { NextButtonProps } from "../types/launch.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";

const NextButton: FunctionComponent<NextButtonProps> = ({
  page,
  setPage,
  text,
}): JSX.Element => {
  return (
    <div
      className="relative w-28 h-20 flex flex-col"
      onClick={
        text === "NEXT"
          ? () => setPage(page < 5 ? page + 1 : 0)
          : () => setPage(page > 0 ? page - 1 : 0)
      }
    >
      <div className="absolute w-full h-full flex">
        <Image
          src={`${INFURA_GATEWAY}/QmccGupeHigAmvzhqwiduqrEMzujTDso4cZaP5uYsoEMbt`}
          layout="fill"
          draggable={false}
        />
      </div>
      <div className="text-white font-mega text-base flex relative w-full h-full -top-2 left-3 uppercase items-center justify-center">
        {text}
      </div>
    </div>
  );
};

export default NextButton;
