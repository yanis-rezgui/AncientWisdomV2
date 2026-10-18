import { memo } from "react";

const highlights = [
    { title: "Figures", text: "Philosophers, rulers and thinkers" },
    { title: "Eras & events", text: "The moments that shaped the world" },
    { title: "Quotes & quizzes", text: "Read, learn and test yourself" },
];

const AuthPanel = ({ isSignIn }: { isSignIn: boolean }) => (
    <div className="flex flex-col justify-between gap-8 bg-[#3E3025] p-6 text-[#F5F0E7] sm:p-10">
        <div>
            <p className="text-[12px] font-bold uppercase tracking-widest text-[#C9A66B]">
                Ancient Wisdom
            </p>

            <h1 className="mt-4 font-serif text-[1.8em] font-semibold leading-tight sm:text-[2.2em]">
                {isSignIn ? "Welcome back." : "Begin your journey."}
            </h1>

            <span className="mt-4 block h-[3px] w-12 rounded bg-[#C9A66B]" />

            <p className="mt-4 leading-7 text-[#E8E2D6]">
                {isSignIn
                    ? "Sign in to pick up where you left off and find your saved items."
                    : "Create an account to save what you love and follow your progress through the ancient world."}
            </p>
        </div>

        {/* Visible à partir de md pour garder le mobile compact */}
        <ul className="hidden divide-y divide-[#C9A66B]/30 border-t border-[#C9A66B]/30 md:block">
            {highlights.map((item) => (
                <li key={item.title} className="py-3">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-[14px] text-[#D8CDBD]">{item.text}</p>
                </li>
            ))}
        </ul>
    </div>
);

export default memo(AuthPanel);