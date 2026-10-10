import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { btnBase } from "../../AdminComponents/AdminLearn/learnFormUtils";


interface LearnSection {
    label: string;
    icon: string;
    description: string;
    listPath: string;
    listLabel: string;
    addPath?: string;
    addLabel?: string;
}

const SECTIONS: LearnSection[] = [
    {
        label: "Articles",
        icon: "fa-solid fa-newspaper",
        description: "Long-form articles with sections and tags.",
        listPath: "/admin/learn/articles",
        listLabel: "Manage articles",
        addPath: "/admin/learn/addArticle",
        addLabel: "Add",
    },
    {
        label: "Books",
        icon: "fa-solid fa-book",
        description: "The recommended reading list.",
        listPath: "/admin/learn/books",
        listLabel: "Manage books",
        addPath: "/admin/learn/addBook",
        addLabel: "Add",
    },
    {
        label: "Movies",
        icon: "fa-solid fa-film",
        description: "Movies that bring history to life.",
        listPath: "/admin/learn/movies",
        listLabel: "Manage movies",
        addPath: "/admin/learn/addMovie",
        addLabel: "Add",
    },
    {
        label: "Frames",
        icon: "fa-solid fa-landmark",
        description: "Monuments, statues and maps.",
        listPath: "/admin/learn/frames",
        listLabel: "Manage frames",
        addPath: "/admin/learn/addFrame",
        addLabel: "Add",
    },
    {
        label: "Tips",
        icon: "fa-solid fa-lightbulb",
        description: "The learning tips: introduction, tips and conclusion.",
        listPath: "/admin/learn/tips",
        listLabel: "Edit tips",
    },
];

const AdminLearn = () => {

    const navigate = useNavigate();

    return (
        <div className="flex flex-col w-full items-center gap-5 p-5">

            <div className="flex flex-col w-full max-w-[900px] gap-1">
                <h1 className="text-[22px] font-bold text-[#3E3025]">Learn</h1>
                <p className="text-[14px] text-gray-600">
                    Manage everything that helps visitors learn about history.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-[900px] max-[620px]:grid-cols-1">
                {SECTIONS.map((section) => (
                    <div
                        key={section.label}
                        className="flex flex-col bg-[#F8F5EF] rounded-lg shadow-lg p-5 gap-3
                        transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                        <div className="flex flex-row items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-[#3E3025] text-white">
                                <i className={section.icon}></i>
                            </div>

                            <h2 className="text-[18px] font-bold text-[#3E3025]">{section.label}</h2>
                        </div>

                        <p className="text-[14px] text-gray-700">{section.description}</p>

                        <div className="flex flex-row gap-2 mt-auto">
                            <button
                                onClick={() => navigate(section.listPath)}
                                className={`${btnBase} bg-[#3E3025] text-white`}
                            >
                                <i className="fa-solid fa-pen-to-square"></i> {section.listLabel}
                            </button>

                            {section.addPath && (
                                <button
                                    onClick={() => navigate(section.addPath!)}
                                    className={`${btnBase} bg-green-900 text-white`}
                                >
                                    <i className="fa-solid fa-plus"></i> {section.addLabel}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default memo(AdminLearn);
