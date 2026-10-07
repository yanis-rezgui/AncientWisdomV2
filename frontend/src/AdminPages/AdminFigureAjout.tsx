import { memo, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildFigureFormData, emptyFigureForm, validateFigureForm, type FigureFormState } from "../AdminComponents/AdminFiguresComponents/figureformUtils";
import { useFiguresAdminContext } from "../AdminContexts/FigureAdminContext";
import Toast from "../AdminComponents/AdminErasComponents/Toast";
import FigureForm from "../AdminComponents/AdminFiguresComponents/FigureForm";



const AdminFigureAjout = () => {

    const navigate = useNavigate();
    const { addFigure, loadingAddFigure, errorMsg, setErrorMsg } = useFiguresAdminContext();

    const [form, setForm] = useState<FigureFormState>(emptyFigureForm);
    const [image, setImage] = useState<File | null>(null);
    const [formError, setFormError] = useState<string>("");
    const [showToast, setShowToast] = useState<boolean>(false);

    // On nettoie l'erreur du context en entrant / quittant la page
    useEffect(() => {
        setErrorMsg("");
        return () => setErrorMsg("");
    }, []);

    const closeToast = useCallback(() => setShowToast(false), []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const error = validateFigureForm(form);
        if (error) {
            setFormError(error);
            return;
        }

        setFormError("");

        const success = await addFigure(buildFigureFormData(form, image));

        if (success) {
            setShowToast(true);
            setTimeout(() => navigate("/admin/figures"), 1200);
        }
    };

    return (
        <section className="flex flex-col w-full items-center min-h-screen bg-[#E8E2D6] pb-10">

            <div className="w-[900px] flex flex-col mt-10 gap-1
            max-[950px]:w-[600px] max-[650px]:w-full max-[650px]:px-4">
                <h2 className="text-[#3E3025] text-[1.5em] font-[600]">Add Figure</h2>
                <p className="text-[#3E3025] text-[14px]">
                    Create a new historical figure for Ancient Wisdom.
                </p>
            </div>

            <div className="w-[900px] mt-5
            max-[950px]:w-[600px] max-[650px]:w-full max-[650px]:px-4">

                {(formError || errorMsg) && (
                    <p className="text-[14px] text-red-800 font-[600] mb-3">
                        {formError || errorMsg}
                    </p>
                )}

                <FigureForm
                    form={form}
                    setForm={setForm}
                    image={image}
                    setImage={setImage}
                    loading={loadingAddFigure}
                    submitLabel="Add figure"
                    loadingLabel="Adding..."
                    submitIcon="fa-solid fa-plus"
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/admin/figures")}
                />
            </div>

            {showToast && <Toast message="Figure added successfully" onClose={closeToast} />}
        </section>
    );
};

export default memo(AdminFigureAjout);