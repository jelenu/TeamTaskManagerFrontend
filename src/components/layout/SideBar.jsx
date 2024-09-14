import React from "react";
import { BoardsList } from "../boards/BoardsList";

export const SideBar = ({ onBoardSelect }) => {
  return (
    <div className="h-full w-64 bg-gray-800 text-white">
      <div className="p-4 text-xl font-bold">Boards</div>
      <BoardsList onBoardSelect={onBoardSelect} />
    </div>
  );
};
