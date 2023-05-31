import { getCommentData, setCommentData } from "@/lib/lens/utils";
import { RootState } from "@/redux/store";
import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import lodash from "lodash";
import { setIPFS } from "@/redux/reducers/IPFSSlice";
import { useRouter } from "next/router";
import { MediaType, UploadedMedia } from "@/components/home.types";
import fileLimitAlert from "@/lib/lens/helpers/fileLimitAlert";
import videoLimitAlert from "@/lib/lens/helpers/videoLimitAlert";
import { setPublicationImages } from "@/redux/reducers/publicationImageSlice";
import { setCommentImages } from "@/redux/reducers/commentImagesSlice";
import JSZip from "jszip";
import { setNFTImageArray } from "@/redux/reducers/NFTImageArraySlice";

const useImageUpload = () => {
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [videoLoading, setVideoLoading] = useState<boolean>(false);
  const [fileUploadCount, setFileUploadCount] = useState<number>(0);
  const [mappedFeaturedFiles, setMappedFeaturedFiles] = useState<
    UploadedMedia[]
  >([]);
  const dispatch = useDispatch();
  const router = useRouter();
  const imagesUploaded = useSelector(
    (state: RootState) => state.app.commentImagesReducer.value
  );
  const imagesUploadedPub = useSelector(
    (state: RootState) => state.app.publicationImageReducer.value
  );
  const postValues = useSelector(
    (state: RootState) => state.app.postValuesReducer.value
  );

  const uploadImage = async (
    e: FormEvent | File,
    canvas?: boolean,
    feed?: boolean
  ): Promise<void> => {
    if (!canvas) {
      if ((e as any)?.target?.files?.length < 1) {
        return;
      }
    }
    let finalImages: UploadedMedia[] = [];
    setImageLoading(true);
    if (canvas) {
      try {
        // const compressedImage = await compressImageFiles(e as File);
        const response = await fetch("/api/ipfs", {
          method: "POST",
          body: e as File,
        });
        let cid = await response.json();
        if (response.status !== 200) {
          setImageLoading(false);
        } else {
          finalImages.push({
            cid: String(cid?.cid),
            type: MediaType.Image,
          });
          setMappedFeaturedFiles([
            ...(router.asPath.includes("launch")
              ? imagesUploadedPub
              : (imagesUploaded as any)),
            ...finalImages,
          ]);
          if (feed) {
            if (!router.asPath.includes("launch")) {
              const postStorage = JSON.parse(getCommentData() || "{}");
              setCommentData(
                JSON.stringify({
                  ...postStorage,
                  images: [
                    ...(router.asPath.includes("launch")
                      ? imagesUploadedPub
                      : (imagesUploaded as any)),
                    ...finalImages,
                  ],
                })
              );
            }
          }
        }

        setImageLoading(false);
      } catch (err: any) {
        setImageLoading(false);
        dispatch(setIPFS(true));
        console.error(err.message);
      }
    } else {
      if (fileLimitAlert((e as any).target.files[0])) {
        setImageLoading(false);
        return;
      }
      Array.from(((e as FormEvent).target as HTMLFormElement)?.files).map(
        async (_, index: number) => {
          try {
            // const compressedImage = await compressImageFiles(
            //   (e as any).target.files[index] as File
            // );
            const response = await fetch("/api/ipfs", {
              method: "POST",
              body: (e as any).target.files[index],
            });
            if (response.status !== 200) {
              setImageLoading(false);
            } else {
              let cid = await response.json();
              finalImages.push({
                cid: String(cid?.cid),
                type: MediaType.Image,
              });
              if (
                finalImages?.length ===
                ((e as FormEvent).target as HTMLFormElement).files?.length
              ) {
                let newArr = [
                  ...(router.asPath.includes("launch")
                    ? imagesUploadedPub
                    : (imagesUploaded as any)),
                  ...finalImages,
                ];
                setMappedFeaturedFiles(newArr);
                if (feed) {
                  if (!router.asPath.includes("launch")) {
                    const postStorage = JSON.parse(getCommentData() || "{}");
                    setCommentData(
                      JSON.stringify({
                        ...postStorage,
                        images: newArr,
                      })
                    );
                  }
                }

                setImageLoading(false);
              }
            }
          } catch (err: any) {
            dispatch(setIPFS(true));
            console.error(err.message);
          }
        }
      );
    }
  };

  const uploadVideo = async (e: FormEvent, feed?: boolean) => {
    try {
      if ((e as any).target.files.length < 1) {
        return;
      }
      if (videoLimitAlert((e as any).target.files[0])) {
        return;
      }
      setVideoLoading(true);
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: (e.target as HTMLFormElement).files[0],
      });
      let cid = await response.json();
      let newArr = [
        ...(router.asPath.includes("launch")
          ? imagesUploadedPub
          : (imagesUploaded as any)),
        { cid: String(cid?.cid), type: MediaType.Video },
      ];
      setMappedFeaturedFiles(newArr);

      if (feed) {
        if (!router.asPath.includes("launch")) {
          const postStorage = JSON.parse(getCommentData() || "{}");
          setCommentData(
            JSON.stringify({
              ...postStorage,
              images: newArr,
            })
          );
        }
      }
    } catch (err: any) {
      dispatch(setIPFS(true));
      console.error(err.message);
    }
    setVideoLoading(false);
  };

  const handleRemoveImage = (image: UploadedMedia, feed?: boolean): void => {
    const cleanedArray = lodash.filter(
      router.asPath.includes("launch")
        ? imagesUploadedPub
        : (imagesUploaded as any),
      (uploaded) => uploaded.cid !== image.cid
    );
    setMappedFeaturedFiles(cleanedArray);

    if (feed) {
      if (!router.asPath.includes("launch")) {
        const postStorage = JSON.parse(getCommentData() || "{}");
        setCommentData(
          JSON.stringify({
            ...postStorage,
            images: cleanedArray,
          })
        );
      }
    }
  };

  const uploadZip = async (e: FormEvent) => {
    try {
      if (
        !(e.target as HTMLFormElement).files ||
        (e.target as HTMLFormElement).files.length === 0
      ) {
        return;
      }

      const zipFileData = await (
        e.target as HTMLFormElement
      ).files[0].arrayBuffer();
      const zip = await JSZip.loadAsync(zipFileData);

      // Filter and extract PNG files
      const filteredFiles: { [name: string]: Promise<ArrayBuffer> } = {};
      zip.forEach((relativePath, file) => {
        if (file.dir) return; // Skip directories
        if (relativePath.toLowerCase().endsWith(".png")) {
          filteredFiles[relativePath] = file.async("arraybuffer");
        }
      });

      let cidArray: string[] = [];
      let count = 0;
      for (let name in filteredFiles) {
        let blob = new Blob([await filteredFiles[name]], { type: "image/png" });
        let file = new File([blob], name);
        const response = await fetch("/api/ipfs", {
          method: "POST",
          body: file,
        });
        if (response.status !== 200) {
          setImageLoading(false);
          return;
        } else {
          let cid = await response.json();
          setImageLoading(false);
          cidArray.push(cid?.cid);
        }
        count++;
        setFileUploadCount(count);
      }

      if (cidArray.length < postValues.editionAmount) {
        const duplicateAmount = Math.floor(
          postValues.editionAmount / cidArray.length
        );
        const extraDuplicates = postValues.editionAmount % cidArray.length;

        let filledArray: string[] = [];
        cidArray.forEach((cid, index) => {
          let duplicateTimes = duplicateAmount;
          if (index < extraDuplicates) {
            duplicateTimes++;
          }
          filledArray.push(...new Array(duplicateTimes).fill(cid));
        });

        cidArray = filledArray;
        dispatch(setNFTImageArray(cidArray));
      } else {
        dispatch(setNFTImageArray(cidArray));
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (router.asPath.includes("launch")) {
      if (mappedFeaturedFiles.length > 3) {
        setMappedFeaturedFiles(mappedFeaturedFiles.slice(0, 4));
        dispatch(setPublicationImages(mappedFeaturedFiles.slice(0, 4)));
      } else {
        dispatch(setPublicationImages(mappedFeaturedFiles));
      }
    } else {
      if (mappedFeaturedFiles.length > 3) {
        setMappedFeaturedFiles(mappedFeaturedFiles.slice(0, 4));
        dispatch(setCommentImages(mappedFeaturedFiles.slice(0, 4)));
      } else {
        dispatch(setCommentImages(mappedFeaturedFiles));
      }
    }
  }, [mappedFeaturedFiles]);

  return {
    uploadImage,
    imageLoading,
    mappedFeaturedFiles,
    handleRemoveImage,
    videoLoading,
    uploadVideo,
    uploadZip,
    fileUploadCount,
  };
};

export default useImageUpload;
