import { BracketTreeData } from "@/lib/types";

import { BracketTree } from "./bracket-tree";

type BracketBoardProps = {
  rounds: BracketTreeData;
};

export function BracketBoard({ rounds }: BracketBoardProps) {
  return <BracketTree bracket={rounds} />;
}
