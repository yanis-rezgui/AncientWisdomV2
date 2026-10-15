import { memo, useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import AdminLearnFormPage from "../../AdminComponents/AdminLearn/AdminLearnFormPage";
import Toast from "../../AdminComponents/AdminErasComponents/Toast";
import ChallengeForm from "../../AdminComponents/AdminGames/ChallengeForm";
import {
    getGameConfig,
    type AdminChallenge,
    type GameAdminConfig,
} from "../../AdminComponents/AdminGames/gamesAdminConfig";
import { fetchAdminChallenge } from "../../AdminComponents/AdminGames/useAdminChallenges";
import { useGameAdmin } from "../../AdminComponents/AdminGames/useGameAdmin";
import { useAuthContext } from "../../Contexts/AuthContext";

interface ToastState {
    message: string;
    type: "success" | "error";
}

const UpdateChallenge = ({
    config,
    id,
}: {
    config: GameAdminConfig;
    id: string;
}) => {
    const navigate = useNavigate();
    const { token } = useAuthContext();
    const api = useGameAdmin(config.key);

    const [challenge, setChallenge] = useState<AdminChallenge | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [toast, setToast] = useState<ToastState | null>(null);
    const closeToast = useCallback(() => setToast(null), []);

    const listPath = `/admin/games/${config.key}`;

    useEffect(() => {
        if (!token) return;

        let active = true;

        fetchAdminChallenge<AdminChallenge>(config.apiPath, id, token).then(
            ({ data, message }) => {
                if (!active) return;

                if (data) setChallenge(data);
                else setLoadError(message ?? "Challenge not found.");

                setLoading(false);
            }
        );

        return () => {
            active = false;
        };
    }, [token, config.apiPath, id]);

    const showError = (message: string) => setToast({ message, type: "error" });

    const handleSubmit = async (input: unknown) => {
        const result = await api.update(id, input);

        if (result.success) {
            navigate(listPath, { state: { success: result.message } });
            return;
        }

        showError(result.message);
    };

    // loading / error : AdminLearnFormPage affiche lui-même le chargement et l'erreur
    return (
        <AdminLearnFormPage
            title={`Update the ${config.singular}`}
            subtitle="Edit the details of this challenge."
            backPath={listPath}
            backLabel={`Back to ${config.label}`}
            loading={loading}
            error={loadError}
        >
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={closeToast}
                />
            )}

            {challenge && (
                <ChallengeForm
                    key={challenge._id}
                    game={config.key}
                    initial={challenge}
                    loading={api.loadingUpdate}
                    submitLabel="Save changes"
                    loadingLabel="Saving..."
                    onSubmit={handleSubmit}
                    onCancel={() => navigate(listPath)}
                    onError={showError}
                />
            )}
        </AdminLearnFormPage>
    );
};

const AdminGameChallengeUpdate = () => {
    const { game, id } = useParams();
    const config = getGameConfig(game);

    if (!config || !id) {
        return (
            <div className="mx-auto flex max-w-md flex-col items-center gap-3 p-10 text-center">
                <h1 className="text-[1.4em] font-semibold text-[#3E3025]">
                    Challenge not found
                </h1>
                <Link to="/admin/games" className="text-[#B89B72] hover:underline">
                    Back to games
                </Link>
            </div>
        );
    }

    return <UpdateChallenge key={`${config.key}-${id}`} config={config} id={id} />;
};

export default memo(AdminGameChallengeUpdate);