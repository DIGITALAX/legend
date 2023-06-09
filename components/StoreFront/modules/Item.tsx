import { FunctionComponent } from "react";
import { ItemProps } from "../types/storefront.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import lodash from "lodash";

const Item: FunctionComponent<ItemProps> = ({
  collection,
  router,
}): JSX.Element => {
  console.log({
    collection,
    a: lodash.find(
      [
        ["QmaZtrnJTEFFjDHn32ABFhzafakP8o9D3yMFfX2GZuvWLe", "poster"],
        ["QmdBGb4C82EMpi7NxSpuCgTmaVYKsWBdao41GJoQoawX6G", "sticker"],
        ["QmYdNGhxLN5hHhi8r3QLKd232fEzW97dia58RZog8yqFSw", "shirt"],
        ["QmdiRJUu3xxEhGZbbRusMUJ8ffStRZeackYRAt8avpd5dn", "jacket"],
        ["QmXVFuiHYe5k1J5qvgkMqNbgTKe5ZaP7PoByDKZ98cTFcQ", "longsleeve"],
        ["QmcTwmM6LihAEFb8JjPBK2nrVaP3fjf8jwDMsXbwMyNTtn", "hoodie"],
      ],
      ["1", collection.printType]
    ),
  });
  return (
    <div
      className="relative w-90 h-80 rounded-md bg-gris top-10 flex flex-col p-3 gap-5 cursor-pointer"
      onClick={() => router.push(`/collection/${collection.collectionId}`)}
    >
      <div className="relative w-full h-full border-2 border-rosa">
        <Image
          src={`${INFURA_GATEWAY}/${collection.uri?.image}`}
          layout="fill"
          objectFit="cover"
          draggable={false}
        />
        {collection.grantCollectorsOnly && (
          <div className="absolute top-2 left-2 font-earl text-xs">
            <div
              className={`rounded-md relative border border-black flex w-full text-center text-xxs justify-center items-center h-fit py-1.5 font-earl text-white uppercase px-3 bg-darker`}
            >
              Grant Collectors
              <br />
              Only
            </div>
          </div>
        )}
      </div>
      <div className="relative bg-purp border-2 border-rosa w-full h-16 p-1 flex flex-row">
        <div className="relative w-full h-full flex flex-col gap-1">
          <div className="font-mega text-white">{collection.uri.name}</div>
          <div className="font-mega text-white text-xxs">
            {collection.grantName}
          </div>
        </div>
        <div className="relative w-fit justify-end h-full flex items-center">
          <div className="relative w-7 h-7 items-center justify-center flex border border-white bg-darker rounded-full p-1.5">
            <div className="relative w-full h-full">
              <Image
                src={`${INFURA_GATEWAY}/${
                  lodash.find(
                    [
                      [
                        "QmaZtrnJTEFFjDHn32ABFhzafakP8o9D3yMFfX2GZuvWLe",
                        "poster",
                      ],
                      [
                        "QmdBGb4C82EMpi7NxSpuCgTmaVYKsWBdao41GJoQoawX6G",
                        "sticker",
                      ],
                      [
                        "QmYdNGhxLN5hHhi8r3QLKd232fEzW97dia58RZog8yqFSw",
                        "shirt",
                      ],
                      [
                        "QmdiRJUu3xxEhGZbbRusMUJ8ffStRZeackYRAt8avpd5dn",
                        "jacket",
                      ],
                      [
                        "QmXVFuiHYe5k1J5qvgkMqNbgTKe5ZaP7PoByDKZ98cTFcQ",
                        "longsleeve",
                      ],
                      [
                        "QmcTwmM6LihAEFb8JjPBK2nrVaP3fjf8jwDMsXbwMyNTtn",
                        "hoodie",
                      ],
                    ],
                    ["1", collection.printType]
                  )?.[0]
                }`}
                layout="fill"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
