import { FormEvent } from "react";

export type SmallBoxProps = {
  title: string;
  value: any;
  onChangeFunction: (e: FormEvent) => void;
};
