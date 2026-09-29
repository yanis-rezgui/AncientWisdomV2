



import mongoose from "mongoose";
import Quote from "../models/quote.model.js";
import Event from "../models/event.model.js";
import Figure from "../models/historicalFigure.model.js";
import HistoricalEra from "../models/historicalEra.model.js";





const seedDatabase = async () => {
    try {
     

        // Clear existing data
        await Quote.deleteMany({});
        await Event.deleteMany({});
        await Figure.deleteMany({});
        await HistoricalEra.deleteMany({});

        // =========================================================
        // HISTORICAL ERA
        // =========================================================

        const ancientRome = await HistoricalEra.create({
            name: "Ancient Rome",
            startYear: -753,
            endYear: 476,

            description:
                "Ancient Rome was one of the most influential civilizations in history. From its traditional foundation in 753 BCE to the fall of the Western Roman Empire in 476 CE, Rome developed from a small settlement into a vast civilization whose influence extended across Europe, North Africa, and the Mediterranean.",

            image: {
                url: "https://ancient-wisdom-ivory.vercel.app/images/rome.jpg",
                publicId: "ancient-wisdom/rome"
            }
        });

        console.log("Ancient Rome created");

        // =========================================================
        // FIGURES
        // =========================================================

        const marcusAurelius = await Figure.create({
            name: "Marcus Aurelius",

            birthDate: "April 26, 121 CE",
            birthPlace: "Rome",

            deathDate: "March 17, 180 CE",
            deathPlace: "Vindobona or Sirmium",

            eras: [ancientRome._id],

            biography: [
                {
                    title: "Early Life",
                    content:
                        "Marcus Aurelius was born on April 26, 121 CE, in Rome into a prominent and affluent family with close ties to the imperial household. His father, Marcus Annius Verus, died when Marcus was only three years old, leaving him to be raised by his mother, Domitia Lucilla, a highly educated and wealthy woman. From an early age, Marcus showed a deep interest in philosophy, simplicity, and discipline."
                },
                {
                    title: "Philosophical / Intellectual Journey",
                    content:
                        "Marcus Aurelius received an exceptional education under some of the most renowned tutors of his time, including Junius Rusticus, who introduced him to Stoic philosophy, and Herodes Atticus, a celebrated rhetorician. While he studied rhetoric and law, Marcus gravitated towards philosophy, particularly Stoicism, valuing virtue, rational thought, and inner peace over material wealth or pleasure."
                },
                {
                    title: "Rise to Prominence",
                    content:
                        "His path to power began when Emperor Hadrian recognized his talents and arranged for him to be groomed as a future ruler. Hadrian adopted Antoninus Pius on the condition that Antoninus adopt Marcus Aurelius and Lucius Verus. Marcus married Antoninus' daughter, Faustina the Younger, in 145 CE. Upon Antoninus Pius' death in 161 CE, Marcus ascended to the throne, sharing power with Lucius Verus as co-emperor."
                },
                {
                    title: "Major Achievements",
                    content:
                        "Marcus Aurelius is remembered as one of the most prominent Roman emperors and as a Stoic philosopher. His reign was marked by external wars, internal reforms, famine, and epidemic disease. He spent much of his reign dealing with military conflicts along the Danube frontier while maintaining an interest in philosophy and moral discipline."
                },
                {
                    title: "Did You Know?",
                    content:
                        "Marcus Aurelius wrote much of what became known as Meditations while on military campaigns. He did not originally intend the work for publication; it consisted largely of personal reflections and exercises in Stoic philosophy."
                },
                {
                    title: "Death & Legacy",
                    content:
                        "Marcus Aurelius died on March 17, 180 CE, during a military campaign. He was succeeded by his son Commodus. His philosophical writings, later known as Meditations, became one of the most influential surviving works of Stoic philosophy."
                }
            ],

            image: {
                url: "https://ancient-wisdom-ivory.vercel.app/images/marc2.jpg",
                publicId: "ancient-wisdom/marc2"
            },

            tags: [
                "Roman Empire",
                "Stoicism",
                "Philosophy",
                "Emperor",
                "Leadership"
            ]
        });

        const juliusCaesar = await Figure.create({
            name: "Julius Caesar",

            birthDate: "July 12 or 13, 100 BCE",
            birthPlace: "Rome",

            deathDate: "March 15, 44 BCE",
            deathPlace: "Rome",

            eras: [ancientRome._id],

            biography: [
                {
                    title: "Early Life",
                    content:
                        "Gaius Julius Caesar was born in 100 BCE into the prestigious Julian clan in Rome, a family that claimed descent from Venus. His father was a praetor and his mother, Aurelia Cotta, came from an influential Roman family. Caesar grew up during a period of intense political instability in the late Roman Republic."
                },
                {
                    title: "Philosophical / Intellectual Journey",
                    content:
                        "Caesar received a traditional Roman education focused on rhetoric, law, and military skills. He became known for his exceptional oratory abilities and developed a strong interest in military leadership and political affairs. His writings, including Commentarii de Bello Gallico, demonstrate his ability to combine military reporting with political communication."
                },
                {
                    title: "Rise to Prominence",
                    content:
                        "Caesar's political rise was shaped by alliances and military success. In 60 BCE, he formed the First Triumvirate with Pompey and Crassus. As governor of Gaul from 58 to 50 BCE, he conducted a series of campaigns that greatly expanded Roman territory and increased his own political influence."
                },
                {
                    title: "Major Achievements",
                    content:
                        "Caesar's conquest of Gaul brought him enormous military prestige. In 49 BCE, he crossed the Rubicon, beginning a civil war against Pompey. After his victory, Caesar became dictator and introduced several political, administrative, and calendar reforms, including the Julian calendar."
                },
                {
                    title: "Did You Know?",
                    content:
                        "Caesar was famously kidnapped by pirates when he was young. According to ancient accounts, he joked that the ransom demanded for him was too low and later ordered the pirates to be executed after his release."
                },
                {
                    title: "Death & Legacy",
                    content:
                        "Julius Caesar was assassinated on March 15, 44 BCE, by a group of senators including Brutus and Cassius. His assassination triggered another series of civil wars that ultimately led to the rise of Augustus and the transformation of the Roman Republic into the Roman Empire."
                }
            ],

            image: {
                url: "https://ancient-wisdom-ivory.vercel.app/images/ceasar.jpg",
                publicId: "ancient-wisdom/ceasar"
            },

            tags: [
                "Roman Republic",
                "Military",
                "Politics",
                "Gaul",
                "Dictator"
            ]
        });

        const augustus = await Figure.create({
            name: "Augustus",

            birthDate: "September 23, 63 BCE",
            birthPlace: "Rome",

            deathDate: "August 19, 14 CE",
            deathPlace: "Nola",

            eras: [ancientRome._id],

            biography: [
                {
                    title: "Early Life",
                    content:
                        "Gaius Octavius, later known as Augustus, was born on September 23, 63 BCE. He belonged to the equestrian class and was the great-nephew and adopted son of Julius Caesar. After his father's death when he was young, he was raised primarily by his mother Atia and received an education in rhetoric, philosophy, and military affairs."
                },
                {
                    title: "Philosophical / Intellectual Journey",
                    content:
                        "Octavian was influenced by traditional Roman values such as discipline, duty, and respect for Roman political traditions. At the same time, he developed a highly pragmatic approach to politics and understood the importance of adapting republican institutions to the new political reality."
                },
                {
                    title: "Rise to Prominence",
                    content:
                        "After Caesar's assassination in 44 BCE, Octavian emerged as Caesar's adopted heir. He formed the Second Triumvirate with Mark Antony and Lepidus. After defeating Caesar's assassins and later defeating Antony at the Battle of Actium in 31 BCE, Octavian became the dominant political figure in Rome. In 27 BCE, the Senate granted him the title Augustus."
                },
                {
                    title: "Major Achievements",
                    content:
                        "Augustus established the Principate, reorganized the Roman military and administration, improved infrastructure, promoted literature and the arts, and initiated extensive building programs. His reign began a long period of relative political stability commonly associated with the Pax Romana."
                },
                {
                    title: "Did You Know?",
                    content:
                        "Augustus carefully maintained the appearance of traditional republican government while holding the most important political powers. He also became an important patron of Roman poets and writers, including Virgil and Horace."
                },
                {
                    title: "Death & Legacy",
                    content:
                        "Augustus died on August 19, 14 CE, after more than four decades as Rome's dominant political figure. He was succeeded by Tiberius. His reign established many of the political structures that would shape the Roman Empire for centuries."
                }
            ],

            image: {
                url: "https://ancient-wisdom-ivory.vercel.app/images/augustus.jpg",
                publicId: "ancient-wisdom/augustus"
            },

            tags: [
                "Roman Empire",
                "Emperor",
                "Politics",
                "Pax Romana",
                "Leadership"
            ]
        });

        console.log("Figures created");

        // =========================================================
        // QUOTES
        // =========================================================

        await Quote.insertMany([
            {
                text: "The universe is change; our life is what our thoughts make it.",

                author: marcusAurelius._id,

                era: ancientRome._id,

                source: "Meditations",

                image: {
                    url: "https://ancient-wisdom-ivory.vercel.app/images/marc2.jpg",
                    publicId: "ancient-wisdom/marc2"
                },

                tags: [
                    "Stoicism",
                    "Change",
                    "Thoughts",
                    "Philosophy"
                ]
            },

            {
                text: "Dwell on the beauty of life. Watch the stars, and see yourself running with them.",

                author: marcusAurelius._id,

                era: ancientRome._id,

                source: "Meditations",

                image: {
                    url: "https://ancient-wisdom-ivory.vercel.app/images/marc2.jpg",
                    publicId: "ancient-wisdom/marc2"
                },

                tags: [
                    "Stoicism",
                    "Life",
                    "Nature",
                    "Philosophy"
                ]
            },

            {
                text: "The happiness of your life depends upon the quality of your thoughts.",

                author: marcusAurelius._id,

                era: ancientRome._id,

                source: "Meditations",

                image: {
                    url: "https://ancient-wisdom-ivory.vercel.app/images/marc2.jpg",
                    publicId: "ancient-wisdom/marc2"
                },

                tags: [
                    "Stoicism",
                    "Happiness",
                    "Thoughts",
                    "Philosophy"
                ]
            },

            {
                text: "He who wishes to be obeyed must know how to command.",

                author: augustus._id,

                era: ancientRome._id,

                source: "Attributed",

                image: {
                    url: "https://ancient-wisdom-ivory.vercel.app/images/augustus.jpg",
                    publicId: "ancient-wisdom/augustus"
                },

                tags: [
                    "Leadership",
                    "Power",
                    "Command"
                ]
            },

            {
                text: "I love the name of honor, more than I fear death.",

                author: juliusCaesar._id,

                era: ancientRome._id,

                source: "Attributed",

                image: {
                    url: "https://ancient-wisdom-ivory.vercel.app/images/ceasar.jpg",
                    publicId: "ancient-wisdom/ceasar"
                },

                tags: [
                    "Honor",
                    "Courage",
                    "Death",
                    "Leadership"
                ]
            }
        ]);

        // =========================================================
        // EVENTS
        // =========================================================

        await Event.insertMany([
            {
                name: "Assassination of Julius Caesar",

                startDate: "March 15, 44 BCE",
                endDate: "March 15, 44 BCE",

                location: "Rome",

                era: ancientRome._id,

                description:
                    "Julius Caesar was assassinated on the Ides of March in 44 BCE by a group of Roman senators who opposed his growing concentration of power.",

                sections: [
                    {
                        title: "Background",
                        content:
                            "Caesar had accumulated unprecedented political power after winning the civil war against Pompey. He was appointed dictator perpetuo, creating fears among some senators that the Roman Republic was being replaced by permanent personal rule."
                    },
                    {
                        title: "The Assassination",
                        content:
                            "On March 15, 44 BCE, Caesar attended a meeting of the Senate at the Theatre of Pompey. A group of conspirators attacked and killed him. Ancient sources associate approximately sixty senators with the conspiracy."
                    },
                    {
                        title: "Consequences",
                        content:
                            "Caesar's assassination did not restore the Republic. Instead, it triggered another series of civil wars that eventually resulted in Octavian becoming the dominant political figure in Rome."
                    }
                ],

                tags: [
                    "Julius Caesar",
                    "Roman Republic",
                    "Civil War",
                    "Politics"
                ]
            },

            {
                name: "Battle of Actium",

                startDate: "September 2, 31 BCE",
                endDate: "September 2, 31 BCE",

                location: "Actium, Greece",

                era: ancientRome._id,

                description:
                    "The Battle of Actium was a decisive naval confrontation between the forces of Octavian and the combined forces of Mark Antony and Cleopatra VII.",

                sections: [
                    {
                        title: "Background",
                        content:
                            "Political rivalry between Octavian and Mark Antony intensified after the collapse of the Second Triumvirate. Antony's alliance with Cleopatra contributed to the final confrontation."
                    },
                    {
                        title: "The Battle",
                        content:
                            "The fleets commanded by Octavian and Antony met near Actium on the western coast of Greece. Octavian's forces achieved a decisive victory."
                    },
                    {
                        title: "Consequences",
                        content:
                            "The victory left Octavian as the dominant political power in the Roman world. Antony and Cleopatra later died in Egypt, and Octavian returned to Rome as the undisputed leader."
                    }
                ],

                tags: [
                    "Augustus",
                    "Octavian",
                    "Mark Antony",
                    "Cleopatra",
                    "Roman Empire"
                ]
            }
        ]);

        console.log("Events created");

        console.log("Ancient Rome seed completed successfully.");

        await mongoose.disconnect();

    } catch (error) {
        console.error("Seed failed:", error);
        await mongoose.disconnect();
        process.exit(1);
    }
};

export default seedDatabase;