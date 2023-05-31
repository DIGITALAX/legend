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

const useImageUpload = () => {
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [videoLoading, setVideoLoading] = useState<boolean>(false);
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
  };
};

export default useImageUpload;
