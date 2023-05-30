import { useRef } from "react";
import Draggable from "react-draggable";

const useGrant = () => {
  const commentRef = useRef<Draggable | null>(null);
  const grantRef = useRef<Draggable | null>(null);

  return {
    commentRef,
    grantRef,
  };
};

export default useGrant;
