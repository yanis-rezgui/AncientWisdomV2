import { useNavigate } from "react-router-dom";
import type { ProfileFavoriteBreakdown, ProfileFavoriteType } from "../../Types/ProfileStatsTypes";
import { btnOutline, Card, StatTile } from "./ProfileUI";

const MyCollection = ({ favoritesByType }: { favoritesByType: ProfileFavoriteBreakdown[] }) => {
    const navigate = useNavigate();
    const count = (t: ProfileFavoriteType) => favoritesByType.find((f) => f._id === t)?.count ?? 0;

    return (
        <Card
            title="My collection"
            subtitle="Saved quotes, figures and events"
            action={
                <button type="button" className={btnOutline} onClick={() => navigate("/favorites")}>
                    View collection
                </button>
            }
        >
            <div className="grid grid-cols-3 gap-3">
                <StatTile value={count("Quote")} label="Quotes" />
                <StatTile value={count("Figure")} label="Figures" />
                <StatTile value={count("Event")} label="Events" />
            </div>
        </Card>
    );
};

export default MyCollection;