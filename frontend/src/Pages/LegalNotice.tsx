import { memo } from "react";
import { useSettingsContext } from "../Contexts/SettingsContext";

const legalNoticeSections = (siteName: string) => [
    {
        id: 1,
        title: "1. Website Publisher",
        content: [
            `This website, known as ${siteName}, is an educational platform dedicated to history, historical figures, civilizations, cultural heritage, and interactive learning.`,
            `The website is operated under the name ${siteName}. Any legal business name, registration number, or official business address should be added here if applicable and verified.`,
        ],
    },
    {
        id: 2,
        title: "2. Contact Information",
        content: [
            `For questions concerning the website, its content, or its operation, please contact us using the email address published in the website settings.`,
            "The social media accounts listed on this page are additional communication channels. Their availability depends on the links configured by the website administrator.",
        ],
    },
    {
        id: 3,
        title: "3. Purpose of the Website",
        content: [
            `${siteName} aims to make historical knowledge accessible through educational articles, historical eras, biographies, significant events, quotations, books, monuments, maps, films, quizzes, and interactive historical games.`,
            "The platform is intended for educational, informational, and cultural purposes. It encourages users to explore the past, develop their historical knowledge, and discover the connections between civilizations.",
            "Unless expressly stated otherwise, the website does not constitute professional, legal, financial, or other specialized advice.",
        ],
    },
    {
        id: 4,
        title: "4. Accuracy and Historical Sources",
        content: [
            "We aim to present historical information in a clear, responsible, and informative manner. Historical interpretations may differ between researchers, sources, and academic traditions.",
            "Dates, quotations, translations, attributions, and historical interpretations should be assessed in light of the available evidence and cited sources.",
            "Although reasonable efforts may be made to maintain accurate and up-to-date content, we cannot guarantee that every statement is complete, error-free, or free from scholarly disagreement.",
            "Users conducting academic research should consult reliable primary sources, scholarly publications, and other authoritative references before relying on information published on this platform.",
        ],
    },
    {
        id: 5,
        title: "5. Intellectual Property",
        content: [
            `Unless otherwise indicated, original website elements, including its design, original text, branding, graphics, and software, may be protected by applicable intellectual property laws.`,
            "No content may be reproduced, republished, redistributed, modified, or commercially exploited without the required permission, unless an applicable legal exception or licence permits it.",
            "Historical facts and ideas are not necessarily protected in the same way as original written expression, illustrations, photographs, software, or other creative works.",
            "Third-party photographs, illustrations, quotations, trademarks, and other materials remain subject to the rights and licences of their respective owners. Their presence on this website does not imply ownership by the platform.",
            "If you believe that content published on this website infringes your rights, please contact us with the relevant URL, an explanation of the concern, and sufficient information to assess the request.",
        ],
    },
    {
        id: 6,
        title: "6. User Accounts and Acceptable Use",
        content: [
            "Certain features may require a user account, including saved content, quizzes, game progress, and account-related notifications.",
            "Users are responsible for providing accurate account information, keeping their credentials confidential, and notifying the platform of suspected unauthorized account access.",
            "Users must not attempt to gain unauthorized access to the website, interfere with its operation, bypass access controls, introduce malicious code, or exploit technical vulnerabilities.",
            "Users must not use the platform to distribute unlawful material, violate the rights of others, abuse other users, or interfere with the educational experience.",
            "Access to features may be restricted when necessary to protect the platform, its users, or its legitimate operations, subject to applicable law.",
        ],
    },
    {
        id: 7,
        title: "7. User-Submitted Content",
        content: [
            "Where the website permits users to submit testimonials or other content, users are responsible for ensuring that their submissions are truthful, lawful, and respectful of third-party rights.",
            "A testimonial or other submission may be displayed publicly only where the platform's applicable functionality and publication practices permit it.",
            "Users should not include sensitive personal information, confidential information, or information about another person without an appropriate basis for sharing it.",
            "The platform may review, moderate, restrict, or remove submissions that violate applicable rules or the rights of others.",
            "Submitting content does not automatically transfer ownership of that content to the platform. Any licence required to display or operate user-submitted content should be explained in the relevant terms presented to users.",
        ],
    },
    {
        id: 8,
        title: "8. Third-Party Services and External Links",
        content: [
            "The website may rely on third-party infrastructure and services to support hosting, database operations, authentication, file storage, or other technical functions.",
            "The website may also link to external websites, social media platforms, educational resources, or other third-party services.",
            "External services operate under their own terms and privacy policies. We do not control all aspects of their availability, content, security, or data-processing practices.",
            "Links to third-party resources are provided for convenience or educational purposes and do not necessarily constitute an endorsement of their content.",
        ],
    },
    {
        id: 9,
        title: "9. Website Availability and Liability",
        content: [
            "We aim to keep the website functional and accessible, but uninterrupted availability cannot be guaranteed.",
            "Access may occasionally be interrupted by maintenance, technical failures, infrastructure issues, security incidents, or circumstances beyond our reasonable control.",
            "To the extent permitted by applicable law, the platform disclaims liability for losses arising from reliance on inaccurate or incomplete information, temporary unavailability, or third-party services.",
            "Nothing in this notice excludes or limits liability where such exclusion or limitation is prohibited by applicable law.",
        ],
    },
    {
        id: 10,
        title: "10. Privacy and Personal Data",
        content: [
            "The processing of personal data in connection with the website is described in the Privacy Policy published on this platform.",
            "Users should review that policy to understand what information may be collected, why it is processed, how it is protected, and how applicable privacy rights may be exercised.",
        ],
    },
    {
        id: 11,
        title: "11. Applicable Law",
        content: [
            "These notices should be interpreted in accordance with the laws applicable to the website's actual operator and activities.",
            "If the platform is operated from Algeria, Algerian law may be relevant. The final applicable-law clause should be confirmed against the operator's actual legal status and the circumstances of the service.",
            "Nothing in this notice deprives users of mandatory rights granted by applicable law.",
        ],
    },
    {
        id: 12,
        title: "12. Changes to This Notice",
        content: [
            "This Legal Notice may be updated to reflect changes to the website, its features, its operator, or applicable legal requirements.",
            "The latest version published on this page is the version users should consult. Material changes should be dated and communicated where required.",
        ],
    },
];

const LegalNotice = () => {
    const { settings, loading, error } = useSettingsContext();

    if (loading && !settings) {
        return (
            <section className="min-h-screen px-5 py-16">
                <p className="mx-auto max-w-[1000px] text-gray-600">
                    Loading legal information...
                </p>
            </section>
        );
    }

    const siteName = settings?.name || "Ancient Wisdom";
    const sections = legalNoticeSections(siteName);
    const activeSocialLinks =
        settings?.socialLinks?.filter((link) => link.isActive && link.url) ?? [];

    return (
        <section className="min-h-screen flex flex-col items-center px-5 bg-[#F5F3EE]">
            <div className="w-full max-w-[1000px] py-16">
                <h1 className="text-4xl font-bold text-[#292722]">
                    Legal Notice
                </h1>

                <p className="mt-3 text-gray-600 leading-7">
                    Legal information concerning {siteName}, its educational
                    content, and the use of this website.
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
                        Contact and Official Social Channels
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
                        <p className="mb-3 text-gray-600">
                            No public contact email has been configured.
                        </p>
                    )}

                    {activeSocialLinks.length > 0 ? (
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
                    ) : (
                        <p className="text-gray-600">
                            No active social media links are currently configured.
                        </p>
                    )}
                </div>

                <p className="mt-10 text-sm text-gray-500">
                    Last reviewed: October 2026. Update this date whenever
                    this notice is substantively revised.
                </p>
            </div>
        </section>
    );
};

export default memo(LegalNotice);