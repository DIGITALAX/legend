import { ACCEPTED_TOKENS_MUMBAI, INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FormEvent, FunctionComponent } from "react";
import { FiltersProps } from "../types/storefront.types";
import { setFilters } from "@/redux/reducers/filtersSlice";

const Filters: FunctionComponent<FiltersProps> = ({
  dispatch,
  filterValues,
  handleFindGrant,
}): JSX.Element => {
  return (
    <div className="relative w-96 h-fit flex pb-12">
      <div className="relative w-full h-full bg-white rounded-md flex flex-col py-2 px-4 gap-6">
        <div className="flex flex-col relative w-fit h-fit gap-2">
          <div className="relative w-full h-fit font-mega">Sort By Print</div>
          <div className="relative flex flex-wrap flex-row w-full h-fit gap-2">
            {Array.from([
              ["QmaZtrnJTEFFjDHn32ABFhzafakP8o9D3yMFfX2GZuvWLe", "poster"],
              ["QmdBGb4C82EMpi7NxSpuCgTmaVYKsWBdao41GJoQoawX6G", "sticker"],
              ["QmYdNGhxLN5hHhi8r3QLKd232fEzW97dia58RZog8yqFSw", "shirt"],
              ["QmdiRJUu3xxEhGZbbRusMUJ8ffStRZeackYRAt8avpd5dn", "jacket"],
              ["QmXVFuiHYe5k1J5qvgkMqNbgTKe5ZaP7PoByDKZ98cTFcQ", "longsleeve"],
              ["QmcTwmM6LihAEFb8JjPBK2nrVaP3fjf8jwDMsXbwMyNTtn", "hoodie"],
            ]).map((value: string[], index: number) => {
              return (
                <div
                  className={`relative w-9 h-9 items-center justify-center flex border border-black rounded-full p-2 cursor-pointer active:scale-95  ${
                    filterValues.print.includes(value[1])
                      ? "bg-mazul"
                      : "bg-darker"
                  }`}
                  key={index}
                  onClick={() => {
                    let newArray;
                    if (filterValues.print.includes(value[1])) {
                      newArray = filterValues.print.filter(
                        (prevItem) => prevItem !== value[1]
                      );
                    } else {
                      newArray = [...filterValues.print, value[1]];
                    }

                    dispatch(
                      setFilters({
                        actionPrint: newArray,
                        actionGrant: filterValues.grant,
                        actionTimestamp: filterValues.timestamp,
                        actionTokens: filterValues.tokens,
                        actionDiscount: filterValues.discount,
                        actionCollectors: filterValues.collectors,
                      })
                    );
                  }}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={`${INFURA_GATEWAY}/${value[0]}`}
                      layout="fill"
                      draggable={false}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col relative w-fit h-fit gap-2">
          <div className="relative w-full h-fit font-mega">Sort By Grant</div>
          <input
            className="border border-black rounded-full font-earl p-1.5"
            onChange={(e: FormEvent) => handleFindGrant(e)}
          />
        </div>
        <div className="flex flex-col relative w-fit h-fit gap-2">
          <div className="relative w-full h-fit font-mega">
            Order By Block Timestamp
          </div>
          <div className="relative flex flex-row gap-2 w-full h-fit text-xs">
            <div
              className={`relative w-full h-fit items-center justify-center flex border border-black rounded-full p-2 cursor-pointer active:scale-95 ${
                filterValues.timestamp ? "bg-mazul" : "bg-darker"
              }`}
              onClick={() =>
                dispatch(
                  setFilters({
                    actionPrint: filterValues.print,
                    actionGrant: filterValues.grant,
                    actionTimestamp: true,
                    actionTokens: filterValues.tokens,
                    actionDiscount: filterValues.discount,
                    actionCollectors: filterValues.collectors,
                  })
                )
              }
            >
              <div className="relative w-full h-full font-earl text-white text-center flex justify-center items-center">
                latest
              </div>
            </div>
            <div
              className={`relative w-full h-fit items-center justify-center flex border border-black rounded-full p-2 cursor-pointer active:scale-95 ${
                filterValues.timestamp === false ? "bg-mazul" : "bg-darker"
              }`}
              onClick={() =>
                dispatch(
                  setFilters({
                    actionPrint: filterValues.print,
                    actionGrant: filterValues.grant,
                    actionTimestamp: false,
                    actionTokens: filterValues.tokens,
                    actionDiscount: filterValues.discount,
                    actionCollectors: filterValues.collectors,
                  })
                )
              }
            >
              <div className="relative w-full h-full font-earl text-white text-center flex justify-center items-center">
                earliest
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col relative w-fit h-fit gap-2">
          <div className="relative w-full h-fit font-mega">Order By Tokens</div>
          <div className="relative w-full h-full flex flex-row gap-2">
            {ACCEPTED_TOKENS_MUMBAI.map((value: string[], index: number) => {
              return (
                <div
                  key={index}
                  className={`relative w-full h-fit flex flex-col gap-1 items-center justify-start cursor-pointer active:scale-95 ${
                    filterValues.tokens.includes(value[1])
                      ? "opacity-70"
                      : "opacity-100"
                  }`}
                  onClick={() => {
                    let newArray;
                    if (filterValues.tokens.includes(value[1])) {
                      newArray = filterValues.tokens.filter(
                        (prevItem) => prevItem !== value[1]
                      );
                    } else {
                      newArray = [...filterValues.tokens, value[1]];
                    }

                    dispatch(
                      setFilters({
                        actionPrint: filterValues.print,
                        actionGrant: filterValues.grant,
                        actionTimestamp: filterValues.timestamp,
                        actionTokens: newArray,
                        actionDiscount: filterValues.discount,
                        actionCollectors: filterValues.collectors,
                      })
                    );
                  }}
                >
                  <div className="relative w-7 h-8 flex rounded-full items-center justify-center">
                    <Image
                      src={`${INFURA_GATEWAY}/${value[2]}`}
                      draggable={false}
                      layout="fill"
                      className="flex"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col relative w-fit h-fit gap-2">
          <div className="relative w-full h-fit font-mega">
            Sort By Fulfiller
          </div>
        </div>
        <div className="flex flex-col relative w-fit h-fit gap-2">
          <div className="relative w-full h-fit font-mega">
            Sort By Grant Collector Discount
          </div>
          <div className="relative flex flex-row gap-2 w-full h-fit text-xs">
            <div
              className={`relative w-full h-fit items-center justify-center flex border border-black rounded-full p-2 cursor-pointer active:scale-95 ${
                filterValues.discount === false ? "bg-mazul" : "bg-darker"
              }`}
              onClick={() =>
                dispatch(
                  setFilters({
                    actionPrint: filterValues.print,
                    actionGrant: filterValues.grant,
                    actionTimestamp: filterValues.timestamp,
                    actionTokens: filterValues.tokens,
                    actionDiscount: false,
                    actionCollectors: filterValues.collectors,
                  })
                )
              }
            >
              <div className="relative w-full h-full font-earl text-white text-center flex justify-center items-center">
                yes
              </div>
            </div>
            <div
              className={`relative w-full h-fit items-center justify-center flex border border-black rounded-full p-2 cursor-pointer active:scale-95 ${
                filterValues.discount ? "bg-mazul" : "bg-darker"
              }`}
              onClick={() =>
                dispatch(
                  setFilters({
                    actionPrint: filterValues.print,
                    actionGrant: filterValues.grant,
                    actionTimestamp: filterValues.timestamp,
                    actionTokens: filterValues.tokens,
                    actionDiscount: true,
                    actionCollectors: filterValues.collectors,
                  })
                )
              }
            >
              <div className="relative w-full h-full font-earl text-white text-center flex justify-center items-center">
                no
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col relative w-fit h-fit gap-2">
          <div className="relative w-full h-fit font-mega">
            Exclusive to Grant Collectors?
          </div>
          <div className="relative flex flex-row gap-2 w-full h-fit text-xs">
            <div
              className={`relative w-full h-fit items-center justify-center flex border border-black rounded-full p-2 cursor-pointer active:scale-95 ${
                filterValues.collectors === false ? "bg-mazul" : "bg-darker"
              }`}
              onClick={() =>
                dispatch(
                  setFilters({
                    actionPrint: filterValues.print,
                    actionGrant: filterValues.grant,
                    actionTimestamp: filterValues.timestamp,
                    actionTokens: filterValues.tokens,
                    actionDiscount: filterValues.discount,
                    actionCollectors: false,
                  })
                )
              }
            >
              <div className="relative w-full h-full font-earl text-white text-center flex justify-center items-center">
                yes
              </div>
            </div>
            <div
              className={`relative w-full h-fit items-center justify-center flex border border-black rounded-full p-2 cursor-pointer active:scale-95 ${
                filterValues.collectors ? "bg-mazul" : "bg-darker"
              }`}
              onClick={() =>
                dispatch(
                  setFilters({
                    actionPrint: filterValues.print,
                    actionGrant: filterValues.grant,
                    actionTimestamp: filterValues.timestamp,
                    actionTokens: filterValues.tokens,
                    actionDiscount: filterValues.discount,
                    actionCollectors: true,
                  })
                )
              }
            >
              <div className="relative w-full h-full font-earl text-white text-center flex justify-center items-center">
                no
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
