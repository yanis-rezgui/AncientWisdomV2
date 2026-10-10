import { memo } from "react";
import { useNavigate } from "react-router-dom";
import DeleteLearnPop from "./DeleteLearnPop";
import { useFramesAdminContext } from "../../AdminContexts/FramesAdminContext";

const DeleteFramePop = () => {

    const navigate = useNavigate();

    const {
        frameDelete, setFrameDelete, showDeletePop, setShowDeletePop,
        deleteFrame, loadingDeleteFrame, errorMsg, setErrorMsg
    } = useFramesAdminContext();

    if (!showDeletePop || !frameDelete) return null;

    const closePop = () => {
        setErrorMsg("");
        setShowDeletePop(false);
        setFrameDelete(null);
    };

    const handleDelete = async () => {
        const success = await deleteFrame(frameDelete._id);

        if (success) navigate("/admin/learn/frames", { state: { success: "Frame deleted successfully." } });
    };

    return (
        <DeleteLearnPop
            entity="frame"
            name={frameDelete.title}
            detail="with its image"
            loading={loadingDeleteFrame}
            errorMsg={errorMsg}
            onClose={closePop}
            onConfirm={handleDelete}
        />
    );
};

export default memo(DeleteFramePop);
