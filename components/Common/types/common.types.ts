import { FormEvent } from "react";

export type SmallBoxProps = {
  title: string;
  value: any;
  onChangeFunction: (e: FormEvent) => void;
};

export type TopBarThreeProps = {
  text: string;
};
