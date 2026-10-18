import { memo } from "react";
import { Link } from "react-router-dom";
import { useQuotesContext } from "../../Contexts/QuotesContext";
import type { HistoricalFigure } from "../../Types/Types";
import SectionHeading from "./SectionHeading";

const FiguresQuotes = ({ figure }: { figure: HistoricalFigure }) => {
    const { quotesFilter, setQuotesFilter } = useQuotesContext();

    return (
        <section
            aria-labelledby="figure-quotes-title"
            className="mx-auto mb-10 mt-10 w-full max-w-[900px] px-4"
        >
            <SectionHeading id="figure-quotes-title" title={`Words of ${figure.name}`} />

            <div
                className="mt-6 flex flex-col items-start justify-between gap-4 rounded-lg
                border border-gray-200 bg-white p-5 min-[620px]:flex-row min-[620px]:items-center"
            >
                <p className="text-gray-700">
                    Read the words attributed to {figure.name} and the ideas they express.
                </p>

                <Link
                    to="/quotes"
                    onClick={() =>
                        setQuotesFilter({
                            ...quotesFilter,
                            author: figure._id,
                        })
                    }
                    className="shrink-0 rounded-md bg-[#3E3025] px-4 py-2 text-[15px] font-semibold
                    text-white transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                >
                    Browse the quotes →
                </Link>
            </div>
        </section>
    );
};

export default memo(FiguresQuotes);