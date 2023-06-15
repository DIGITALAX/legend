import { FunctionComponent } from "react";
import { ImCross } from "react-icons/im";
import { setError } from "@/redux/reducers/errorSlice";
import { ErrorProps } from "../../types/common.types";

const Error: FunctionComponent<ErrorProps> = ({
  dispatch,
  message,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div
        className="relative w-full md:w-[22rem] h-fit col-start-1 place-self-center rounded-lg p-px bg-black flex flex-col border border-white"
        id="modal"
      >
        <div
          className="relative w-full h-fit justify-end pr-3 pt-3 cursor-pointer flex"
          onClick={() =>
            dispatch(
              setError({
                actionValue: false,
                actionMessage: undefined,
              })
            )
          }
        >
          <ImCross color="white" size={15} />
        </div>
        <div className="relative w-full h-fit flex flex-col p-3">
          <div className="relative w-fit h-fit text-white font-mega text-center flex justify-center items-center">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;
