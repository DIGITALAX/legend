import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FormEvent, FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { ImageUploadDynamicProps } from "../types/launch.types";

const ImageUploadDynamic: FunctionComponent<ImageUploadDynamicProps> = ({
  imageLoading,
  uploadZip,
  fileUploadCount
}): JSX.Element => {
  return (
    <div className="w-full h-full relative flex flex-col justify-center items-center">
      <div className="relative w-1/2 h-fit font-earl text-black text-center">
        upload your zip file of images, if you want your image to change with
        each collect, upload the zip with the same amount, otherwise images will
        be evenly duplicated
      </div>
      <label
        className={`relative w-4 h-4 items-center flex ${
          !imageLoading && "cursor-pointer active:scale-95"
        } ${imageLoading && "animate-spin"} `}
        onChange={(e: FormEvent) => {
          !imageLoading ? uploadZip(e) : {};
        }}
      >
        {!imageLoading ? (
          <Image
            src={`${INFURA_GATEWAY}/QmR3SNUJj2BNc8iTCAZ1pf6CngJkKwi6vJ36YSroF4N6HE`}
            alt="opt"
            layout="fill"
            draggable={false}
          />
        ) : (
          <AiOutlineLoading color="white" size={15} />
        )}
        <input
          type="file"
          accept=".zip,application/zip"
          hidden
          required
          id="files"
          multiple={false}
          name="images"
          className="caret-transparent"
          disabled={imageLoading ? true : false}
        />
      </label>
    </div>
  );
};

export default ImageUploadDynamic;
