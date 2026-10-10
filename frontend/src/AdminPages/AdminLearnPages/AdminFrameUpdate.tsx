import { memo, useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFramesAdminContext } from "../../AdminContexts/FramesAdminContext";
import { buildFrameFormData, emptyFrameForm, frameToForm, validateFrameForm, type FrameFormState } from "../../AdminComponents/AdminLearn/learnFormUtils";
import { useFrameContext } from "../../Contexts/FrameContext";
import { useLearnToast } from "../../AdminComponents/AdminLearn/useLearnToast";
import AdminLearnFormPage from "../../AdminComponents/AdminLearn/AdminLearnFormPage";
import Toast from "../../AdminComponents/AdminErasComponents/Toast";
import FrameForm from "../../AdminComponents/AdminLearn/FrameForm";
import DeleteFramePop from "../../AdminComponents/AdminLearn/DeleteFramePop";

const AdminFrameUpdate = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const { getFrame, currentFrame, setCurrentFrame, loadingFrame, errorMsg: fetchError } = useFrameContext();
    const {
        updateFrame, loadingUpdateFrame, errorMsg, setErrorMsg,
        setFrameDelete, setShowDeletePop
    } = useFramesAdminContext();

    const [form, setForm] = useState<FrameFormState>(emptyFrameForm);
    const [image, setImage] = useState<File | null>(null);

    const { toast, showToast, closeToast } = useLearnToast(errorMsg);

    useEffect(() => {
        setErrorMsg("");
        if (id) void getFrame(id);

        return () => {
            setCurrentFrame(null);
            setErrorMsg("");
        };
    }, [id, getFrame, setCurrentFrame, setErrorMsg]);

    useEffect(() => {
        if (currentFrame && currentFrame._id === id) setForm(frameToForm(currentFrame));
    }, [currentFrame, id]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!id) return;

        const error = validateFrameForm(form, image, false);
        if (error) return showToast(error);

        const success = await updateFrame(id, buildFrameFormData(form, image));

        if (success) navigate("/admin/learn/frames", { state: { success: "Frame updated successfully." } });
    };

    return (
        <>
            <AdminLearnFormPage
                title="Update frame"
                subtitle={currentFrame?.title ?? "Edit the details of this frame."}
                backPath="/admin/learn/frames"
                backLabel="Back to frames"
                loading={loadingFrame || (!currentFrame && !fetchError)}
                error={!currentFrame ? fetchError : ""}
                onDelete={() => {
                    if (!currentFrame) return;
                    setFrameDelete(currentFrame);
                    setShowDeletePop(true);
                }}
            >
                {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

                <FrameForm
                    form={form}
                    setForm={setForm}
                    image={image}
                    setImage={setImage}
                    currentImageUrl={currentFrame?.image?.url}
                    loading={loadingUpdateFrame}
                    submitLabel="Save changes"
                    loadingLabel="Saving..."
                    submitIcon="fa-solid fa-floppy-disk"
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/admin/learn/frames")}
                />
            </AdminLearnFormPage>

            <DeleteFramePop />
        </>
    );
};

export default memo(AdminFrameUpdate);
