import { memo, useCallback, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import AdminLearnCard from "../../AdminComponents/AdminLearn/AdminLearnCard";
import AdminLearnList from "../../AdminComponents/AdminLearn/AdminLearnList";
import Toast from "../../AdminComponents/AdminErasComponents/Toast";
import DeleteChallengePop from "../../AdminComponents/AdminGames/DeleteChallengePop";
import {
    getGameConfig,
    type AdminChallenge,
    type GameAdminConfig,
} from "../../AdminComponents/AdminGames/gamesAdminConfig";
import { useAdminChallenges } from "../../AdminComponents/AdminGames/useAdminChallenges";
import { useGameAdmin } from "../../AdminComponents/AdminGames/useGameAdmin";

interface ToastState {
    message: string;
    type: "success" | "error";
}

const ChallengesList = ({ config }: { config: GameAdminConfig }) => {
    const navigate = useNavigate();
    const api = useGameAdmin(config.key);

    const {
        items,
        loading,
        errorMsg,
        page,
        setPage,
        search,
        setSearch,
        total,
        totalPages,
        reload,
    } = useAdminChallenges<AdminChallenge>(config.apiPath);

    const [toast, setToast] = useState<ToastState | null>(null);
    const closeToast = useCallback(() => setToast(null), []);

    const handleDelete = async () => {
        if (!api.challengeToDelete) return;

        const result = await api.remove(api.challengeToDelete._id);

        setToast({
            message: result.message,
            type: result.success ? "success" : "error",
        });

        if (!result.success) return;

        // Dernier élément de la page : on revient à la page précédente
        if (items.length === 1 && page > 1) setPage(page - 1);
        else reload();
    };

    return (
        <>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={closeToast}
                />
            )}

            <AdminLearnList
                title={config.label}
                subtitle={`Manage the ${config.singular}s of this game.`}
                total={total}
                search={search}
                onSearch={setSearch}
                addLabel="Add challenge"
                addPath={`/admin/games/${config.key}/add`}
                loading={loading}
                errorMsg={errorMsg}
                isEmpty={items.length === 0}
                emptyLabel="No challenges found. Add your first challenge."
                page={page}
                totalPages={totalPages}
                setPage={setPage}
                backPath="/admin/games"
                backLabel="Back to games"
            >
                {items.map((challenge) => {
                    const card = config.toCard(challenge);

                    return (
                        <AdminLearnCard
                            key={challenge._id}
                            image={card.image}
                            title={card.title}
                            subtitle={card.subtitle}
                            description={card.description}
                            badge={card.badge}
                            footer={card.footer}
                            onUpdate={() =>
                                navigate(
                                    `/admin/games/${config.key}/${challenge._id}`
                                )
                            }
                            onDelete={() => api.openDeletePop(challenge)}
                        />
                    );
                })}
            </AdminLearnList>

            {api.challengeToDelete && (
                <DeleteChallengePop
                    kind={config.singular}
                    name={config.toCard(api.challengeToDelete).title}
                    loading={api.loadingDelete}
                    onConfirm={handleDelete}
                    onClose={api.closeDeletePop}
                />
            )}
        </>
    );
};

const AdminGameChallenges = () => {
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

    // key : repart d'un état propre (page, recherche) si on change de jeu
    return <ChallengesList key={config.key} config={config} />;
};

export default memo(AdminGameChallenges);