import { memo, useCallback, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import AdminLearnFormPage from "../../AdminComponents/AdminLearn/AdminLearnFormPage";
import Toast from "../../AdminComponents/AdminErasComponents/Toast";
import ChallengeForm from "../../AdminComponents/AdminGames/ChallengeForm";
import {
    getGameConfig,
    type GameAdminConfig,
} from "../../AdminComponents/AdminGames/gamesAdminConfig";
import { useGameAdmin } from "../../AdminComponents/AdminGames/useGameAdmin";

interface ToastState {
    message: string;
    type: "success" | "error";
}

const AddChallenge = ({ config }: { config: GameAdminConfig }) => {
    const navigate = useNavigate();
    const api = useGameAdmin(config.key);

    const [toast, setToast] = useState<ToastState | null>(null);
    const closeToast = useCallback(() => setToast(null), []);

    const listPath = `/admin/games/${config.key}`;

    const showError = (message: string) => setToast({ message, type: "error" });

    const handleSubmit = async (input: unknown) => {
        const result = await api.add(input);

        if (result.success) {
            navigate(listPath, { state: { success: result.message } });
            return;
        }

        showError(result.message);
    };

    return (
        <AdminLearnFormPage
            title={`Add a ${config.singular}`}
            subtitle="Fill in the details of the new challenge."
            backPath={listPath}
            backLabel={`Back to ${config.label}`}
        >
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={closeToast}
                />
            )}

            <ChallengeForm
                game={config.key}
                loading={api.loadingAdd}
                submitLabel="Add challenge"
                loadingLabel="Adding..."
                onSubmit={handleSubmit}
                onCancel={() => navigate(listPath)}
                onError={showError}
            />
        </AdminLearnFormPage>
    );
};

const AdminGameChallengeAjout = () => {
    const { game } = useParams();
    const config = getGameConfig(game);

    if (!config) {
        return (
            <div className="mx-auto flex max-w-md flex-col items-center gap-3 p-10 text-center">
                <h1 className="text-[1.4em] font-semibold text-[#3E3025]">
                    Game not found
                </h1>
                <Link to="/admin/games" className="text-[#B89B72] hover:underline">
                    Back to games
                </Link>
            </div>
        );
    }

    return <AddChallenge key={config.key} config={config} />;
};

export default memo(AdminGameChallengeAjout);