import { memo, useEffect, useRef, useState } from "react";
import { Hourglass } from "lucide-react";
import { formatClock } from "../../Types/QuizHelpers";


const secondsLeft = (startedAt: string, timeLimit: number) =>
    Math.max(0, timeLimit * 60 - Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000));

interface QuizTimerProps {
    startedAt: string;
    // minutes, null = unlimited
    timeLimit: number | null;
    onExpire: () => void;
}

const QuizTimer = ({ startedAt, timeLimit, onExpire }: QuizTimerProps) => {

    const [remaining, setRemaining] = useState(() =>
        timeLimit === null ? 0 : secondsLeft(startedAt, timeLimit)
    );

    const onExpireRef = useRef(onExpire);
    const expired = useRef(false);

    useEffect(() => {
        onExpireRef.current = onExpire;
    });

    useEffect(() => {

        if (timeLimit === null) return;

        const tick = () => {
            const left = secondsLeft(startedAt, timeLimit);
            setRemaining(left);

            if (left <= 0 && !expired.current) {
                expired.current = true;
                onExpireRef.current();
            }
        };

        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);

    }, [startedAt, timeLimit]);

    if (timeLimit === null) {
        return (
            <div className="flex items-center gap-2 text-sm font-semibold text-[#3E3025]/70">
                <Hourglass size={18} />
                Untimed
            </div>
        );
    }

    const urgent = remaining <= 60;

    return (
        <div
            role="timer"
            className={`flex items-center gap-2 px-3 py-1 rounded-[5px] border-2 font-bold font-serif text-[1.2em] ${
                urgent
                    ? "border-[#8B2E2E] text-[#8B2E2E] bg-[#8B2E2E]/10"
                    : "border-[#3E3025] text-[#3E3025] bg-[#F0E6D8]"
            }`}
        >
            <Hourglass size={18} />
            {formatClock(remaining)}
        </div>
    );
};

export default memo(QuizTimer);
