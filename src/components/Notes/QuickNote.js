import { useRef } from "react";
import { motion } from "framer-motion";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import { actionsMenuPageFadeActiveState } from "../../atoms/UIAtoms";
import { pageFadeCallbackState } from "../../atoms/UIAtoms";
import { quickNoteModalActionState, quickNoteModalAnimationPosState, quickNoteModalOpenState, quickNoteModalState } from "../../atoms/QuickNoteModalAtoms";

import "./css/Note.css";

const noteVariants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            duration: 1
        }
    },
    exit: {
        opacity: 0,
        scale: .5
    }
}

const Note = ({ note }) => {
    const setActionsMenuPageFadeActive = useSetRecoilState(actionsMenuPageFadeActiveState);
    const setPageFadeCallback = useSetRecoilState(pageFadeCallbackState);

    const setNoteModalAnimationPos = useSetRecoilState(quickNoteModalAnimationPosState);
    const resetNoteModalAnimationPos = useResetRecoilState(quickNoteModalAnimationPosState);

    const setNoteModalData = useSetRecoilState(quickNoteModalState);
    const resetNoteModalData = useResetRecoilState(quickNoteModalState);

    const setNoteModalAction = useSetRecoilState(quickNoteModalActionState);
    const resetNoteModalAction = useResetRecoilState(quickNoteModalActionState);

    const setNoteModalOpen = useSetRecoilState(quickNoteModalOpenState);
    const resetNoteModalOpen = useResetRecoilState(quickNoteModalOpenState);

    const noteRef = useRef();

    return (
        <motion.div 
            variants={ noteVariants }
            initial="initial"
            animate="animate"
            exit="exit"
            layout
        
            ref={ noteRef }
            
            className="note"

            onClick={() => {
                // Open note modal
                setNoteModalAnimationPos({
                    x: noteRef.current.offsetLeft,
                    y: noteRef.current.offsetTop
                });
                setNoteModalData(note); // Set initial data
                setNoteModalAction("edit");
                setNoteModalOpen(true);
                //
                setActionsMenuPageFadeActive(true);

                setPageFadeCallback(()=>()=>{
                    // Close and reset note modal
                    resetNoteModalAnimationPos();
                    resetNoteModalData();
                    resetNoteModalAction();
                    resetNoteModalOpen();
                    //
                    setActionsMenuPageFadeActive(false);
                });
            }}
        >
            <h3 className="note-title">{ note.title }</h3>
            <div className="note-tags"><span>{ note.tags }</span></div>
            <div className="note-line"></div>
            <div className="note-content">{ note.content }</div>
        </motion.div>
    );
};

export default Note;