import { memo, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { Crown, Landmark, Map as MapIcon } from "lucide-react";

import { useFrameContext } from "../../Contexts/FrameContext";
import type { Frame } from "../../Types/LearnTypes";
import FrameSlider from "../../Components/LearnComponents/FramesComponents/FrameSlider";
import FrameModal from "../../Components/LearnComponents/FramesComponents/FrameModal";

const Frames = () => {
    const { monuments, statues, maps, loadingPublicFrames } = useFrameContext();

    const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);

    const openFrame = useCallback((frame: Frame) => setSelectedFrame(frame), []);
    const closeFrame = useCallback(() => setSelectedFrame(null), []);

    const sections = [
        {
            title: "Monuments",
            description:
                "Temples, fortresses, and ruins that still stand as witnesses of the civilizations that built them.",
            icon: Landmark,
            frames: monuments,
        },
        {
            title: "Statues",
            description:
                "Sculpted portraits of rulers, gods, and heroes, carved to outlast the people they honor.",
            icon: Crown,
            frames: statues,
        },
        {
            title: "Maps",
            description:
                "Charts and atlases that show how people once saw their world, and how its borders changed.",
            icon: MapIcon,
            frames: maps,
        },
    ];

    return (
        <section className="flex flex-col min-h-screen items-center w-full bg-[#E8E2D6] pb-10">
            {/* Header */}
            <div className="flex flex-col justify-center items-center gap-2 mt-10 px-5">
                <h3 className="text-[#3E3025] font-semibold text-center">
                    FRAMES OF HISTORY
                </h3>

                <h1 className="text-[1.5em] font-bold text-gray-800 text-center">
                    Monuments, Statues, and Maps
                </h1>

                <p
                    className="w-[500px] text-center text-gray-800
                    max-[550px]:w-[300px]"
                >
                    Explore the stone, bronze, and ink that carried the past
                    into the present. Browse each collection and open any
                    piece to learn its story.
                </p>

                <Link
                    to="/learn"
                    className="p-2 mt-2 bg-white text-[#3E3025] font-semibold text-[14px] rounded-lg flex flex-row gap-2
                    items-center cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                >
                    <i className="fa-solid fa-arrow-left"></i> Back to Learn
                </Link>
            </div>

            {/* One slider per type */}
            {sections.map((s) => (
                <FrameSlider
                    key={s.title}
                    title={s.title}
                    description={s.description}
                    icon={s.icon}
                    frames={s.frames}
                    loading={loadingPublicFrames}
                    onOpen={openFrame}
                />
            ))}

            <FrameModal frame={selectedFrame} onClose={closeFrame} />
        </section>
    );
};

export default memo(Frames);