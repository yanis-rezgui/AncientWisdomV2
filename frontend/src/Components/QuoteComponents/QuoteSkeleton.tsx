import { memo } from "react";

const QuoteSkeleton = () => {
    return (
        <article
            className="
                relative flex h-[320px] w-[260px] shrink-0 flex-col
                overflow-hidden rounded-lg
                border border-[#E7DED2]
                bg-[#F8F5EF] p-4 shadow-md
                animate-pulse
            "
            aria-hidden="true"
        >
            {/* Header */}
            <header className="flex h-8 shrink-0 items-center justify-between gap-2">
                <div className="h-3 w-24 rounded bg-[#DED3C5]" />

                <div className="h-8 w-8 shrink-0 rounded-full bg-[#E7DED2]" />
            </header>

            {/* Quote */}
            <div className="mt-3 min-h-0 flex-1 overflow-hidden">
                <div className="mb-3 h-8 w-8 rounded bg-[#DED3C5]" />

                <div className="space-y-2">
                    <div className="h-3 w-full rounded bg-[#DED3C5]" />
                    <div className="h-3 w-[95%] rounded bg-[#DED3C5]" />
                    <div className="h-3 w-[85%] rounded bg-[#DED3C5]" />
                    <div className="h-3 w-full rounded bg-[#DED3C5]" />
                    <div className="h-3 w-[70%] rounded bg-[#DED3C5]" />
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-3 flex h-[52px] shrink-0 items-center justify-between gap-3 border-t border-[#DED3C5] pt-3">
                <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-3 w-28 rounded bg-[#DED3C5]" />
                    <div className="h-2.5 w-20 rounded bg-[#E7DED2]" />
                </div>

                <div className="h-8 w-8 shrink-0 rounded-full bg-[#E7DED2]" />
            </footer>
        </article>
    );
};

export default memo(QuoteSkeleton);