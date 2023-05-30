import { v4 as uuidv4 } from "uuid";
import { useEffect, useRef, useState } from "react";
import {
  getDatabase,
  ref,
  set,
  onValue,
  off,
  onDisconnect,
} from "firebase/database";
import { FirebaseApp } from "firebase/app";
import { INFURA_GATEWAY } from "@/lib/constants";
import GrantBox from "@/components/Home/Grant/modules/GrantBox";
import CommentBox from "@/components/Home/Grant/modules/CommentBox";
import useGrant from "@/components/Home/Grant/hooks/useGrant";
import DynamicNFT from "@/components/Home/Grant/modules/DynamicNFT";
import MirrorBox from "@/components/Home/Grant/modules/MirrorBox";
import CollectBox from "@/components/Home/Grant/modules/CollectBox";

type HomeProps = {
  firebaseApp: FirebaseApp;
};

export default function Home({ firebaseApp }: HomeProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [imageLoaded, setImageLoaded] = useState(false);
  const cursorImage = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    cursorImage.current = new Image();
    cursorImage.current.src = `${INFURA_GATEWAY}/QmSvwVtnD6NRM64xRiPthdYRP8mW3jJHmCEohZMyr7zD4T`;
    cursorImage.current.onload = () => setImageLoaded(true);
  }, []);

  useEffect(() => {
    let userId = sessionStorage.getItem("userId");
    if (!userId) {
      userId = uuidv4();
      sessionStorage.setItem("userId", userId);
    }

    if (!firebaseApp || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const db = getDatabase(firebaseApp);
    const cursorRef = ref(db, `cursors/${userId}`);
    onDisconnect(cursorRef).remove();

    const handleMouseMove = (event: MouseEvent) => {
      const cursorPosition = {
        x: event.clientX,
        y: event.clientY,
        id: userId,
      };
      set(cursorRef, cursorPosition);
    };

    window.addEventListener("mousemove", handleMouseMove);

    const cursorsRef = ref(db, "cursors");
    onValue(cursorsRef, (snapshot) => {
      const cursorPositions = snapshot.val();
      if (cursorPositions) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        Object.values(cursorPositions).forEach((position: any) => {
          if (position.id !== userId && imageLoaded && cursorImage.current) {
            context.drawImage(
              cursorImage.current,
              position.x - cursorImage.current.width / 2,
              position.y - cursorImage.current.height / 2
            );
          }
        });
      }
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      off(cursorsRef);
    };
  }, [firebaseApp, imageLoaded]);

  const { commentRef, grantRef } = useGrant();

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="relative w-full h-full flex flex-row p-6 gap-10 justify-center z-10">
        <div className="relative w-full h-full flex flex-col items-center">
          <CollectBox />
          <MirrorBox />
        </div>
        <div className="relative w-full items-center h-full flex flex-col">
          <DynamicNFT />
          <GrantBox grantRef={grantRef} />
        </div>
        <div className="w-full h-full flex justify-center">
          <CommentBox commentRef={commentRef} />
        </div>
      </div>
      <div className="relative w-full h-full">
        <canvas
          ref={canvasRef}
          className="fixed top-0 left-0 pointer-events-none"
          style={{ zIndex: 9999 }}
        />
      </div>
    </div>
  );
}
