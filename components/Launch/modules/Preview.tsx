import { FunctionComponent } from "react";
import { PreviewProps } from "../types/launch.types";

const Preview: FunctionComponent<PreviewProps> = ({
  title,
  postDescription,
  referralFee,
  recipients,
  editionAmount,
  valueAmount,
  currency,
}): JSX.Element => {
  return <div className="relative w-full h-full"></div>;
};

export default Preview;
