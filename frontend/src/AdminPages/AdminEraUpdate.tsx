import { useNavigate, useParams } from "react-router-dom";
import { memo, useEffect, useState } from "react";
import { useEraContext } from "../Contexts/EraContext";
import { useErasAdminContext } from "../AdminContexts/ErasAdminContext";
import { buildEraFormData, eraToForm, validateEraForm, type EraFormState } from "../AdminComponents/AdminErasComponents/eraFormUtils";
import Toast from "../AdminComponents/AdminErasComponents/Toast";
import EraForm from "../AdminComponents/AdminErasComponents/EraForm";
import DeleteEraPop from "../AdminComponents/AdminErasComponents/DeleteEraPop";



const AdminEraUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { getEra, currentEra, loadingEra } = useEraContext();
    const {
        updateEra,
        loadingUpdateEra,
        errorMsg,
        showDeletePop,
        setShowDeletePop,
        setEraDelete
    } = useErasAdminContext();

    const [form, setForm] = useState<EraFormState | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const storageKey = `modifEra-${id}`;

    useEffect(() => {
        if (id) getEra(id);
    }, [id]);

    // Charge l'ère (ou le brouillon s'il existe)
    useEffect(() => {
        if (!currentEra) return;

        try {
            const saved = localStorage.getItem(storageKey);
            setForm(saved ? JSON.parse(saved) : eraToForm(currentEra));
        } catch {
            setForm(eraToForm(currentEra));
        }
    }, [currentEra]);

    // Sauvegarde le brouillon seulement s'il diffère de l'ère enregistrée
    useEffect(() => {
        if (!form || !currentEra) return;

        const isUnchanged = JSON.stringify(form) === JSON.stringify(eraToForm(currentEra));

        if (isUnchanged) {
            localStorage.removeItem(storageKey);
        } else {
            localStorage.setItem(storageKey, JSON.stringify(form));
        }
    }, [form, currentEra]);

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!form || !id) return;

        const validationError = validateEraForm(form);

        if (validationError) {
            setToast({ message: validationError, type: "error" });
            return;
        }

        // L'image n'est envoyée que si elle a été changée
        const success = await updateEra(id, buildEraFormData(form, image));

        if (success) {
            setToast({ message: "Era updated successfully!", type: "success" });
            localStorage.removeItem(storageKey);
            setImage(null);
            await getEra(id);
        } else {
            setToast({ message: errorMsg || "Something went wrong.", type: "error" });
        }
    };

    return (
        <>
            <section className="flex flex-col min-h-screen w-full items-center bg-[#E8E2D6]">
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

                {loadingEra ? (
                    <p className="text-[17px] text-gray-900 font-bold mt-40 text-center">Loading ...</p>
                ) : !currentEra || !form ? (
                    <p className="text-[17px] text-gray-900 font-bold mt-40 text-center">Era not available</p>
                ) : (
                    <>
                        <p className="text-[1.8em] mt-20 font-bold text-center underline px-3 leading-8">
                            {currentEra.name}
                        </p>

                        <div className="flex flex-col w-[1000px] mt-10 max-[1050px]:w-full px-5 pb-20">
                            <div className="flex flex-row justify-between items-center gap-3 mb-5">
                                <div
                                    onClick={() => navigate(-1)}
                                    className="text-[#3E3025] underline cursor-pointer transition-opacity duration-200
                                    hover:opacity-80 active:opacity-60"
                                >
                                    ← Back to eras
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setEraDelete(currentEra);
                                        setShowDeletePop(true);
                                    }}
                                    className="bg-red-900 text-white text-[13px] font-[600] p-2 px-3 rounded-lg
                                    cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                                >
                                    <i className="fa-solid fa-trash"></i> Delete
                                </button>
                            </div>

                            <p className="font-bold text-[1.8em] text-[#3E3025] underline mb-5 max-[620px]:text-[1.4em]">
                                Update The Era:
                            </p>

                            <EraForm
                                form={form}
                                setForm={setForm as React.Dispatch<React.SetStateAction<EraFormState>>}
                                image={image}
                                setImage={setImage}
                                currentImageUrl={currentEra.image?.url}
                                loading={loadingUpdateEra}
                                submitLabel="Save changes"
                                loadingLabel="Saving..."
                                submitIcon="fa-solid fa-floppy-disk"
                                onSubmit={submitForm}
                                onCancel={() => navigate(-1)}
                            />
                        </div>
                    </>
                )}
            </section>

            {showDeletePop && <DeleteEraPop />}
        </>
    );
};

export default memo(AdminEraUpdate);