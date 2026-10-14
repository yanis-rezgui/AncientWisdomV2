import { memo } from "react";

const GameInstructions = ({ instructions }: { instructions: string[] }) => {
    if (!instructions?.length) return null;

    return (
        <section className="w-full max-w-6xl px-5 pb-16 pt-14">
            <h2 className="mb-1 text-center text-[1.7em] font-bold text-gray-950">
                How to play
            </h2>
            <p className="mb-8 text-center text-gray-700">
                Everything you need to know before you start.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {instructions.map((text, i) => (
                    <div
                        key={i}
                        className="flex gap-4 rounded-2xl border border-[#292722]/10 bg-white p-5"
                    >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#292722] text-sm font-bold text-[#E8E2D6]">
                            {i + 1}
                        </span>
                        <p className="text-sm leading-6 text-[#292722]/80">
                            {text}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default memo(GameInstructions);