import { useNavigate, useParams } from "react-router-dom";
import { memo, useEffect, useState } from "react";
import { useEventContext } from "../Contexts/EventContext";
import { useEraContext } from "../Contexts/EraContext";
import { useEventsAdminContext } from "../AdminContexts/EventsAdminContext";
import { buildEventPayload, eventToForm, validateEventForm, type EventFormState } from "../AdminComponents/AdminEventsComponents/eventFormUtils";
import Toast from "../AdminComponents/AdminErasComponents/Toast";
import EventForm from "../AdminComponents/AdminEventsComponents/EventForm";
import DeleteEventPop from "../AdminComponents/AdminEventsComponents/DeleteEventPop";


const AdminEventUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // ⚠️ À adapter si les noms diffèrent dans ton EventContext
    const { getEvent, currentEvent, loadingEvent } = useEventContext();

    // ⚠️ À adapter : la liste { _id, name } de TOUTES les ères
    const { erasOptions } = useEraContext();

    const {
        updateEvent,
        loadingUpdateEvent,
        errorMsg,
        showDeletePop,
        setShowDeletePop,
        setEventDelete
    } = useEventsAdminContext();

    const [form, setForm] = useState<EventFormState | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const storageKey = `modifEvent-${id}`;

    useEffect(() => {
        if (id) getEvent(id);
    }, [id]);

    // Charge l'event (ou le brouillon s'il existe)
    useEffect(() => {
        if (!currentEvent) return;

        try {
            const saved = localStorage.getItem(storageKey);
            setForm(saved ? JSON.parse(saved) : eventToForm(currentEvent));
        } catch {
            setForm(eventToForm(currentEvent));
        }
    }, [currentEvent]);

    // Sauvegarde le brouillon seulement s'il diffère de l'event enregistré
    useEffect(() => {
        if (!form || !currentEvent) return;

        const isUnchanged = JSON.stringify(form) === JSON.stringify(eventToForm(currentEvent));

        if (isUnchanged) {
            localStorage.removeItem(storageKey);
        } else {
            localStorage.setItem(storageKey, JSON.stringify(form));
        }
    }, [form, currentEvent]);

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!form || !id) return;

        const validationError = validateEventForm(form);

        if (validationError) {
            setToast({ message: validationError, type: "error" });
            return;
        }

        const success = await updateEvent(id, buildEventPayload(form));

        if (success) {
            setToast({ message: "Event updated successfully!", type: "success" });
            localStorage.removeItem(storageKey);
            await getEvent(id);
        } else {
            setToast({ message: errorMsg || "Something went wrong.", type: "error" });
        }
    };

    return (
        <>
            <section className="flex flex-col min-h-screen w-full items-center bg-[#E8E2D6]">
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

                {loadingEvent ? (
                    <p className="text-[17px] text-gray-900 font-bold mt-40 text-center">Loading ...</p>
                ) : !currentEvent || !form ? (
                    <p className="text-[17px] text-gray-900 font-bold mt-40 text-center">Event not available</p>
                ) : (
                    <>
                        <p className="text-[1.8em] mt-20 font-bold text-center underline px-3 leading-8">
                            {currentEvent.name}
                        </p>

                        <div className="flex flex-col w-[1000px] mt-10 max-[1050px]:w-full px-5 pb-20">
                            <div className="flex flex-row justify-between items-center gap-3 mb-5">
                                <div
                                    onClick={() => navigate(-1)}
                                    className="text-[#3E3025] underline cursor-pointer transition-opacity duration-200
                                    hover:opacity-80 active:opacity-60"
                                >
                                    ← Back to events
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setEventDelete(currentEvent);
                                        setShowDeletePop(true);
                                    }}
                                    className="bg-red-900 text-white text-[13px] font-[600] p-2 px-3 rounded-lg
                                    cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                                >
                                    <i className="fa-solid fa-trash"></i> Delete
                                </button>
                            </div>

                            <p className="font-bold text-[1.8em] text-[#3E3025] underline mb-5 max-[620px]:text-[1.4em]">
                                Update The Event:
                            </p>

                            <EventForm
                                form={form}
                                setForm={setForm as React.Dispatch<React.SetStateAction<EventFormState>>}
                                eraOptions={erasOptions}
                                loading={loadingUpdateEvent}
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

            {showDeletePop && <DeleteEventPop />}
        </>
    );
};

export default memo(AdminEventUpdate);