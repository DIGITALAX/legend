import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import { useEffect, useRef } from "react";
import { getDatabase, ref, set, onValue, off } from "firebase/database";
import { FirebaseApp } from "firebase/app";

type CursorPosition = {
  x: number;
  y: number;
  id: string;
};

type HomeProps = {
  firebaseApp: FirebaseApp;
};

export default function Home({ firebaseApp }: HomeProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!firebaseApp || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      const db = getDatabase(firebaseApp);
      set(ref(db, `cursors/${event.clientX}_${event.clientY}`), {
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    const db = getDatabase(firebaseApp);
    const cursorsRef = ref(db, "cursors");
    onValue(cursorsRef, (snapshot) => {
      const cursorPositions = snapshot.val();
      const cursorsArray: CursorPosition[] = Object.keys(
        cursorPositions || {}
      ).map((id) => ({
        id,
        ...cursorPositions[id],
      }));

      // Clear the canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw cursors on the canvas
      cursorsArray.forEach((cursor) => {
        context.beginPath();
        context.arc(cursor.x, cursor.y, 5, 0, 2 * Math.PI);
        context.fillStyle = "red";
        context.fill();
      });
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      off(cursorsRef);
    };
  }, [firebaseApp, canvasRef.current]);

  useEffect(() => {
    const resizeHandler = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener("resize", resizeHandler);
    resizeHandler();

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div className="relative w-full h-full overflow-x-hidden flex flex-col cursor-pixel h-screen selection:bg-white selection:text-azul">
        <Header />
        <Footer />
      </div>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}
