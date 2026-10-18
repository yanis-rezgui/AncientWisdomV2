import { memo, type ReactNode } from "react";
import type { HistoricalFigure } from "../../Types/Types";
import SectionHeading from "./SectionHeading";

const Fact = ({ label, children }: { label: string; children: ReactNode }) => (
    <div
        className="rounded-lg border border-gray-200 bg-white p-5
        transition-colors duration-300 hover:border-[#8C6A43]/60"
    >
        <dt className="text-[12px] font-bold uppercase tracking-widest text-gray-500">
            {label}
        </dt>
        <dd className="mt-3">{children}</dd>
    </div>
);

const FigureFacts = ({ figure }: { figure: HistoricalFigure }) => {
    return (
        <section
            aria-labelledby="figure-facts-title"
            className="mx-auto mt-10 w-full max-w-[900px] px-4"
        >
            <SectionHeading id="figure-facts-title" title="Quick Facts" />

            <dl className="mt-6 grid grid-cols-1 gap-4 min-[620px]:grid-cols-2 min-[920px]:grid-cols-3">
                <Fact label="Born">
                    <p className="text-[18px] font-medium">
                        {figure.birthDate || "Unknown"}
                    </p>
                    {figure.birthPlace && (
                        <p className="mt-1 text-gray-600">{figure.birthPlace}</p>
                    )}
                </Fact>

                <Fact label="Died">
                    <p className="text-[18px] font-medium">
                        {figure.deathDate || "Unknown"}
                    </p>
                    {figure.deathPlace && (
                        <p className="mt-1 text-gray-600">{figure.deathPlace}</p>
                    )}
                </Fact>

                <Fact label={figure.eras.length === 1 ? "Era" : "Eras"}>
                    <ul className="flex flex-col gap-1">
                        {figure.eras.map((era) => (
                            <li key={era._id} className="text-[17px] font-medium leading-6">
                                {era.name}
                            </li>
                        ))}
                    </ul>
                </Fact>
            </dl>
        </section>
    );
};

export default memo(FigureFacts);