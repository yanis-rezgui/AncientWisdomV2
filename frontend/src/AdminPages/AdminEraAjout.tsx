import { useNavigate } from "react-router-dom";
import { memo, useEffect, useState } from "react";
import { useErasAdminContext } from "../AdminContexts/ErasAdminContext";
import { buildEraFormData, emptyEraForm, validateEraForm, type EraFormState } from "../AdminComponents/AdminErasComponents/eraFormUtils";
import EraForm from "../AdminComponents/AdminErasComponents/EraForm";
import Toast from "../AdminComponents/AdminErasComponents/Toast";





const STORAGE_KEY = "nouvelleEra-draft";

const AdminEraAjout = () => {
    const navigate = useNavigate();
    const { addEra, loadingAddEra, errorMsg } = useErasAdminContext();

    const [form, setForm] = useState<EraFormState>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : emptyEraForm;
        } catch {
            return emptyEraForm;
        }
    });
    const [image, setImage] = useState<File | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    // Sauvegarde du brouillon (l'image ne peut pas être stockée dans localStorage)
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    }, [form]);

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationError = validateEraForm(form);

        if (validationError) {
            setToast({ message: validationError, type: "error" });
            return;
        }

        if (!image) {
            setToast({ message: "Era image is required.", type: "error" });
            return;
        }

        const success = await addEra(buildEraFormData(form, image));

        if (success) {
            setToast({ message: "Era added successfully!", type: "success" });
            localStorage.removeItem(STORAGE_KEY);
            setForm(emptyEraForm);
            setImage(null);
            setTimeout(() => navigate("/admin/eras"), 1200);
        } else {
            setToast({ message: errorMsg || "Something went wrong.", type: "error" });
        }
    };

    return (
        <section className="flex flex-col min-h-screen w-full items-center bg-[#E8E2D6]">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <p className="text-[1.8em] mt-20 font-bold text-center underline px-3 leading-8">
                Add A New Era
            </p>

            <div className="flex flex-col w-[1000px] mt-10 max-[1050px]:w-full px-5 pb-20">
                <div
                    onClick={() => navigate(-1)}
                    className="text-[#3E3025] underline cursor-pointer transition-opacity duration-200
                    hover:opacity-80 active:opacity-60 mb-5"
                >
                    ← Back to eras
                </div>

                <EraForm
                    form={form}
                    setForm={setForm}
                    image={image}
                    setImage={setImage}
                    loading={loadingAddEra}
                    submitLabel="Add era"
                    loadingLabel="Adding..."
                    submitIcon="fa-solid fa-plus"
                    onSubmit={submitForm}
                    onCancel={() => navigate(-1)}
                />
            </div>
        </section>
    );
};

export default memo(AdminEraAjout);