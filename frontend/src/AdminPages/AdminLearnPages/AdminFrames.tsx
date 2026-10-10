import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useFrameContext } from "../../Contexts/FrameContext";
import { useFramesAdminContext } from "../../AdminContexts/FramesAdminContext";
import AdminLearnList from "../../AdminComponents/AdminLearn/AdminLearnList";
import AdminLearnCard from "../../AdminComponents/AdminLearn/AdminLearnCard";
import DeleteFramePop from "../../AdminComponents/AdminLearn/DeleteFramePop";


// Suppose que FrameContext suit le même modèle que BookContext / MovieContext
const AdminFrames = () => {

    const navigate = useNavigate();

    const {
        frames, loadingAllFrames, errorMsg, page, setPage,
        totalPages, totalFrames, search, setSearch
    } = useFrameContext();

    const { setFrameDelete, setShowDeletePop } = useFramesAdminContext();

    return (
        <>
            <AdminLearnList
                title="Frames"
                subtitle="Manage monuments, statues and maps."
                total={totalFrames}
                search={search}
                onSearch={(value) => { setPage(1); setSearch(value); }}
                addLabel="Add frame"
                addPath="/admin/learn/addFrame"
                loading={loadingAllFrames}
                errorMsg={errorMsg}
                isEmpty={frames.length === 0}
                emptyLabel="No frames found. Add your first frame."
                page={page}
                totalPages={totalPages}
                setPage={setPage}
            >
                {frames.map((frame) => (
                    <AdminLearnCard
                        key={frame._id}
                        image={frame.image?.url}
                        title={frame.title}
                        subtitle={frame.location}
                        description={frame.description}
                        badge={frame.type}
                        footer={frame.era?.name ?? "No era"}
                        onUpdate={() => navigate(`/admin/learn/frame/${frame._id}`)}
                        onDelete={() => {
                            setFrameDelete(frame);
                            setShowDeletePop(true);
                        }}
                    />
                ))}
            </AdminLearnList>

            <DeleteFramePop />
        </>
    );
};

export default memo(AdminFrames);
