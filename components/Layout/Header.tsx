import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";

const Header: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-row text-white font-vcr p-3 gap-6 items-start">
      <div
        className="relative justify-start items-center text-3xl uppercase w-fit h-full flex"
        id="title"
      >
        legend
      </div>
      <div className="relative w-full h-fit justify-center items-center flex left-6">
        <div className="relative flex flex-row w-fit h-fit rounded-full bg-beige/70 px-4 py-1.5 justify-center items-center gap-5 text-sm">
          <div className="relative px-2 py-2 rounded-full flex justify-center items-center w-fit h-fit hover:bg-black hover:text-white text-black bg-beige active:bg-azul">
            collaborate
          </div>
          <div className="relative px-2 py-2 rounded-full flex justify-center items-center w-fit h-fit hover:bg-black hover:text-white text-black bg-beige active:bg-azul">
            view grants
          </div>
          <div className="relative px-2 py-2 rounded-full flex justify-center items-center w-fit h-fit hover:bg-black hover:text-white text-black bg-beige active:bg-azul">
            launch a grant
          </div>
          <div className="relative px-2 py-2 rounded-full flex justify-center items-center w-fit h-fit hover:bg-black hover:text-white text-black bg-beige active:bg-azul">
            web3 public goods
          </div>
        </div>
      </div>
      <div className="relative flex w-fit h-full items-center justify-end flex-row gap-1">
        {Array.from(
          { length: 6 },
          () => "QmTFgipESste4Gw5Eq5LZ6naxRMbqu3yonwEHVkyYNMTTt"
        ).map((item: string, index: number) => {
          return (
            <div
              key={index}
              className="relative flex justify-center items-center w-5 h-4"
            >
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/${item}`}
                draggable={false}
              />
            </div>
          );
        })}
        {Array.from(
          { length: 3 },
          () => "QmQ12aEBcK1nMAXQ2fa9SoK2FeDoQ6WdTUq9d83tfxt9ZR"
        ).map((item: string, index: number) => {
          return (
            <div
              key={index}
              className="relative flex justify-center items-center w-5 h-4"
            >
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/${item}`}
                draggable={false}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Header;
