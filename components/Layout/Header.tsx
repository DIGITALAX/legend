import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";

const Header: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-row text-white font-earl p-3 gap-6 items-start">
      <div
        className="relative justify-start items-center text-3xl uppercase w-fit h-full flex"
        id="title"
      >
        legend
      </div>
      <div className="relative w-full h-fit justify-center items-center flex left-6">
        <div className="relative flex flex-row w-fit h-fit px-6 py-3 justify-center items-center gap-5 text-sm">
          <Image
            src={`${INFURA_GATEWAY}/QmWDmzfvPhJvkCa8Z2sGBGGKXBSyKjDYbaJZB9L82CBm3k`}
            layout="fill"
          />
          <div className="relative px-2 py-2 flex justify-center items-center w-fit h-fit hover:text-black/50 text-black active:scale-95 flex">
            <Image
              src={`${INFURA_GATEWAY}/QmdaGZociGw7XapzBELFDnbN3rLHhj18uCghXaMGhXPdqf`}
              layout="fill"
            />
            <div className="relative w-fit h-fit justify-center items-center flex">
              collaborate
            </div>
          </div>
          <div className="relative px-2 py-2 flex justify-center items-center w-fit h-fit hover:text-black/50 text-black active:scale-95 flex">
            <Image
              src={`${INFURA_GATEWAY}/QmdaGZociGw7XapzBELFDnbN3rLHhj18uCghXaMGhXPdqf`}
              layout="fill"
            />
            <div className="relative w-fit h-fit justify-center items-center flex">
              view grants
            </div>
          </div>
          <div className="relative px-2 py-2 flex justify-center items-center w-fit h-fit hover:text-black/50 text-black active:scale-95 flex">
            <Image
              src={`${INFURA_GATEWAY}/QmdaGZociGw7XapzBELFDnbN3rLHhj18uCghXaMGhXPdqf`}
              layout="fill"
            />
            <div className="relative w-fit h-fit justify-center items-center flex">
              launch grant
            </div>
          </div>
          <div className="relative px-2 py-2 flex justify-center items-center w-fit h-fit hover:text-black/50 text-black active:scale-95 flex">
            <Image
              src={`${INFURA_GATEWAY}/QmdaGZociGw7XapzBELFDnbN3rLHhj18uCghXaMGhXPdqf`}
              layout="fill"
            />
            <div className="relative w-fit h-fit justify-center items-center flex">
              web3 public goods
            </div>
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
