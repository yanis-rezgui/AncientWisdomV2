import { memo, useEffect } from "react";
import { useArticleAdminContext } from "../../AdminContexts/ArticleAdminContext";
import { inputClass } from "./learnFormUtils";

interface EraSelectProps {
    value: string;
    onChange: (eraId: string) => void;
}

// Utilise GET /api/v1/era/options via ArticleAdminContext
const EraSelect = ({ value, onChange }: EraSelectProps) => {

    const { eraOptions, getEraOptions } = useArticleAdminContext();

    useEffect(() => {
        if (eraOptions.length === 0) void getEraOptions();
    }, [eraOptions.length, getEraOptions]);

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputClass} cursor-pointer`}
        >
            <option value="">Select an era</option>
            {eraOptions.map((era) => (
                <option key={era._id} value={era._id}>{era.name}</option>
            ))}
        </select>
    );
};

export default memo(EraSelect);
