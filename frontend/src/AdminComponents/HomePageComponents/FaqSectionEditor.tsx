
import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import type { HomePageFAQ } from "../../AdminContexts/HomePageContext";

interface FAQSectionEditorProps {
    faqs: HomePageFAQ[];
    onAdd: () => void;
    onUpdate: (
        index: number,
        changes: Partial<HomePageFAQ>
    ) => void;
    onRemove: (index: number) => void;
    onMove: (index: number, direction: -1 | 1) => void;
}

const FAQSectionEditor = ({
    faqs,
    onAdd,
    onUpdate,
    onRemove,
    onMove,
}: FAQSectionEditorProps) => {
    return (
        <section className="overflow-hidden rounded-xl border border-[#E7E0D6] bg-white">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E7E0D6] bg-[#F8F6F1] p-4">
                <div>
                    <h2 className="text-[16px] font-semibold text-[#3E3025]">
                        Frequently Asked Questions
                        <span className="ml-2 rounded-full bg-[#B89B72]/15 px-2 py-0.5 text-[12px] text-[#7A5F3A]">
                            {faqs.length}
                        </span>
                    </h2>

                    <p className="mt-1 text-[12px] leading-5 text-[#7A726A]">
                        Manage homepage questions and answers. Only published
                        FAQs should appear to visitors.
                    </p>
                </div>

                <span></span>
            </div>

            {/* FAQ list */}
            <div className="flex flex-col gap-3 p-4">
                <AnimatePresence initial={false}>
                    {faqs.map((faq, index) => (
                        <motion.article
                            key={faq._id ?? `new-faq-${index}`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="rounded-lg border border-[#E7E0D6] bg-white p-4"
                        >
                            {/* FAQ toolbar */}
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                <span className="flex items-center gap-2 text-[13px] font-semibold text-[#3E3025]">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3E3025] text-[11px] text-white">
                                        {index + 1}
                                    </span>
                                    FAQ #{index + 1}
                                </span>

                                <div className="flex flex-wrap items-center gap-1">
                                    <button
                                        type="button"
                                        aria-label="Move FAQ up"
                                        disabled={index === 0}
                                        onClick={() => onMove(index, -1)}
                                        className="h-8 w-8 cursor-pointer rounded text-[#6B645D] hover:bg-[#F3EFE8] disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        ↑
                                    </button>

                                    <button
                                        type="button"
                                        aria-label="Move FAQ down"
                                        disabled={index === faqs.length - 1}
                                        onClick={() => onMove(index, 1)}
                                        className="h-8 w-8 cursor-pointer rounded text-[#6B645D] hover:bg-[#F3EFE8] disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        ↓
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => onRemove(index)}
                                        className="cursor-pointer rounded px-2 py-1.5 text-[12px] text-[#8B2E2E] hover:bg-[#8B2E2E]/10"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            {/* Question */}
                            <div className="mb-3 flex flex-col gap-1.5">
                                <label
                                    htmlFor={`faq-question-${index}`}
                                    className="text-[13px] font-semibold text-[#3E3025]"
                                >
                                    Question
                                </label>

                                <input
                                    id={`faq-question-${index}`}
                                    type="text"
                                    value={faq.question}
                                    onChange={(event) =>
                                        onUpdate(index, {
                                            question: event.target.value,
                                        })
                                    }
                                    maxLength={250}
                                    placeholder="e.g. What is Ancient Wisdom?"
                                    className="w-full rounded-md border border-[#E7E0D6] bg-white px-3 py-2.5 text-[14px] text-[#3E3025] outline-none focus:border-[#B89B72]"
                                />
                            </div>

                            {/* Answer */}
                            <div className="mb-4 flex flex-col gap-1.5">
                                <label
                                    htmlFor={`faq-answer-${index}`}
                                    className="text-[13px] font-semibold text-[#3E3025]"
                                >
                                    Answer
                                </label>

                                <textarea
                                    id={`faq-answer-${index}`}
                                    value={faq.answer}
                                    onChange={(event) =>
                                        onUpdate(index, {
                                            answer: event.target.value,
                                        })
                                    }
                                    rows={4}
                                    maxLength={5000}
                                    placeholder="Write a clear and helpful answer..."
                                    className="w-full resize-y rounded-md border border-[#E7E0D6] bg-white px-3 py-2.5 text-[14px] leading-6 text-[#3E3025] outline-none focus:border-[#B89B72]"
                                />

                                <span className="text-right text-[11px] text-[#9A9289]">
                                    {faq.answer.length}/5000
                                </span>
                            </div>

                            {/* Publication status */}
                            <label className="flex cursor-pointer items-center gap-3 rounded-md bg-[#F8F6F1] px-3 py-2.5">
                                <input
                                    type="checkbox"
                                    checked={faq.isPublished}
                                    onChange={(event) =>
                                        onUpdate(index, {
                                            isPublished: event.target.checked,
                                        })
                                    }
                                    className="h-4 w-4 accent-[#3E3025]"
                                />

                                <span className="flex flex-col gap-0.5">
                                    <span className="text-[13px] font-semibold text-[#3E3025]">
                                        {faq.isPublished
                                            ? "Published"
                                            : "Draft"}
                                    </span>

                                    <span className="text-[11px] text-[#7A726A]">
                                        {faq.isPublished
                                            ? "This FAQ can be displayed publicly."
                                            : "This FAQ should remain hidden from visitors."}
                                    </span>
                                </span>
                            </label>

                      
                        </motion.article>
                    ))}
                </AnimatePresence>

                {faqs.length === 0 && (
                    <div className="rounded-lg border border-dashed border-[#D8CDBD] px-4 py-10 text-center">
                        <p className="text-[14px] font-medium text-[#3E3025]">
                            No FAQs added yet.
                        </p>

                        <p className="mt-1 text-[12px] text-[#7A726A]">
                            Add questions that help visitors understand
                            Ancient Wisdom.
                        </p>

                        <button
                            type="button"
                            onClick={onAdd}
                            className="mt-4 cursor-pointer rounded-md border border-[#B89B72] px-4 py-2 text-[13px] font-semibold text-[#3E3025] hover:bg-[#B89B72]/10"
                        >
                            Create your first FAQ
                        </button>
                    </div>
                )}
            </div>

            <div className="flex flex-row justify-between items-center p-4">
                        <span></span>
                            <button
                    type="button"
                    onClick={onAdd}
                    className="cursor-pointer  rounded-md bg-[#3E3025] px-3 py-2 text-[13px] font-semibold text-[#F8F5EF] transition-colors hover:bg-[#2D231A]"
                >
                    + Add FAQ
                </button>
                
                </div>
        </section>
    );
};

export default memo(FAQSectionEditor);
