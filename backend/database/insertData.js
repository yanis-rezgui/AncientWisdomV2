import mongoose from "mongoose";

import HistoricalEra from "../models/historicalEra.model.js";

const seedDatabase = async () => {
    try {

        // =========================================================
        // HISTORICAL ERA - UPDATE EXISTING DOCUMENTS
        // =========================================================

        await HistoricalEra.findOneAndUpdate(
            { name: "Ancient Egypt" },
            {
                $set: {
                    sections: [
                        {
                            title: "The Rise of Egyptian Civilization",
                            content:
                                "Ancient Egyptian civilization emerged along the Nile River around 3100 BCE, when Upper and Lower Egypt were traditionally unified under a single ruler. The Nile provided fertile land, reliable water, and a natural transportation route through an otherwise arid landscape. This environment allowed agricultural communities to grow into towns and eventually into a highly centralized kingdom. The pharaoh stood at the center of this political system, combining royal authority with a sacred role in maintaining order throughout the land."
                        },
                        {
                            title: "Pharaohs and Government",
                            content:
                                "Egyptian society was organized around a powerful centralized state headed by the pharaoh. The king was regarded as both a political ruler and a divine or semi-divine figure responsible for maintaining maat, the principle of cosmic and social order. Beneath the pharaoh stood administrators, priests, military officers, scribes, and local officials who managed taxation, agriculture, construction, and law. This administrative structure allowed Egypt to govern a large territory for remarkably long periods despite occasional political fragmentation."
                        },
                        {
                            title: "Religion and the Afterlife",
                            content:
                                "Religion shaped almost every aspect of ancient Egyptian life. Egyptians worshipped a large pantheon of gods and goddesses, including Ra, Osiris, Isis, Horus, and Anubis. They believed that death was a transition into another existence and that the preservation of the body was important for the journey into the afterlife. Elaborate burial practices, funerary texts, tombs, and monuments developed from these beliefs. The concept of maat also connected religion with morality, political authority, and the stability of society."
                        },
                        {
                            title: "Writing, Knowledge and Architecture",
                            content:
                                "The Egyptians developed hieroglyphic writing and used it for religious inscriptions, monuments, administration, and recording important events. Scribes occupied an influential position because literacy was limited to a relatively small part of the population. Egyptian scholars also developed practical knowledge of mathematics, medicine, astronomy, and engineering. Monumental architecture became one of the civilization's defining achievements, from the pyramids of Giza and the temples of Karnak to elaborate royal tombs in the Valley of the Kings."
                        },
                        {
                            title: "The Legacy of Ancient Egypt",
                            content:
                                "Ancient Egypt survived for more than three millennia, experiencing periods of prosperity, fragmentation, foreign rule, and reunification. Its civilization eventually came under Persian, Macedonian, and Roman control, with Egypt becoming a Roman province after the defeat of Cleopatra VII and Mark Antony in 30 BCE. Egyptian religious traditions, artistic conventions, writing, architecture, and scientific knowledge continued to influence later cultures. Its monuments and surviving texts remain among the most important sources for understanding the ancient world."
                        }
                    ]
                }
            },
            { new: true }
        );


        await HistoricalEra.findOneAndUpdate(
            { name: "Classical Greece" },
            {
                $set: {
                    sections: [
                        {
                            title: "The World of the Greek City-States",
                            content:
                                "Classical Greece was not a single unified kingdom but a collection of independent city-states known as poleis. Athens, Sparta, Corinth, Thebes, and many others developed their own political institutions, laws, traditions, and military systems. Although the Greeks shared language, religion, mythology, and cultural traditions, rivalry between city-states was common. Their geographical environment, characterized by mountains and islands, contributed to political fragmentation while encouraging maritime trade and colonization."
                        },
                        {
                            title: "Athens and the Development of Democracy",
                            content:
                                "Athens developed one of the ancient world's most influential experiments in direct democracy. Citizens could participate in the Assembly, vote on important decisions, and serve in certain political institutions. However, Athenian democracy was highly limited by modern standards: women, enslaved people, and foreigners were excluded from citizenship. Despite these limitations, Athenian political institutions introduced ideas about civic participation and government that later societies would study and reinterpret."
                        },
                        {
                            title: "Sparta and Military Society",
                            content:
                                "Sparta developed a very different political and social system. Spartan society placed enormous importance on military discipline, collective identity, and obedience to the state. Male citizens underwent extensive military training from a young age, while the population of enslaved helots supported the agricultural economy. Sparta became one of the most powerful military states in Greece and frequently competed with Athens for influence over the Greek world."
                        },
                        {
                            title: "Philosophy, Science and the Arts",
                            content:
                                "Classical Greece produced some of history's most influential philosophers and thinkers. Socrates explored ethics and questioned assumptions through dialogue, Plato developed philosophical ideas concerning knowledge and political order, and Aristotle studied subjects ranging from logic and biology to politics and metaphysics. Greek artists and architects also established influential traditions of proportion, sculpture, drama, and monumental architecture. These intellectual and artistic achievements became fundamental elements of later Western thought."
                        },
                        {
                            title: "War, Macedonia and the End of the Classical Age",
                            content:
                                "The Greek city-states experienced major conflicts including the Persian Wars and the Peloponnesian War between Athens and Sparta. Continued rivalry weakened the political independence of many Greek states and created opportunities for the rise of Macedon under Philip II. His son Alexander the Great later conquered the Persian Empire and created a vast realm stretching from Greece to parts of Central and South Asia. Alexander's campaigns marked the transition from the Classical period into the Hellenistic age."
                        }
                    ]
                }
            },
            { new: true }
        );


        await HistoricalEra.findOneAndUpdate(
            { name: "Ancient Rome" },
            {
                $set: {
                    sections: [
                        {
                            title: "From Village to Republic",
                            content:
                                "According to Roman tradition, Rome was founded in 753 BCE, although the city's development was the result of a much longer process of settlement and political organization. Rome was initially ruled by kings before the traditional establishment of the Republic in 509 BCE. During the Republican period, political institutions such as the Senate, magistracies, and popular assemblies developed alongside intense struggles between patricians and plebeians. Rome gradually transformed from a regional power into a dominant force in Italy."
                        },
                        {
                            title: "The Expansion of Roman Power",
                            content:
                                "Roman expansion accelerated through a combination of military organization, alliances, political integration, and infrastructure. Rome defeated rival powers in Italy and later fought major conflicts against Carthage during the Punic Wars. Victories in the Mediterranean brought Rome enormous territories, wealth, and political influence. By the first century BCE, Roman power extended across much of the Mediterranean world, but expansion also produced social inequality, political tensions, and conflicts between powerful military leaders."
                        },
                        {
                            title: "The Roman Republic and Its Crisis",
                            content:
                                "The final centuries of the Republic were marked by political instability, economic inequality, civil wars, and the growing influence of military commanders. Figures such as Julius Caesar accumulated unprecedented political and military power. Caesar's assassination in 44 BCE failed to restore the old political order and was followed by another series of civil wars. Octavian, later known as Augustus, eventually defeated his rivals and established a new political system that became the Roman Empire."
                        },
                        {
                            title: "Life in the Roman Empire",
                            content:
                                "Roman society was highly diverse and included senators, equestrians, merchants, soldiers, farmers, freed people, and enslaved people. Roman cities were connected by extensive roads, ports, aqueducts, and administrative networks. Public spaces such as forums, baths, theatres, and amphitheatres played important social roles. Roman law, citizenship, taxation, and military service helped integrate populations across a vast territory while local cultures and traditions continued to shape everyday life."
                        },
                        {
                            title: "Culture, Engineering and Legacy",
                            content:
                                "Roman civilization combined elements of Roman, Greek, and many regional cultures. Roman engineers constructed roads, bridges, aqueducts, temples, amphitheatres, and monumental public buildings on an extraordinary scale. Latin became an important language of administration and later influenced many European languages. Roman law, political concepts, architecture, engineering, literature, and Christianity all contributed to the long-term development of Europe and the Mediterranean world. The Western Roman Empire eventually collapsed in 476 CE, but Roman institutions and cultural traditions continued in many forms."
                        }
                    ]
                }
            },
            { new: true }
        );


        await HistoricalEra.findOneAndUpdate(
            { name: "Middle Ages" },
            {
                $set: {
                    sections: [
                        {
                            title: "A Changing World After Rome",
                            content:
                                "The traditional date of 476 CE marks the deposition of the last western Roman emperor, but the transformation of Europe was gradual rather than sudden. Former Roman territories were reorganized into different kingdoms and political communities. The Eastern Roman Empire, later known as the Byzantine Empire, continued to exist for nearly another thousand years. Across Europe and the Mediterranean, Roman institutions interacted with Germanic traditions, Christianity, and other cultural influences to create new political and social structures."
                        },
                        {
                            title: "Kings, Lords and Feudal Society",
                            content:
                                "Medieval political systems varied considerably across regions, but many societies were organized around relationships between rulers, nobles, warriors, peasants, and religious institutions. Land was an important source of wealth and political power. In parts of Western Europe, feudal relationships developed between lords and vassals, while manorial systems organized agricultural production. Monarchies gradually strengthened their institutions, but political authority remained divided among kings, nobles, cities, and religious authorities."
                        },
                        {
                            title: "Religion and Medieval Culture",
                            content:
                                "Religion was deeply integrated into medieval political and social life. Christianity shaped Western and Eastern Europe, while Islam became a major intellectual, political, and cultural force across the Middle East, North Africa, Iberia, and parts of Asia. Jewish communities also played important roles in many medieval societies. Monasteries, mosques, churches, and religious schools became important centers of learning, preserving manuscripts and contributing to philosophy, theology, science, and literature."
                        },
                        {
                            title: "Cities, Trade and Knowledge",
                            content:
                                "From around the eleventh century, many parts of Europe experienced population growth, expanding agriculture, renewed long-distance trade, and the growth of towns and cities. Merchants connected European markets with the Mediterranean and wider Eurasian trade networks. Universities emerged in cities such as Bologna, Paris, and Oxford, creating new institutions for organized scholarship. At the same time, knowledge circulated between Christian, Muslim, and Jewish scholars, contributing to developments in mathematics, medicine, astronomy, and philosophy."
                        },
                        {
                            title: "The Late Middle Ages",
                            content:
                                "The later medieval period was marked by both crisis and transformation. Wars, political conflicts, famine, and the Black Death caused enormous disruption during the fourteenth century. Yet the period also witnessed the strengthening of states, the growth of commerce, technological developments, and cultural changes. The capture of Constantinople by the Ottoman Empire in 1453 is traditionally used as one endpoint of the Middle Ages, although the transition toward the early modern world occurred gradually and differently across regions."
                        }
                    ]
                }
            },
            { new: true }
        );

        console.log("Historical eras updated successfully");

    } catch (error) {
        console.error("Seed failed:", error);

        await mongoose.disconnect();

        process.exit(1);
    }
};

export default seedDatabase;