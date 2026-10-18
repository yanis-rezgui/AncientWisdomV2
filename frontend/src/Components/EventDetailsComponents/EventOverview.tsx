import { memo } from "react";
import SectionHeading from "../FigureDetailsComponents/SectionHeading";

const EventOverview = ({ description }: { description: string }) => {
    if (!description) return null;

    return (
        <section
            aria-labelledby="event-overview-title"
            className="mx-auto mt-10 w-full max-w-[900px] px-4"
        >
            <SectionHeading id="event-overview-title" title="Overview" />

            <div className="mt-6 flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-5">
                {description
                    .trim()
                    .split(/\n{2,}/)
                    .map((paragraph, i) => (
                        <p key={i} className="text-[17px] leading-8 text-gray-800">
                            {paragraph}
                        </p>
                    ))}
            </div>
        </section>
    );
};

export default memo(EventOverview);