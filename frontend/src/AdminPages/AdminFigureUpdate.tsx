import { memo, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FigureForm from "../AdminComponents/AdminFiguresComponents/FigureForm";
import DeleteFigurePop from "../AdminComponents/AdminFiguresComponents/DeleteFigurePop";

import type { HistoricalFigure } from "../Types/Types";
import { useFiguresAdminContext } from "../AdminContexts/FigureAdminContext";
import { buildFigureFormData, emptyFigureForm, figureToForm, validateFigureForm, type FigureFormState } from "../AdminComponents/AdminFiguresComponents/figureformUtils";
import Toast from "../AdminComponents/AdminErasComponents/Toast";


const AdminFigureUpdate = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const {
        updateFigure,
        loadingUpdateFigure,
        showDeletePop,
        setShowDeletePop,
        setFigureDelete,
        errorMsg,
        setErrorMsg
    } = useFiguresAdminContext();

    const [figure, setFigure] = useState<HistoricalFigure | null>(null);
    const [form, setForm] = useState<FigureFormState>(emptyFigureForm);
    const [image, setImage] = useState<File | null>(null);
    const [loadingFigure, setLoadingFigure] = useState<boolean>(true);
    const [loadError, setLoadError] = useState<string>("");
    const [formError, setFormError] = useState<string>("");
    const [showToast, setShowToast] = useState<boolean>(false);

    useEffect(() => {
        setErrorMsg("");
        return () => setErrorMsg("");
    }, []);

    // Chargement direct par id (la liste du context est paginée, la figure n'y est pas forcément)
    useEffect(() => {
        const fetchFigure = async () => {
            try {
                setLoadingFigure(true);
                setLoadError("");

                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/figure/${id}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || data.message || "Error in loading figure");
                }

                // Adapte selon la forme de ta réponse : { figure } ou l'objet direct
                const loaded: HistoricalFigure = data.figure ?? data.data ?? data;

                setFigure(loaded);
                setForm(figureToForm(loaded));

            } catch (err) {
                console.error(err);
                setLoadError(err instanceof Error ? err.message : "Error in loading figure");
            } finally {
                setLoadingFigure(false);
            }
        };

        fetchFigure();
    }, [id]);

    const closeToast = useCallback(() => setShowToast(false), []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!id) return;

        const error = validateFigureForm(form);
        if (error) {
            setFormError(error);
            return;
        }

        setFormError("");

        const success = await updateFigure(id, buildFigureFormData(form, image));

        if (success) {
            setShowToast(true);
            setTimeout(() => navigate("/admin/figures"), 1200);
        }
    };

    return (
        <section className="flex flex-col w-full items-center min-h-screen bg-[#E8E2D6] pb-10">

            <div className="w-[900px] flex flex-row items-center justify-between mt-10
            max-[950px]:w-[600px] max-[650px]:w-full max-[650px]:px-4 max-[650px]:flex-col max-[650px]:gap-3">
                <div className="flex flex-col gap-1">
                    <h2 className="text-[#3E3025] text-[1.5em] font-[600]">Update Figure</h2>
                    <p className="text-[#3E3025] text-[14px]">
                        Edit the information of this historical figure.
                    </p>
                </div>

                {figure && (
                    <button
                        type="button"
                        onClick={() => {
                            setFigureDelete(figure);
                            setShowDeletePop(true);
                        }}
                        className="bg-red-900 text-white text-[13px] font-[600] p-2 px-3 rounded-lg
                        cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                    >
                        <i className="fa-solid fa-trash"></i> Delete
                    </button>
                )}
            </div>

            <div className="w-[900px] mt-5
            max-[950px]:w-[600px] max-[650px]:w-full max-[650px]:px-4">

                {loadingFigure && (
                    <p className="text-[14px] text-[#3E3025] text-center">
                        <i className="fa-solid fa-spinner fa-spin"></i> Loading...
                    </p>
                )}

                {loadError && (
                    <p className="text-[14px] text-red-800 font-[600] text-center">{loadError}</p>
                )}

                {!loadingFigure && figure && (
                    <>
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
                            currentImageUrl={figure.image?.url}
                            loading={loadingUpdateFigure}
                            submitLabel="Save changes"
                            loadingLabel="Saving..."
                            submitIcon="fa-solid fa-floppy-disk"
                            onSubmit={handleSubmit}
                            onCancel={() => navigate("/admin/figures")}
                        />
                    </>
                )}
            </div>

            {showToast && <Toast message="Figure updated successfully" onClose={closeToast} />}
            {showDeletePop && <DeleteFigurePop />}
        </section>
    );
};

export default memo(AdminFigureUpdate);