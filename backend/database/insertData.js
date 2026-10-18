
import HelpArticle from "../models/Help/helpArticle.model.js";
import HelpCategory from "../models/Help/helpCategory.model.js";

const helpArticleSeed = async () => {
    try {
        const articles = [
            // =========================================================
            // 1. GETTING STARTED
            // =========================================================
            {
                title: "Welcome to Ancient Wisdom",
                slug: "welcome-to-ancient-wisdom",
                excerpt:
                    "Discover Ancient Wisdom, a platform dedicated to exploring history through historical figures, events, eras, and interactive learning experiences.",
                categorySlug: "getting-started",
                articleType: "guide",
                isFeatured: true,
                order: 1,
                tags: ["welcome", "introduction", "platform", "history"],
                sections: [
                    {
                        heading: "What is Ancient Wisdom?",
                        content:
                            "Ancient Wisdom is an educational platform designed to make history accessible and engaging. It brings together historical eras, influential figures, important events, quotations, and learning resources in one place.",
                        order: 1,
                    },
                    {
                        heading: "What can you discover?",
                        content:
                            "Explore different historical periods, learn about remarkable individuals, discover significant events, and read quotations connected to historical figures. The Learn section also provides educational resources to deepen your knowledge.",
                        order: 2,
                    },
                    {
                        heading: "Learn through interaction",
                        content:
                            "Beyond reading, you can test your knowledge through historical quizzes and games. Depending on the available features, you can also save supported content to revisit it later.",
                        order: 3,
                    },
                    {
                        heading: "Where should you start?",
                        content:
                            "Start by exploring a historical era or a figure that interests you. Follow the related events and resources to build a broader understanding of the historical context.",
                        order: 4,
                    },
                ],
            },
            {
                title: "How to Navigate Ancient Wisdom",
                slug: "how-to-navigate-ancient-wisdom",
                excerpt:
                    "Learn how to find historical content, explore learning resources, and access interactive features across Ancient Wisdom.",
                categorySlug: "getting-started",
                articleType: "guide",
                isFeatured: false,
                order: 2,
                tags: ["navigation", "getting started", "features", "exploration"],
                sections: [
                    {
                        heading: "Explore the main sections",
                        content:
                            "Use the website navigation to access the available sections of Ancient Wisdom. Depending on the page, you can explore historical eras, figures, events, quotations, and educational resources.",
                        order: 1,
                    },
                    {
                        heading: "Find content that interests you",
                        content:
                            "Open a historical figure, event, or era to discover its information and related content. Reading related entries can help you understand connections between people, places, and historical periods.",
                        order: 2,
                    },
                    {
                        heading: "Discover the learning features",
                        content:
                            "Visit the Learn section to explore available educational resources. You can also visit the Quizzes and Games sections to practise your historical knowledge through interactive activities.",
                        order: 3,
                    },
                    {
                        heading: "Need more help?",
                        content:
                            "Visit the Help Center to find guides, answers to common questions, and troubleshooting advice. Use the available search feature to locate relevant articles.",
                        order: 4,
                    },
                ],
            },

            // =========================================================
            // 2. EXPLORING HISTORY
            // =========================================================
            {
                title: "How to Explore Historical Eras",
                slug: "how-to-explore-historical-eras",
                excerpt:
                    "Learn how historical eras help organize the past and how to explore the people and events connected to each period.",
                categorySlug: "exploring-history",
                articleType: "guide",
                isFeatured: true,
                order: 1,
                tags: ["eras", "chronology", "history", "exploration"],
                sections: [
                    {
                        heading: "What is a historical era?",
                        content:
                            "A historical era is a period of time characterized by particular events, societies, political developments, or cultural changes. Studying eras helps organize historical information into a meaningful timeline.",
                        order: 1,
                    },
                    {
                        heading: "Explore an era",
                        content:
                            "Open the Eras section and select a period that interests you. Read its description and explore the information available on the page to understand its main characteristics and historical context.",
                        order: 2,
                    },
                    {
                        heading: "Connect eras with people and events",
                        content:
                            "Historical figures and events are easier to understand when placed in their historical context. Explore related figures, important events, and other available resources to see how different parts of history connect.",
                        order: 3,
                    },
                    {
                        heading: "Build a chronological understanding",
                        content:
                            "Compare dates and developments across periods. Pay attention to what changed, what remained similar, and how one historical development may have influenced another.",
                        order: 4,
                    },
                ],
            },
            {
                title: "Discovering Historical Figures and Events",
                slug: "discovering-historical-figures-and-events",
                excerpt:
                    "Find out how to explore influential historical figures, understand major events, and connect their stories to a wider historical context.",
                categorySlug: "exploring-history",
                articleType: "guide",
                isFeatured: false,
                order: 2,
                tags: ["historical figures", "events", "biography", "research"],
                sections: [
                    {
                        heading: "Explore historical figures",
                        content:
                            "The Figures section introduces individuals who played important roles in history. Explore the available biographies to learn about their lives, achievements, historical context, and influence.",
                        order: 1,
                    },
                    {
                        heading: "Understand historical events",
                        content:
                            "Historical events help explain how societies and civilizations changed over time. Read the available event descriptions to identify the people involved, the context, and the consequences.",
                        order: 2,
                    },
                    {
                        heading: "Look beyond individual stories",
                        content:
                            "A biography or event description is a starting point for further exploration. Connect the information with related eras, places, and other historical entries whenever those connections are available.",
                        order: 3,
                    },
                    {
                        heading: "Read historical information critically",
                        content:
                            "Distinguish established facts from interpretations. When studying an event or quotation, consult the sources provided where available and compare information across reliable historical references.",
                        order: 4,
                    },
                ],
            },

            // =========================================================
            // 3. QUIZZES & GAMES
            // =========================================================
            {
                title: "How to Play Historical Quizzes",
                slug: "how-to-play-historical-quizzes",
                excerpt:
                    "Learn how to start a quiz, choose answers, and use explanations to improve your historical knowledge.",
                categorySlug: "quizzes-games",
                articleType: "guide",
                isFeatured: true,
                order: 1,
                tags: ["quizzes", "questions", "learning", "knowledge"],
                sections: [
                    {
                        heading: "Choose a quiz",
                        content:
                            "Open the Quizzes section and browse the quizzes available on the platform. Read the title and description to understand the topic and choose an activity that matches your interests.",
                        order: 1,
                    },
                    {
                        heading: "Answer the questions",
                        content:
                            "Start the selected quiz and read each question carefully. Review the available answer options before choosing the one you believe is correct. Follow the instructions displayed by the quiz interface.",
                        order: 2,
                    },
                    {
                        heading: "Review your results",
                        content:
                            "When you finish, review the results displayed by the platform. If explanations are provided, read them to understand the correct answers and identify topics that deserve further study.",
                        order: 3,
                    },
                    {
                        heading: "Use quizzes as a learning tool",
                        content:
                            "A quiz is not only a test of memory. Use incorrect answers as opportunities to revisit historical figures, events, and eras, then try another available quiz to reinforce what you have learned.",
                        order: 4,
                    },
                ],
            },
            {
                title: "Getting Started with Historical Games",
                slug: "getting-started-with-historical-games",
                excerpt:
                    "Discover how historical games can help you recognize figures, identify landmarks, and practise your knowledge interactively.",
                categorySlug: "quizzes-games",
                articleType: "guide",
                isFeatured: false,
                order: 2,
                tags: ["games", "figures", "landmarks", "interactive learning"],
                sections: [
                    {
                        heading: "Explore the Games section",
                        content:
                            "Open the Games section to see which historical challenges are available. Each game may have its own objective, instructions, and way of evaluating your answers.",
                        order: 1,
                    },
                    {
                        heading: "Recognize historical figures",
                        content:
                            "In figure-based challenges, examine the available image and clues before selecting or entering an answer. Use historical context and details from what you have learned to guide your choice.",
                        order: 2,
                    },
                    {
                        heading: "Identify historical landmarks",
                        content:
                            "Landmark challenges can help you become familiar with monuments and historically significant places. Read the clues and examine the answer options carefully before making your selection.",
                        order: 3,
                    },
                    {
                        heading: "Learn from each attempt",
                        content:
                            "Treat every challenge as a learning opportunity. When you encounter an unfamiliar person or place, explore the relevant historical resources on Ancient Wisdom to learn more.",
                        order: 4,
                    },
                ],
            },

            // =========================================================
            // 4. FAVORITES & SAVED CONTENT
            // =========================================================
            {
                title: "How to Save Your Favorite Content",
                slug: "how-to-save-your-favorite-content",
                excerpt:
                    "Learn how to save supported historical entries and find them again when you want to revisit them.",
                categorySlug: "favorites-saved-content",
                articleType: "guide",
                isFeatured: true,
                order: 1,
                tags: ["favorites", "saved content", "figures", "events", "quotes"],
                sections: [
                    {
                        heading: "What are favorites?",
                        content:
                            "Favorites let you keep track of supported historical content that you find interesting. They provide a convenient way to return to selected entries without having to search for them again.",
                        order: 1,
                    },
                    {
                        heading: "Add an item to your favorites",
                        content:
                            "Open a supported historical entry, such as a figure, event, or quotation, and look for the favorite control displayed on the page. Use that control to save the item.",
                        order: 2,
                    },
                    {
                        heading: "Find your saved items",
                        content:
                            "Open the Favorites section to view the content you have saved. Select an item to return to its details and continue exploring its historical context.",
                        order: 3,
                    },
                    {
                        heading: "Manage your favorites",
                        content:
                            "If you no longer want to keep an item, use its favorite control again to remove it from your saved collection. The exact content types available may depend on the current platform implementation.",
                        order: 4,
                    },
                ],
            },
            {
                title: "Why Can't I See My Saved Favorites?",
                slug: "why-cant-i-see-my-saved-favorites",
                excerpt:
                    "Troubleshoot missing favorites and check the most common reasons why saved historical content may not appear.",
                categorySlug: "favorites-saved-content",
                articleType: "troubleshooting",
                isFeatured: false,
                order: 2,
                tags: ["favorites", "saved items", "troubleshooting", "account"],
                sections: [
                    {
                        heading: "Check that the item was saved",
                        content:
                            "Return to the original figure, event, or quotation and check the favorite control. If the item is not marked as a favorite, save it again and revisit the Favorites section.",
                        order: 1,
                    },
                    {
                        heading: "Check your account",
                        content:
                            "If favorites are associated with your account, make sure you are signed in to the correct account. If you are not signed in, follow the sign-in process provided by the platform.",
                        order: 2,
                    },
                    {
                        heading: "Refresh the page",
                        content:
                            "Refresh the page and reopen the Favorites section. If the issue persists, try navigating away from the page and returning to it.",
                        order: 3,
                    },
                    {
                        heading: "If the problem continues",
                        content:
                            "If your favorites remain unavailable, contact the platform support team if a support channel is provided. Include a short description of the problem and the steps you have already tried.",
                        order: 4,
                    },
                ],
            },

            // =========================================================
            // 5. ACCOUNT & SECURITY
            // =========================================================
            {
                title: "Creating an Account and Signing In",
                slug: "creating-an-account-and-signing-in",
                excerpt:
                    "Learn the basic steps for registering, signing in, and accessing account-dependent features on Ancient Wisdom.",
                categorySlug: "account-security",
                articleType: "guide",
                isFeatured: false,
                order: 1,
                tags: ["account", "registration", "sign in", "authentication"],
                sections: [
                    {
                        heading: "Create an account",
                        content:
                            "If you are new to Ancient Wisdom, open the registration page when available. Complete the requested fields and follow the instructions displayed by the platform to create your account.",
                        order: 1,
                    },
                    {
                        heading: "Sign in to your account",
                        content:
                            "Open the sign-in page and enter the credentials associated with your account. Follow any additional verification steps if the platform requests them.",
                        order: 2,
                    },
                    {
                        heading: "Access account-dependent features",
                        content:
                            "Some features, such as account-associated favorites, may require you to be signed in. If a feature asks you to authenticate, sign in and try again.",
                        order: 3,
                    },
                    {
                        heading: "Protect your credentials",
                        content:
                            "Keep your password private and avoid sharing your account credentials with other people. When using a shared device, sign out after finishing your session.",
                        order: 4,
                    },
                ],
            },
            {
                title: "What Should I Do If I Cannot Sign In?",
                slug: "what-to-do-if-you-cannot-sign-in",
                excerpt:
                    "Follow these troubleshooting steps if you have difficulty accessing your Ancient Wisdom account.",
                categorySlug: "account-security",
                articleType: "troubleshooting",
                isFeatured: false,
                order: 2,
                tags: ["sign in", "login", "password", "account access"],
                sections: [
                    {
                        heading: "Check your credentials",
                        content:
                            "Make sure you entered the correct email address and password. Check for accidental spaces, typing mistakes, or an incorrect keyboard layout.",
                        order: 1,
                    },
                    {
                        heading: "Check your connection",
                        content:
                            "Make sure your internet connection is working, then reload the page and try signing in again.",
                        order: 2,
                    },
                    {
                        heading: "Follow the available recovery options",
                        content:
                            "If you have forgotten your password, use the password recovery option if it is available on the sign-in page. Follow the instructions displayed by the platform.",
                        order: 3,
                    },
                    {
                        heading: "Get further assistance",
                        content:
                            "If you still cannot access your account, contact the platform support team if a support channel is available. Never send your password or other confidential credentials in a support request.",
                        order: 4,
                    },
                ],
            },

            // =========================================================
            // 6. TROUBLESHOOTING
            // =========================================================
            {
                title: "What to Do When Content Does Not Load",
                slug: "what-to-do-when-content-does-not-load",
                excerpt:
                    "Try these practical steps when a historical page, image, or other piece of content does not load correctly.",
                categorySlug: "troubleshooting",
                articleType: "troubleshooting",
                isFeatured: true,
                order: 1,
                tags: ["loading", "errors", "images", "network", "troubleshooting"],
                sections: [
                    {
                        heading: "Check your internet connection",
                        content:
                            "Confirm that your device is connected to the internet. If other websites are also slow or unavailable, resolve the connection issue before trying again.",
                        order: 1,
                    },
                    {
                        heading: "Refresh the page",
                        content:
                            "Reload the affected page and wait for the content to finish loading. You can also navigate back to the relevant section and reopen the item.",
                        order: 2,
                    },
                    {
                        heading: "Try another browser session",
                        content:
                            "If the problem persists, try opening the page in a private browsing window or another browser. This can help determine whether cached data or a browser extension is contributing to the issue.",
                        order: 3,
                    },
                    {
                        heading: "Report a persistent issue",
                        content:
                            "If the same content repeatedly fails to load, note the page URL, the approximate time of the problem, and what happened. Share these details with the support team if a support channel is available.",
                        order: 4,
                    },
                ],
            },
            {
                title: "How to Report a Problem on Ancient Wisdom",
                slug: "how-to-report-a-problem-on-ancient-wisdom",
                excerpt:
                    "Learn what information to include when reporting a technical issue or an error in historical content.",
                categorySlug: "troubleshooting",
                articleType: "faq",
                isFeatured: false,
                order: 2,
                tags: ["support", "report a problem", "feedback", "errors"],
                sections: [
                    {
                        heading: "Identify the problem",
                        content:
                            "Describe what went wrong and where it happened. For example, a page might fail to load, a feature might not respond, or an article might contain information that appears incorrect.",
                        order: 1,
                    },
                    {
                        heading: "Include useful details",
                        content:
                            "If possible, include the page URL, the steps that led to the problem, the browser you use, and any error message displayed. A screenshot can also help explain the issue, provided it does not expose private information.",
                        order: 2,
                    },
                    {
                        heading: "Report historical inaccuracies",
                        content:
                            "If you believe a historical entry is inaccurate, identify the specific statement and provide a reliable reference when possible. Distinguish factual corrections from differences in historical interpretation.",
                        order: 3,
                    },
                    {
                        heading: "Contact support",
                        content:
                            "Use the official support or contact channel if one is available on the platform. Keep your report clear and concise, and never include passwords, authentication tokens, or other sensitive credentials.",
                        order: 4,
                    },
                ],
            },
        ];

        let createdCount = 0;
        let skippedCount = 0;

        for (const articleData of articles) {
            const {
                categorySlug,
                ...articleFields
            } = articleData;

            const category = await HelpCategory.findOne({
                slug: categorySlug,
            });

            if (!category) {
                console.warn(
                    `Category "${categorySlug}" was not found. ` +
                    `Skipping article "${articleFields.title}".`
                );
                skippedCount++;
                continue;
            }

            const existingArticle = await HelpArticle.findOne({
                slug: articleFields.slug,
            });

            if (existingArticle) {
                console.log(
                    `Article "${articleFields.title}" already exists. Skipping.`
                );
                skippedCount++;
                continue;
            }

            await HelpArticle.create({
                ...articleFields,
                category: category._id,
                isPublished: true,
                publishedAt: new Date(),
            });

            createdCount++;

            console.log(
                `Article "${articleFields.title}" created successfully.`
            );
        }

        console.log(
            `Help Article seed completed. ` +
            `${createdCount} created, ${skippedCount} skipped.`
        );
    } catch (error) {
        console.error("Error creating Help Articles:", error);
        throw error;
    }
};

export default helpArticleSeed;
