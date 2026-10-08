import { useNavigate } from "react-router-dom";
import { memo, useEffect, useState } from "react";
import { useEventsAdminContext } from "../AdminContexts/EventsAdminContext";
import { useEraContext } from "../Contexts/EraContext";
import { buildEventPayload, emptyEventForm, validateEventForm, type EventFormState } from "../AdminComponents/AdminEventsComponents/eventFormUtils";
import EventForm from "../AdminComponents/AdminEventsComponents/EventForm";
import Toast from "../AdminComponents/AdminErasComponents/Toast";


const STORAGE_KEY = "nouvelEvent-draft";

const AdminEventAjout = () => {
    const navigate = useNavigate();
    const { addEvent, loadingAddEvent, errorMsg } = useEventsAdminContext();

    // ⚠️ À adapter : la liste { _id, name } de TOUTES les ères (pas seulement la page courante)
    const { erasOptions } = useEraContext();

    const [form, setForm] = useState<EventFormState>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : emptyEventForm;
        } catch {
            return emptyEventForm;
        }
    });
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    // Sauvegarde du brouillon
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    }, [form]);

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationError = validateEventForm(form);

        if (validationError) {
            setToast({ message: validationError, type: "error" });
            return;
        }

        const success = await addEvent(buildEventPayload(form));

        if (success) {
            setToast({ message: "Event added successfully!", type: "success" });
            localStorage.removeItem(STORAGE_KEY);
            setForm(emptyEventForm);
            setTimeout(() => navigate("/admin/events"), 1200);
        } else {
            setToast({ message: errorMsg || "Something went wrong.", type: "error" });
        }
    };

    return (
        <section className="flex flex-col min-h-screen w-full items-center bg-[#E8E2D6]">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <p className="text-[1.8em] mt-20 font-bold text-center underline px-3 leading-8">
                Add A New Event
            </p>

            <div className="flex flex-col w-[1000px] mt-10 max-[1050px]:w-full px-5 pb-20">
                <div
                    onClick={() => navigate(-1)}
                    className="text-[#3E3025] underline cursor-pointer transition-opacity duration-200
                    hover:opacity-80 active:opacity-60 mb-5"
                >
                    ← Back to events
                </div>

                <EventForm
                    form={form}
                    setForm={setForm}
                    eraOptions={erasOptions}
                    loading={loadingAddEvent}
                    submitLabel="Add event"
                    loadingLabel="Adding..."
                    submitIcon="fa-solid fa-plus"
                    onSubmit={submitForm}
                    onCancel={() => navigate(-1)}
                />
            </div>
        </section>
    );
};

export default memo(AdminEventAjout);