import { AnyAction, Dispatch } from "redux";
import { setIndexModal } from "@/redux/reducers/indexSlice";
import pollUntilIndexed from "@/graphql/lens/query/checkIndexed";

const handleIndexCheck = async (
  tx: any,
  dispatch: Dispatch<AnyAction>,
  success: boolean
) => {
  try {
    const indexedStatus = await pollUntilIndexed(tx, success);
    if (indexedStatus) {
      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: "Successfully Indexed",
        })
      );
    } else {
      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: "Post Unsuccessful, Please Try Again",
        })
      );
    }
    setTimeout(() => {
      dispatch(
        setIndexModal({
          actionValue: false,
          actionMessage: undefined,
        })
      );
    }, 3000);
  } catch (err: any) {
    console.error(err.message);
  }
};

export default handleIndexCheck;
