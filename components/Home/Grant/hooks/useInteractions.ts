import {
  CommentOrderingTypes,
  CommentRankingFilter,
  Publication,
} from "@/components/home.types";
import canCommentPub from "@/graphql/lens/query/canComment";
import {
  whoCommentedPublications,
  whoCommentedPublicationsAuth,
} from "@/graphql/lens/query/getPublications";
import whoCollectedPublications from "@/graphql/lens/query/whoCollectedPublications";
import { whoMirroredPublications } from "@/graphql/lens/query/whoMirroredPublications";
import whoReactedublications from "@/graphql/lens/query/whoReactedPublications";
import checkIfMirrored from "@/lib/lens/helpers/checkIfMirrored";
import checkPostReactions from "@/lib/lens/helpers/checkPostReactions";
import { setCanComment } from "@/redux/reducers/canCommentSlice";
import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import lodash from "lodash";

const useInteractions = () => {
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);
  const [paginated, setPaginated] = useState<any>();
  const [commentors, setCommentors] = useState<Publication[]>([]);
  const [hasMirrored, setHasMirrored] = useState<boolean[]>([]);
  const [hasReacted, setHasReacted] = useState<boolean[]>([]);
  const [collectors, setCollectors] = useState<any[]>([]);
  const [collectPageInfo, setCollectPageInfo] = useState<any>();
  const [reactInfoLoading, setReactInfoLoading] = useState<boolean>(false);
  const [hasMoreReact, setHasMoreReact] = useState<boolean>(true);
  const [hasMoreMirror, setHasMoreMirror] = useState<boolean>(true);
  const [reacters, setReacters] = useState<any[]>([]);
  const [reactionPageInfo, setReactionPageInfo] = useState<any>();
  const [mirrorers, setMirrorers] = useState<any[]>([]);
  const [mirrorInfoLoading, setMirrorInfoLoading] = useState<any>();
  const [mirrorPageInfo, setMirrorPageInfo] = useState<any>();
  const [collectorsLoading, setCollectorsLoading] = useState<boolean>(false);
  const [hasMoreCollects, setHasMoreCollects] = useState<boolean>(true);
  const [hasMoreComments, setHasMoreComments] = useState<boolean>(true);
  const dispatch = useDispatch();
  const router = useRouter();
  const profileId = useSelector(
    (state: RootState) => state.app.profileReducer.profile?.id
  );
  const homeGrant = useSelector(
    (state: RootState) => state.app.homeGrantReducer.value
  );
  const commentId = useSelector(
    (state: RootState) => state.app.secondaryCommentReducer.value
  );
  const index = useSelector((state: RootState) => state.app.indexReducer);

  const getPostComments = async (): Promise<void> => {
    setCommentsLoading(true);
    try {
      let comments: any;

      if (profileId) {
        comments = await whoCommentedPublicationsAuth({
          commentsOf:
            commentId !== ""
              ? commentId
              : profileId +
                "-0x" +
                Number(homeGrant?.pubId).toString(16).padStart(2, "0"),
          limit: 20,
          commentsOfOrdering: CommentOrderingTypes.Ranking,
          commentsRankingFilter: CommentRankingFilter.Relevant,
        });
      } else {
        comments = await whoCommentedPublications({
          commentsOf:
            commentId !== ""
              ? commentId
              : profileId +
                "-0x" +
                Number(homeGrant?.pubId).toString(16).padStart(2, "0"),
          limit: 20,
          commentsOfOrdering: CommentOrderingTypes.Ranking,
          commentsRankingFilter: CommentRankingFilter.Relevant,
        });
      }
      if (!comments || !comments?.data || !comments?.data?.publications) {
        setCommentsLoading(false);
        return;
      }
      const sortedArr: any[] = [...comments?.data?.publications?.items];
      if (sortedArr?.length < 20) {
        setHasMoreComments(false);
      } else {
        setHasMoreComments(true);
      }
      setCommentors(sortedArr);
      setPaginated(comments?.data?.publications?.pageInfo);
      if (profileId) {
        const hasMirroredArr = await checkIfMirrored(sortedArr, profileId);
        setHasMirrored(hasMirroredArr);
        const response = await checkPostReactions(
          {
            commentsOf:
              commentId !== ""
                ? commentId
                : profileId +
                  "-0x" +
                  Number(homeGrant?.pubId).toString(16).padStart(2, "0"),
            limit: 20,
            commentsOfOrdering: CommentOrderingTypes.Ranking,
            commentsRankingFilter: CommentRankingFilter.Relevant,
          },
          profileId,
          undefined,
          true
        );
        setHasReacted(response);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setCommentsLoading(false);
  };

  const getMorePostComments = async (): Promise<void> => {
    try {
      if (!paginated?.next) {
        // fix apollo duplications on null next
        setHasMoreComments(false);
        return;
      }
      let comments: any;
      if (profileId) {
        comments = await whoCommentedPublicationsAuth({
          commentsOf:
            commentId !== ""
              ? commentId
              : profileId +
                "-0x" +
                Number(homeGrant?.pubId).toString(16).padStart(2, "0"),
          limit: 20,
          cursor: paginated?.next,
          commentsOfOrdering: CommentOrderingTypes.Ranking,
          commentsRankingFilter: CommentRankingFilter.Relevant,
        });
      } else {
        comments = await whoCommentedPublications({
          commentsOf:
            commentId !== ""
              ? commentId
              : profileId +
                "-0x" +
                Number(homeGrant?.pubId).toString(16).padStart(2, "0"),
          limit: 20,
          cursor: paginated?.next,
          commentsOfOrdering: CommentOrderingTypes.Ranking,
          commentsRankingFilter: CommentRankingFilter.Relevant,
        });
      }
      if (
        !comments ||
        !comments?.data ||
        !comments?.data?.publications ||
        comments?.data?.publications?.items?.length < 1
      ) {
        setCommentsLoading(false);
        return;
      }
      const sortedArr: any[] = [...comments?.data?.publications?.items];
      if (sortedArr?.length < 20) {
        setHasMoreComments(false);
      }
      setCommentors([...commentors, ...sortedArr]);
      setPaginated(comments?.data?.publications?.pageInfo);
      if (profileId) {
        const hasMirroredArr = await checkIfMirrored(sortedArr, profileId);
        setHasMirrored([...hasMirrored, ...hasMirroredArr]);
        const hasReactedArr = await checkPostReactions(
          {
            commentsOf:
              commentId !== ""
                ? commentId
                : profileId +
                  "-0x" +
                  Number(homeGrant?.pubId).toString(16).padStart(2, "0"),
            limit: 20,
            cursor: paginated?.next,
            commentsOfOrdering: CommentOrderingTypes.Ranking,
            commentsRankingFilter: CommentRankingFilter.Relevant,
          },
          profileId,
          undefined,
          true
        );
        setHasReacted([...hasReacted, ...hasReactedArr]);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getPostCollects = async (): Promise<void> => {
    setCollectorsLoading(true);
    try {
      const collects = await whoCollectedPublications({
        publicationId:
          profileId +
          "-0x" +
          Number(homeGrant?.pubId).toString(16).padStart(2, "0"),
        limit: 30,
      });
      const arr: any[] = [...collects?.data?.whoCollectedPublication.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setCollectors(sortedArr);
      setCollectPageInfo(collects?.data?.whoCollectedPublication?.pageInfo);
      if (sortedArr?.length < 30) {
        setHasMoreCollects(false);
      } else {
        setHasMoreCollects(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setCollectorsLoading(false);
  };

  const getMorePostCollects = async (): Promise<void> => {
    if (!collectPageInfo?.next) {
      setHasMoreCollects(false);
      return;
    }
    try {
      const collects = await whoCollectedPublications({
        publicationId:
          profileId +
          "-0x" +
          Number(homeGrant?.pubId).toString(16).padStart(2, "0"),
        limit: 30,
        cursor: collectPageInfo?.next,
      });
      const arr: any[] = [...collects.data.whoCollectedPublication.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      if (sortedArr?.length < 2) {
        setHasMoreCollects(false);
      }
      setCollectors([...collectors, ...sortedArr]);
      setCollectPageInfo(collects?.data?.whoCollectedPublication?.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getPostReactions = async (): Promise<void> => {
    setReactInfoLoading(true);
    try {
      const reactions = await whoReactedublications({
        publicationId:
          profileId +
          "-0x" +
          Number(homeGrant?.pubId).toString(16).padStart(2, "0"),
        limit: 10,
      });
      const upvoteArr = lodash.filter(
        reactions?.data?.whoReactedPublication.items,
        (item) => item.reaction === "UPVOTE"
      );
      const arr: any[] = [...upvoteArr];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      if (sortedArr?.length < 10) {
        setHasMoreReact(false);
      } else {
        setHasMoreReact(true);
      }
      setReacters(sortedArr);
      setReactionPageInfo(reactions?.data?.whoReactedPublication?.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
    setReactInfoLoading(false);
  };

  const getMorePostReactions = async (): Promise<void> => {
    try {
      if (!reactionPageInfo?.next) {
        // fix apollo duplications on null next
        setHasMoreReact(false);
        return;
      }
      const reactions = await whoReactedublications({
        publicationId:
          profileId +
          "-0x" +
          Number(homeGrant?.pubId).toString(16).padStart(2, "0"),
        limit: 10,
        cursor: reactionPageInfo?.next,
      });
      const arr: any[] = [...reactions?.data?.whoReactedPublication?.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      if (sortedArr?.length < 10) {
        setHasMoreReact(false);
      } else {
        setHasMoreReact(true);
      }
      setReacters([...reacters, ...sortedArr]);
      setReactionPageInfo(reactions?.data.whoReactedPublication.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getPostMirrors = async (): Promise<void> => {
    setMirrorInfoLoading(true);
    try {
      const mirrors = await whoMirroredPublications({
        whoMirroredPublicationId:
          profileId +
          "-0x" +
          Number(homeGrant?.pubId).toString(16).padStart(2, "0"),
        limit: 10,
      });
      const arr: any[] = [...mirrors.data.profiles.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      if (sortedArr?.length < 10) {
        setHasMoreMirror(false);
      } else {
        setHasMoreMirror(true);
      }
      setMirrorers(sortedArr);
      setMirrorPageInfo(mirrors?.data.profiles.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
    setMirrorInfoLoading(false);
  };

  const getMorePostMirrors = async (): Promise<void> => {
    try {
      if (!mirrorPageInfo?.next) {
        // fix apollo duplications on null next
        setHasMoreMirror(false);
        return;
      }
      const mirrors = await whoMirroredPublications({
        whoMirroredPublicationId:
          profileId +
          "-0x" +
          Number(homeGrant?.pubId).toString(16).padStart(2, "0"),
        limit: 10,
        cursor: mirrorPageInfo?.next,
      });
      const arr: any[] = [...mirrors.data.profiles.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      if (sortedArr?.length < 10) {
        setHasMoreMirror(false);
      } else {
        setHasMoreMirror(true);
      }
      setMirrorers([...mirrorers, ...sortedArr]);
      setMirrorPageInfo(mirrors?.data.profiles.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const canComment = async () => {
    try {
      const res = await canCommentPub(
        {
          publicationId: commentId,
        },
        profileId
      );
      if (!res.data.publication.canComment.result) {
        dispatch(setCanComment(false));
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (commentId !== "" && profileId) {
      canComment();
    } else {
      dispatch(setCanComment(true));
    }
  }, [commentId]);

  useEffect(() => {
    if (
      profileId +
      "-0x" +
      Number(homeGrant?.pubId).toString(16).padStart(2, "0")
    ) {
      getPostComments();
      getPostCollects();
    }
  }, [
    profileId + "-0x" + Number(homeGrant?.pubId).toString(16).padStart(2, "0"),
    profileId,
    commentId,
  ]);

  useEffect(() => {
    if (index.message === "Successfully Indexed") {
      getPostComments();
      getPostCollects();
      getPostMirrors();
      getPostReactions();
    }
  }, [index.message]);

//   useEffect(() => {
//     getPostComments();
//     getPostCollects();
//     getPostMirrors();
//     getPostReactions();
//   }, []);

  return {
    commentors,
    getMorePostComments,
    commentsLoading,
    collectors,
    collectorsLoading,
    getMorePostCollects,
    hasMoreCollects,
    hasMoreComments,
    hasMirrored,
    hasReacted,
    getMorePostReactions,
    getMorePostMirrors,
    mirrorers,
    reacters,
    reactInfoLoading,
    mirrorInfoLoading,
    hasMoreReact,
    hasMoreMirror,
  };
};

export default useInteractions;
