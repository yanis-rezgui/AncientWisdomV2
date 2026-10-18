import { memo } from "react";
import { ArrowRight } from "lucide-react";
import type { HistoricalEra } from "../../Types/Types";

const formatYear = (year: number) =>
    year < 0 ? `${-year} BC` : `${year} AD`;

const EraHero = ({ era }: { era: HistoricalEra }) => {
    return (
        <section
            aria-labelledby="era-title"
            className="mx-auto mt-10 w-full max-w-[900px] px-4"
        >
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                {era.image?.url && (
                    <img
                        src={era.image.url}
                        alt={`Illustration of ${era.name}`}
                        className="aspect-video w-full bg-gray-100 object-cover"
                    />
                )}

                <div className="flex flex-col items-center gap-4 p-6 text-center">
                    <p className="text-[12px] font-bold uppercase tracking-widest text-gray-500">
                        Historical Era
                    </p>

                    <h1
                        id="era-title"
                        className="text-[1.8em] font-bold leading-tight text-[#3E3025]"
                    >
                        {era.name}
                    </h1>

                    <span className="block h-[3px] w-12 rounded bg-[#8C6A43]" />

                    <div className="flex items-center justify-center gap-2 text-[18px] font-semibold text-gray-700">
                        <span>{formatYear(era.startYear)}</span>
                        <ArrowRight size={18} aria-hidden="true" />
                        <span>{formatYear(era.endYear)}</span>
                    </div>

                    {era.description && (
                        <p className="max-w-[720px] text-[17px] leading-8 text-gray-800">
                            {era.description}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default memo(EraHero);