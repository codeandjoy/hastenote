import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion"; 
import BoardContextMenu from "./BoardContextMenu";
import PlainBtn from "../PlainBtn/PlainBtn";
import EditableText from "./EditableText";
import { db } from "../../db";

import "./css/Board.css";
import { useRecoilState } from "recoil";
import { activeBoardIdState } from "../../atoms/DataAtoms";

const boardVariants = {
    initial: {
        opacity: 0
    },
    animate: {
        opacity: 1
    }
}


const Board = ({ board }) => {
    const [activeBoardId, setActiveBoardId] = useRecoilState(activeBoardIdState);

    const [contextMenuOpen, setContextMenuOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const classNames = "board"
        +(activeBoardId===board.id ? " board-active":"")

    return (
        <motion.div
            variants={ boardVariants }
            initial="initial"
            animate="animate"
            layout
        
            onClick={() => {
                setActiveBoardId(board.id);
            }}
        
            className={ classNames }
        >
            <EditableText
                className="board-name"

                trueState={ board.name }
                onCommit={async (inputState) => {
                    await db.boards.update(board.id, { name: inputState });

                    setIsEditMode(false);
                }}
                isEditMode={ isEditMode }
            />

            <PlainBtn
                type="menu-dots"
                onClick={(e) => {
                    e.stopPropagation();
                    setContextMenuOpen(o => !o);
                }}
                className="btn-menu-dots"
            />

            <AnimatePresence>
                { contextMenuOpen &&
                    <BoardContextMenu
                        onClickOutside={() => { setContextMenuOpen(false); }}
                        onEdit={() => {
                            setIsEditMode(true);
                            setContextMenuOpen(false);
                        }}
                        onDelete={async () => {
                            // change active board id if current board is active
                            if(activeBoardId === board.id){
                                const allBoards = await db.boards.toArray();
                                
                                // if boards besides this one exist
                                if(allBoards.length > 1){
                                    // Set first board in the array as active
                                    const nextActiveId = allBoards.find(b => b.id !== activeBoardId).id;
                                    setActiveBoardId(nextActiveId);
                                }
                                else{
                                    setActiveBoardId(0);
                                }
                            }

                            db.boards.delete(board.id);
                        }}
                    />
                }
            </AnimatePresence>
        </motion.div>
    );
};


export default Board;