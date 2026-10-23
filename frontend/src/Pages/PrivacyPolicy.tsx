import { memo } from "react";
import { useSettingsContext } from "../Contexts/SettingsContext";

const privacyPolicySections = (siteName: string, email?: string) => [
    {
        id: 1,
        title: "1. Introduction",
        content: [
            `This Privacy Policy explains how ${siteName} may collect, use, store, and protect personal information when you access the website or use its features.`,
            `${siteName} is an educational platform focused on history, culture, historical knowledge, quizzes, and interactive games.`,
            "This policy should be read together with any additional notices presented when creating an account, submitting content, or using a specific feature.",
        ],
    },
    {
        id: 2,
        title: "2. Who Is Responsible for Your Data?",
        content: [
            `The person or legal entity operating ${siteName} is responsible for determining how personal information is processed through the platform.`,
            "The operator's full legal identity and business address should be added here once confirmed. The public project name alone does not establish the identity of a legally registered entity.",
            ...(email
                ? [`For privacy-related questions, contact: ${email}.`]
                : ["A dedicated privacy contact email has not yet been configured."]),
        ],
    },
    {
        id: 3,
        title: "3. Information We May Collect",
        content: [
            "Depending on the features you use, the platform may process the following categories of information:",
            "Account information: first name, last name, email address, account identifier, and information needed to manage your account.",
            "Authentication and security information: authentication tokens or related session information, account role, and information necessary to verify access permissions.",
            "Saved content: references to historical quotations, figures, and events that you choose to save to your account.",
            "Learning activity: quiz attempts, answers, scores, completion status, and related progress information.",
            "Game activity: game sessions, challenge attempts, scores, answers, completion status, and other progress information where the relevant game feature records it.",
            "Notifications: notification content, delivery-related information, and whether a notification has been marked as read.",
            "User-submitted content: testimonials or other information you voluntarily submit through available features.",
            "Technical and security information: limited request, diagnostic, or error information may be processed by the application or its infrastructure when necessary for operation and security. The exact information collected depends on the services configured.",
            "We aim to limit the collection of personal information to what is necessary for the relevant feature and its stated purpose.",
        ],
    },
    {
        id: 4,
        title: "4. How Information Is Collected",
        content: [
            "Information may be provided directly when you create or update an account, submit a testimonial, or interact with a feature that records progress.",
            "Some information is generated through normal use of the platform, such as quiz results, saved items, game progress, or notification status.",
            "Technical information may also be processed automatically by the application, hosting provider, database provider, or other infrastructure services, depending on their configuration.",
        ],
    },
    {
        id: 5,
        title: "5. Why We Use Your Information",
        content: [
            "Information may be processed to:",
            "• Create, authenticate, and manage user accounts.",
            "• Protect accounts and restrict administrative functions to authorized users.",
            "• Save and retrieve users' favorite historical quotations, figures, and events.",
            "• Record quiz results, game sessions, challenge progress, and learning achievements where supported.",
            "• Create and display notifications related to accounts, learning activity, or platform events.",
            "• Receive, manage, and, where applicable, publish testimonials.",
            "• Maintain, troubleshoot, and improve the reliability of the platform.",
            "• Detect misuse, investigate security incidents, and protect the rights and safety of users.",
            "• Respond to privacy requests and comply with applicable legal obligations.",
        ],
    },
    {
        id: 6,
        title: "6. Legal Grounds for Processing",
        content: [
            "The applicable legal basis depends on the processing activity and the laws governing the platform.",
            "Depending on the circumstances, processing may be necessary to provide a feature requested by the user, operate and secure the service, comply with a legal obligation, or pursue another lawful purpose recognized by applicable law.",
            "Where consent is legally required, it should be obtained before the relevant processing begins. Consent-based processing should not be described as consent-based unless the necessary consent mechanism is actually implemented.",
            "The operator should document the appropriate legal basis for each significant category of processing.",
        ],
    },
    {
        id: 7,
        title: "7. Account Security and Authentication",
        content: [
            "The platform uses authentication and authorization mechanisms to control access to user and administrative features.",
            "Access tokens and account information should be handled securely and must not be disclosed to unauthorized persons.",
            "Users should protect their account credentials and notify the platform if they suspect unauthorized access.",
            "No online service can guarantee absolute security. Appropriate technical and organizational safeguards should be reviewed and maintained as the platform develops.",
        ],
    },
    {
        id: 8,
        title: "8. Historical Content, Favorites, Quizzes, and Games",
        content: [
            "Public historical content, such as biographies, eras, events, and quotations, is distinct from personal information associated with an individual account.",
            "When you save content, the platform may retain references to the selected items so that your saved collection can be retrieved later.",
            "When you participate in quizzes or games, the platform may record your answers, scores, progress, and completion status to provide results and support learning features.",
            "These records should be accessible only to the extent necessary for the feature, account permissions, and legitimate administrative operations.",
        ],
    },
    {
        id: 9,
        title: "9. Testimonials and Public Contributions",
        content: [
            "If you submit a testimonial, the information you provide may be stored so that the platform can review and manage your submission.",
            "A testimonial may be displayed publicly when the feature is enabled and the submission has been approved for publication under the platform's practices.",
            "Before publication, users should be informed about which information will be displayed and whether their name or other identifying details will appear.",
            "Please do not submit confidential information or unnecessary personal details about yourself or other people.",
            "If you wish to request the removal or correction of a published testimonial, contact the platform using the available contact details. Requests will be assessed under applicable law and the platform's legitimate obligations.",
        ],
    },
    {
        id: 10,
        title: "10. Sharing and Service Providers",
        content: [
            "Personal information may be accessible to authorized personnel responsible for operating and administering the platform.",
            "Information may also be processed by technical service providers where necessary to operate the application, database, authentication, file storage, hosting, or related infrastructure.",
            "The specific providers, their locations, the information they process, and any international transfers should be documented according to the services actually configured for production.",
            "Personal information should not be sold to third parties for their independent marketing purposes unless a different practice is explicitly disclosed and lawfully permitted.",
            "Information may also be disclosed when required by law or when necessary to address a legitimate security or legal matter, subject to applicable requirements.",
        ],
    },
    {
        id: 11,
        title: "11. Data Retention",
        content: [
            "Personal information should be retained only for as long as necessary for the purpose for which it was collected, subject to applicable legal obligations and legitimate recordkeeping requirements.",
            "Account information may be retained while an account remains active and for an appropriate period afterward where necessary.",
            "Saved items, quiz attempts, game records, and notifications may be retained according to the functionality offered and the user's account status.",
            "Security logs and technical records, where collected, should have an appropriate retention period based on security, operational, and legal requirements.",
            "The platform should establish specific retention periods for each category of information and delete or anonymize information when it is no longer needed, unless retention is legally required.",
        ],
    },
    {
        id: 12,
        title: "12. Cookies, Tokens, and Similar Technologies",
        content: [
            "The application uses authentication mechanisms to identify authenticated users and control access to protected features.",
            "Depending on the frontend implementation, authentication information may be stored or transmitted using browser storage, cookies, or authorization headers. The actual implementation should be reflected accurately in this policy.",
            "Hosting providers and other integrated services may also use technical cookies or similar technologies, depending on their configuration.",
            "Any analytics, advertising, or non-essential tracking technologies should be disclosed separately when applicable, and the necessary consent choices should be provided where required by law.",
            "Users can manage certain browser storage and cookie settings through their browser, although disabling essential technologies may affect the operation of some features.",
        ],
    },
    {
        id: 13,
        title: "13. Your Privacy Rights",
        content: [
            "Depending on the laws applicable to your situation, you may have rights concerning your personal information, including rights to access, correct, update, or request the deletion of certain information.",
            "You may also have rights to object to certain processing, request restrictions, withdraw consent where processing relies on consent, or submit a complaint to the competent authority, where these rights are provided by applicable law.",
            "These rights are subject to applicable legal conditions and exceptions. Not every request can necessarily be fulfilled in every circumstance.",
            ...(email
                ? [`To submit a privacy request, contact ${email} and describe the request clearly. We may need to verify your identity before disclosing or changing personal information.`]
                : ["A dedicated privacy contact email should be configured so users can submit requests and receive responses."]),
        ],
    },
    {
        id: 14,
        title: "14. Children's Privacy",
        content: [
            "The platform is educational in nature, but its intended age range and any age-related restrictions should be stated clearly by the operator.",
            "If the platform is directed to children or knowingly processes children's personal information, additional safeguards, notices, and consent requirements may apply under the relevant law.",
            "The operator should establish an appropriate procedure for handling concerns involving a child's personal information.",
        ],
    },
    {
        id: 15,
        title: "15. External Links and Social Media",
        content: [
            "The website may contain links to social media platforms and other external websites.",
            "When you visit an external service, that service may collect information under its own privacy policy and terms. The platform does not control all data-processing activities carried out by those services.",
            "We recommend reviewing the privacy notices of third-party services before interacting with them or submitting information.",
        ],
    },
    {
        id: 16,
        title: "16. International Data Transfers",
        content: [
            "Some infrastructure or service providers may process information in countries other than the country in which the user or website operator is located.",
            "The actual locations of databases, backups, file storage, and other services should be verified before this policy is finalized.",
            "Where international transfers are subject to legal restrictions or safeguards, the operator must comply with the requirements applicable to those transfers.",
        ],
    },
    {
        id: 17,
        title: "17. Changes to This Privacy Policy",
        content: [
            "This Privacy Policy may be updated when the platform introduces new features, changes its infrastructure, modifies its data practices, or needs to reflect changes in applicable law.",
            "The publication date should be updated whenever material changes are made. Where required, users should be informed of significant changes before they take effect.",
        ],
    },
    {
        id: 18,
        title: "18. Contact Us",
        content: [
            `For questions, concerns, or requests relating to this Privacy Policy or the processing of personal information by ${siteName}, please use the contact information published below.`,
            "Please do not include passwords, authentication tokens, or other sensitive credentials in privacy-related messages.",
        ],
    },
];

const PrivacyPolicy = () => {
    const { settings, loading, error } = useSettingsContext();

    if (loading && !settings) {
        return (
            <section className="min-h-screen px-5 py-16">
                <p className="mx-auto max-w-[1000px] text-gray-600">
                    Loading privacy information...
                </p>
            </section>
        );
    }

    const siteName = settings?.name || "Ancient Wisdom";
    const sections = privacyPolicySections(siteName, settings?.email);
    const activeSocialLinks =
        settings?.socialLinks?.filter((link) => link.isActive && link.url) ?? [];

    return (
        <section className="min-h-screen flex flex-col items-center px-5 bg-[#F5F3EE]">
            <div className="w-full max-w-[1000px] py-16">
                <h1 className="text-4xl font-bold text-[#292722]">
                    Privacy Policy
                </h1>

                <p className="mt-3 text-gray-600 leading-7">
                    Learn how {siteName} handles personal information when you
                    use the platform and its educational features.
                </p>

                {settings?.slogan && (
                    <p className="mt-2 italic text-[#746B5F]">
                        {settings.slogan}
                    </p>
                )}

                {error && (
                    <p className="mt-4 text-sm text-amber-700">
                        Some website settings could not be loaded. Contact
                        details may be incomplete.
                    </p>
                )}

                <div className="mt-12 flex flex-col">
                    {sections.map((section) => (
                        <article key={section.id} className="mb-10">
                            <h2 className="mb-4 text-xl sm:text-2xl font-bold text-[#292722]">
                                {section.title}
                            </h2>

                            <div className="flex flex-col gap-3">
                                {section.content.map((paragraph, index) => (
                                    <p
                                        key={index}
                                        className="text-gray-700 leading-7 whitespace-pre-line"
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>

                <div className="border-t border-[#D8D0C4] pt-8">
                    <h2 className="mb-4 text-xl font-bold text-[#292722]">
                        Privacy Contact
                    </h2>

                    {settings?.email ? (
                        <p className="mb-3 text-gray-700 leading-7">
                            Email:{" "}
                            <a
                                href={`mailto:${settings.email}`}
                                className="underline underline-offset-4 hover:text-[#8A6B42]"
                            >
                                {settings.email}
                            </a>
                        </p>
                    ) : (
                        <p className="text-gray-600">
                            No public contact email has been configured.
                        </p>
                    )}

                    {activeSocialLinks.length > 0 && (
                        <div className="mt-5">
                            <h3 className="mb-3 font-semibold text-[#292722]">
                                Official Social Channels
                            </h3>

                            <ul className="flex flex-wrap gap-x-5 gap-y-3">
                                {activeSocialLinks.map((link) => (
                                    <li key={link._id || `${link.platform}-${link.url}`}>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="capitalize text-[#65513A] underline underline-offset-4 hover:text-[#292722]"
                                        >
                                            {link.platform === "x"
                                                ? "X"
                                                : link.platform === "github"
                                                  ? "GitHub"
                                                  : link.platform}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <p className="mt-10 text-sm text-gray-500">
                    Last reviewed: October 2026. Update this date whenever
                    this policy is substantively revised.
                </p>
            </div>
        </section>
    );
};

export default memo(PrivacyPolicy);