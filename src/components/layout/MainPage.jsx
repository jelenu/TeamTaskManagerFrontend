import React, { useState } from "react";
import { Header } from "./Header";
import { SideBar } from "./SideBar";
import { Board } from "../boards/Board";

export const MainPage = () => {
  const [selectedBoard, setSelectedBoard] = useState(null);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <SideBar onBoardSelect={setSelectedBoard} />
        <div className="flex-1 p-4">
          {selectedBoard ? (
            <Board boardId={selectedBoard.id} boardName={selectedBoard.name} />
          ) : (
            <p>Select a board</p>
          )}
        </div>
      </div>
    </div>
  );
};
