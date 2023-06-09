import { FunctionComponent } from "react";
import { StoreProps } from "../types/launch.types";
import CollectionAdd from "@/components/Common/modules/CollectionAdd";

const Store: FunctionComponent<StoreProps> = ({
  productInformation,
  newPosition,
  editionAmount,
  handleCollectionPrices,
  handleDescription,
  handleEditionAmount,
  handleTitle,
  handleImageUpload,
  imageLoading,
  mintCollection,
  minted,
  collectionLoading,
  handleDiscount,
  handleGrantOnly,
  handlePrintType,
  handleAddPosition,
  handleRemovePosition,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-10">
      <div className="absolute z-2 w-fit h-fit flex bottom-0 right-3">
        <div
          className={`relative bg-darker border border-black flex w-fit text-center text-sm justify-center items-center h-fit p-1 font-earl text-white uppercase cursor-pointer active:scale-95`}
          onClick={() => handleAddPosition()}
        >
          add collection
        </div>
      </div>
      <div className="relative w-full h-fit flex flex-row items-center justify-center gap-6">
        {Array.from({ length: 3 }).map((_, index: number) => {
          return (
            <CollectionAdd
              key={index}
              editionAmount={editionAmount}
              productInformation={productInformation[index]}
              handleCollectionPrices={handleCollectionPrices}
              handleDescription={handleDescription}
              handleEditionAmount={handleEditionAmount}
              handleTitle={handleTitle}
              index={index}
              handleImageUpload={handleImageUpload}
              imageLoading={imageLoading}
              mintCollection={mintCollection}
              minted={minted}
              collectionLoading={collectionLoading}
              handleDiscount={handleDiscount}
              handleGrantOnly={handleGrantOnly}
              handlePrintType={handlePrintType}
            />
          );
        })}
        {newPosition.map(
          (
            position: {
              x: string;
              y: string;
            },
            index: number
          ) => {
            return (
              <CollectionAdd
                key={index}
                deleteFunction={() => handleRemovePosition(index)}
                position={newPosition[index]}
                editionAmount={editionAmount}
                productInformation={productInformation[index + 3]}
                handleCollectionPrices={handleCollectionPrices}
                handleDescription={handleDescription}
                handleEditionAmount={handleEditionAmount}
                handleTitle={handleTitle}
                index={index + 3}
                handleImageUpload={handleImageUpload}
                imageLoading={imageLoading}
                mintCollection={mintCollection}
                minted={minted}
                collectionLoading={collectionLoading}
                handleDiscount={handleDiscount}
                handleGrantOnly={handleGrantOnly}
                handlePrintType={handlePrintType}
              />
            );
          }
        )}
      </div>
    </div>
  );
};

export default Store;
