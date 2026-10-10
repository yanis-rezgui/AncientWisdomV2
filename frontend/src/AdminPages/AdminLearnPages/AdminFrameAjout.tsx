import { memo, useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useFramesAdminContext } from "../../AdminContexts/FramesAdminContext";
import { buildFrameFormData, emptyFrameForm, validateFrameForm, type FrameFormState } from "../../AdminComponents/AdminLearn/learnFormUtils";
import { useLearnToast } from "../../AdminComponents/AdminLearn/useLearnToast";
import Toast from "../../AdminComponents/AdminErasComponents/Toast";
import FrameForm from "../../AdminComponents/AdminLearn/FrameForm";
import AdminLearnFormPage from "../../AdminComponents/AdminLearn/AdminLearnFormPage";

const AdminFrameAjout = () => {

    const navigate = useNavigate();
    const { addFrame, loadingAddFrame, errorMsg, setErrorMsg } = useFramesAdminContext();

    const [form, setForm] = useState<FrameFormState>(emptyFrameForm);
    const [image, setImage] = useState<File | null>(null);

    const { toast, showToast, closeToast } = useLearnToast(errorMsg);

    useEffect(() => {
        setErrorMsg("");
        return () => setErrorMsg("");
    }, [setErrorMsg]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const error = validateFrameForm(form, image, true);
        if (error) return showToast(error);

        const success = await addFrame(buildFrameFormData(form, image));

        if (success) navigate("/admin/learn/frames", { state: { success: "Frame added successfully." } });
    };

    return (
        <AdminLearnFormPage
            title="Add a frame"
            subtitle="Fill in the details of the new frame."
            backPath="/admin/learn/frames"
            backLabel="Back to frames"
        >
            {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

            <FrameForm
                form={form}
                setForm={setForm}
                image={image}
                setImage={setImage}
                loading={loadingAddFrame}
                submitLabel="Add frame"
                loadingLabel="Adding..."
                submitIcon="fa-solid fa-plus"
                onSubmit={handleSubmit}
                onCancel={() => navigate("/admin/learn/frames")}
            />
        </AdminLearnFormPage>
    );
};

export default memo(AdminFrameAjout);
