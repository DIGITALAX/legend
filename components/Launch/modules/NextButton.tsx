import { FunctionComponent } from "react";
import { NextButtonProps } from "../types/launch.types";

const NextButton: FunctionComponent<NextButtonProps> = ({
  page,
  setPage,
}): JSX.Element => {
  return (
    <div className="flex flex-row gap-3">
      {page > 0 && (
        <div
          className="relative w-20 h-10 font-earl text-black active:scale-95"
          onClick={() => setPage(page > 0 ? page - 1 : 0)}
        >
          Back
        </div>
      )}
      <div
        className="relative w-20 h-10 font-earl text-black active:scale-95"
        onClick={() => setPage(page < 5 ? page + 1 : 0)}
      >
        Next
      </div>
    </div>
  );
};

export default NextButton;
