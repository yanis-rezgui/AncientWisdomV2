import mongoose from "mongoose";

import HistoricalEra from "../models/historicalEra.model.js";
import HistoricalFigure from "../models/historicalFigure.model.js";


/* ============================================================
   GET ERA IDS
============================================================ */

const getEraIds = async (eraNames) => {
    const eras = await HistoricalEra.find({
        name: { $in: eraNames }
    }).select("_id name");

    const eraMap = new Map(
        eras.map((era) => [era.name, era._id])
    );

    const missingEras = eraNames.filter(
        (name) => !eraMap.has(name)
    );

    if (missingEras.length > 0) {
        throw new Error(
            `Missing eras: ${missingEras.join(", ")}`
        );
    }

    return eraNames.map(
        (name) => eraMap.get(name)
    );
};


/* ============================================================
   SEED HISTORICAL FIGURES
============================================================ */

const seedFigures = async () => {

    try {

        /*
         * ======================================================
         * ERA IDS
         * ======================================================
         *
         * On récupère les ObjectId directement depuis MongoDB
         * à partir du nom des ères.
         */

        const classicalGreece = await getEraIds([
            "Classical Greece"
        ]);

        const ancientRome = await getEraIds([
            "Ancient Rome"
        ]);

        const imperialChina = await getEraIds([
            "Imperial China"
        ]);

        const mongolEmpire = await getEraIds([
            "Mongol Empire"
        ]);

        const ancientNumidia = await getEraIds([
            "Ancient Numidia and Berber Kingdoms"
        ]);

        const ageOfExploration = await getEraIds([
            "Age of Exploration"
        ]);

        const modernEra = await getEraIds([
            "Modern Era"
        ]);


        /* ======================================================
           NAPOLEON BONAPARTE
        ====================================================== */

        await HistoricalFigure.findOneAndUpdate(
            { name: "Napoleon Bonaparte" },
            {
                name: "Napoleon Bonaparte",

                birthDate: "August 15, 1769",
                deathDate: "May 5, 1821",

                birthPlace: "Ajaccio, Corsica",
                deathPlace: "Longwood, Saint Helena",

                eras: modernEra,

                tags: [
                    "Napoleon",
                    "France",
                    "French Revolution",
                    "Emperor",
                    "military",
                    "Europe",
                    "warfare",
                    "politics"
                ],

                biography: [
                    {
                        title: "Early Life and Rise",
                        content:
                            "Napoleon Bonaparte was born in 1769 in Ajaccio, Corsica, shortly after the island became part of France. Educated in French military schools, he developed exceptional abilities in artillery and military organization. The political instability created by the French Revolution provided opportunities for ambitious officers, and Napoleon rapidly distinguished himself through his leadership during the revolutionary wars. His victories in Italy established him as a national hero and gave him enormous political influence."
                    },
                    {
                        title: "The Rise to Power",
                        content:
                            "Napoleon returned to France as one of its most celebrated generals and took advantage of political instability within the revolutionary government. In 1799, he participated in the coup of 18 Brumaire and became First Consul. He gradually concentrated political authority in his own hands before proclaiming himself Emperor of the French in 1804. His government introduced major administrative and legal reforms, most famously the Napoleonic Code, while simultaneously building a powerful centralized state."
                    },
                    {
                        title: "The Napoleonic Wars",
                        content:
                            "Napoleon's armies dominated much of continental Europe during the early nineteenth century. Victories at Austerlitz, Jena, and Friedland demonstrated his ability to combine rapid movement, concentrated force, and battlefield coordination. He reorganized territories, created dependent states, and attempted to weaken Britain economically through the Continental System. However, continuous warfare also created powerful resistance among European populations and gradually stretched French military resources beyond their limits."
                    },
                    {
                        title: "The Russian Campaign",
                        content:
                            "Napoleon's invasion of Russia in 1812 marked a decisive turning point. Although French forces entered Moscow, the campaign became disastrous because of enormous distances, logistical difficulties, Russian resistance, and the harsh retreat. The Grande Armée suffered catastrophic losses. Napoleon's weakened position encouraged European powers to form a new coalition against France, leading eventually to his defeat and abdication in 1814."
                    },
                    {
                        title: "Waterloo and Exile",
                        content:
                            "Napoleon escaped from exile on Elba in 1815 and briefly returned to power during the period known as the Hundred Days. European powers immediately mobilized against him. At the Battle of Waterloo, British and allied forces under the Duke of Wellington, supported by Prussian forces, defeated Napoleon's army. He was subsequently exiled to the remote island of Saint Helena, where he remained until his death in 1821."
                    },
                    {
                        title: "Legacy",
                        content:
                            "Napoleon remains one of the most influential and controversial figures in European history. His military campaigns caused enormous destruction, but his administrative and legal reforms had lasting consequences. The Napoleonic Code influenced legal systems across Europe and beyond, while his wars accelerated the development of nationalism and transformed the political map of Europe. His career continues to generate debate over the relationship between military genius, political ambition, authoritarian power, and revolutionary ideals."
                    }
                ],

                image: {
                    url: "https://ancient-wisdom-ivory.vercel.app/images/napoleon.jpg",
                    publicId: "seed/napoleon"
                }
            },
            { new: true, upsert: true }
        );


        /* ======================================================
           LEONIDAS I
        ====================================================== */

        await HistoricalFigure.findOneAndUpdate(
            { name: "Leonidas I" },
            {
                name: "Leonidas I",

                birthDate: "c. 540 BC",
                deathDate: "480 BC",

                birthPlace: "Sparta, Greece",
                deathPlace: "Thermopylae, Greece",

                eras: classicalGreece,

                tags: [
                    "Leonidas",
                    "Sparta",
                    "Thermopylae",
                    "Persian Wars",
                    "military",
                    "Greek"
                ],

                biography: [
                    {
                        title: "King of Sparta",
                        content:
                            "Leonidas I was one of the kings of Sparta and belonged to the Agiad royal dynasty. Sparta was organized around an exceptionally demanding military culture in which discipline, endurance, obedience, and collective loyalty were considered essential virtues. Leonidas inherited this tradition and became king during a period when the Persian Empire was expanding toward the Greek mainland."
                    },
                    {
                        title: "The Persian Invasion",
                        content:
                            "In 480 BC, King Xerxes I launched a massive invasion of Greece. Several Greek city-states attempted to organize a common defense despite their political rivalries. Leonidas was chosen to lead a relatively small Spartan force toward the strategically important pass of Thermopylae, where the narrow terrain could reduce the Persian numerical advantage."
                    },
                    {
                        title: "The Battle of Thermopylae",
                        content:
                            "Leonidas and his Greek allies held Thermopylae against the Persian army for several days. The narrow pass allowed the defenders to use their heavily armed infantry effectively against much larger Persian forces. According to ancient accounts, a Greek named Ephialtes revealed a mountain route that allowed Persian troops to outflank the defenders."
                    },
                    {
                        title: "The Final Stand",
                        content:
                            "Once the Persian army had discovered the route around Thermopylae, Leonidas dismissed many of the allied Greek forces. He remained with the Spartans and several other contingents. The defenders were eventually surrounded and killed. Leonidas's decision became one of the most famous examples of military sacrifice in ancient history."
                    },
                    {
                        title: "Spartan Ideals",
                        content:
                            "The story of Leonidas became closely associated with Spartan ideals of courage, discipline, and loyalty to the community. Spartan society emphasized the willingness of citizens to endure hardship for the collective good. Leonidas's death therefore became more than a military event: it was remembered as an expression of the values Sparta wanted to associate with its warrior elite."
                    },
                    {
                        title: "Historical Legacy",
                        content:
                            "Although Thermopylae ended in a Persian victory, the Greek resistance continued and eventually contributed to the defeat of Xerxes's invasion. Leonidas became one of the most recognizable military figures of ancient Greece. His story has been repeatedly retold in literature, historical works, films, and popular culture, often as a symbol of resistance against overwhelming odds."
                    }
                ],

                image: {
                    url: "https://ancient-wisdom-ivory.vercel.app/images/leonidas.jpg",
                    publicId: "seed/leonidas"
                }
            },
            { new: true, upsert: true }
        );


        /* ======================================================
           ACHILLES
        ====================================================== */

        await HistoricalFigure.findOneAndUpdate(
            { name: "Achilles" },
            {
                name: "Achilles",

                birthDate: "Mythological",
                deathDate: "Mythological",

                birthPlace: "Phthia, Thessaly",
                deathPlace: "Troy",

                eras: classicalGreece,

                tags: [
                    "Achilles",
                    "Greek mythology",
                    "Trojan War",
                    "Homer",
                    "hero",
                    "warrior"
                ],

                biography: [
                    {
                        title: "The Greatest Greek Warrior",
                        content:
                            "Achilles is one of the central heroes of Greek mythology and the most prominent warrior in Homer's Iliad. He is presented as the son of Peleus, king of the Myrmidons, and Thetis, a divine sea goddess. His exceptional strength, speed, and courage made him the most formidable Greek fighter during the Trojan War."
                    },
                    {
                        title: "The Trojan War",
                        content:
                            "According to Greek tradition, Achilles joined the Greek expedition against Troy with his Myrmidon warriors. His presence was crucial to the Greek war effort, and his reputation alone inspired fear among the Trojans. However, Achilles was also characterized by an intense sense of personal honor and pride, which repeatedly brought him into conflict with Agamemnon, the leader of the Greek forces."
                    },
                    {
                        title: "The Wrath of Achilles",
                        content:
                            "The central conflict of the Iliad begins when Agamemnon takes Briseis, a captive woman awarded to Achilles. Feeling publicly dishonored, Achilles withdraws from the fighting. His absence allows the Trojans to gain the advantage and demonstrates how deeply personal honor was connected to heroic identity in the world represented by Homer."
                    },
                    {
                        title: "Patroclus",
                        content:
                            "Achilles's closest companion was Patroclus. When the Greek position became desperate, Patroclus entered battle wearing Achilles's armor in an attempt to inspire the Greeks and frighten the Trojans. He was killed by Hector, the greatest Trojan warrior. His death transformed Achilles's anger into a desire for revenge and convinced him to return to battle."
                    },
                    {
                        title: "The Death of Hector",
                        content:
                            "Achilles returned to the battlefield and confronted Hector outside the walls of Troy. He defeated and killed the Trojan prince and then dishonored his body before eventually returning it to Priam, Hector's father. The encounter represents both the destructive power of Achilles's anger and the possibility of compassion and recognition between enemies."
                    },
                    {
                        title: "The Myth of Achilles",
                        content:
                            "Later traditions expanded the story of Achilles beyond Homer's Iliad. His supposed invulnerability and the famous 'Achilles' heel' became central elements of later mythology, although the heel story does not appear in the Iliad. Achilles ultimately became an enduring symbol of heroic excellence, extraordinary strength, personal pride, and the tragic cost of glory."
                    }
                ],

                image: {
                    url: "https://ancient-wisdom-ivory.vercel.app/images/achilles.jpg",
                    publicId: "seed/achilles"
                }
            },
            { new: true, upsert: true }
        );


        /* ======================================================
           NICCOLÒ MACHIAVELLI
        ====================================================== */

        await HistoricalFigure.findOneAndUpdate(
            { name: "Niccolò Machiavelli" },
            {
                name: "Niccolò Machiavelli",

                birthDate: "May 3, 1469",
                deathDate: "June 21, 1527",

                birthPlace: "Florence, Italy",
                deathPlace: "Florence, Italy",

                eras: ageOfExploration,

                tags: [
                    "Machiavelli",
                    "Florence",
                    "politics",
                    "philosophy",
                    "political theory",
                    "The Prince",
                    "Renaissance"
                ],

                biography: [
                    {
                        title: "Life in Renaissance Florence",
                        content:
                            "Niccolò Machiavelli was born in Florence in 1469 during the Italian Renaissance. Florence was one of Europe's major centers of art, commerce, diplomacy, and political competition. Machiavelli entered public service during a period of intense rivalry between Italian states and European powers, giving him direct experience with diplomacy, warfare, and political administration."
                    },
                    {
                        title: "Diplomat and Political Observer",
                        content:
                            "Machiavelli served the Florentine Republic as a diplomat and official. His missions brought him into contact with powerful figures across Europe, including Cesare Borgia. These experiences shaped his understanding of political power. Rather than studying politics only through philosophical ideals, Machiavelli examined how rulers actually obtained, maintained, and lost authority."
                    },
                    {
                        title: "The Prince",
                        content:
                            "Machiavelli's most famous work, The Prince, examined the practical realities of political leadership. He argued that successful rulers sometimes had to act in ways that traditional morality would consider harsh or deceptive if such actions were necessary to preserve political stability. The work's provocative arguments made Machiavelli one of the most controversial political thinkers in European history."
                    },
                    {
                        title: "Virtù and Political Power",
                        content:
                            "One of Machiavelli's important concepts was virtù, a combination of political skill, courage, adaptability, and strategic ability. He contrasted this with fortuna, the unpredictable forces of circumstance and chance. For Machiavelli, successful leaders needed the ability to recognize opportunities and adapt to changing conditions rather than simply relying on fixed moral rules or good fortune."
                    },
                    {
                        title: "The Republican Machiavelli",
                        content:
                            "Although Machiavelli is often remembered primarily for The Prince, his political thought was broader. In works such as the Discourses on Livy, he explored republican government, civic participation, political institutions, and the importance of public virtue. He believed that political freedom could depend on strong institutions and citizens willing to defend their community."
                    },
                    {
                        title: "Legacy",
                        content:
                            "Machiavelli's writings had an enormous influence on political thought. The adjective 'Machiavellian' later became associated with manipulation and ruthless political behavior, although this simplified image does not capture the full complexity of his work. Modern scholars continue to study him as a foundational thinker in political science, particularly for his attempt to analyze political power realistically rather than through purely idealized principles."
                    }
                ],

                image: {
                    url: "https://ancient-wisdom-ivory.vercel.app/images/niccolo.jpg",
                    publicId: "seed/niccolo"
                }
            },
            { new: true, upsert: true }
        );


        /* ======================================================
           SOCRATES
        ====================================================== */

        await HistoricalFigure.findOneAndUpdate(
            { name: "Socrates" },
            {
                name: "Socrates",

                birthDate: "c. 470 BC",
                deathDate: "399 BC",

                birthPlace: "Athens, Greece",
                deathPlace: "Athens, Greece",

                eras: classicalGreece,

                tags: [
                    "Socrates",
                    "philosophy",
                    "Athens",
                    "Greek philosophy",
                    "ethics",
                    "Socratic method"
                ],

                biography: [
                    {
                        title: "Life in Athens",
                        content:
                            "Socrates was born in Athens around 470 BC and spent most of his life engaging with citizens in the city's public spaces. Unlike later philosophers who established formal schools, Socrates did not charge tuition and left no writings of his own. Much of what is known about him comes from later authors, especially Plato and Xenophon, making it difficult to separate the historical philosopher from the literary figure created by his students."
                    },
                    {
                        title: "The Socratic Method",
                        content:
                            "Socrates became famous for questioning people who claimed to possess knowledge. Rather than presenting long philosophical lectures, he asked a series of questions designed to reveal contradictions and assumptions. This method encouraged participants to examine what they believed they knew. The approach became known as the Socratic method and remains influential in philosophy, education, law, and critical thinking."
                    },
                    {
                        title: "Philosophy and Virtue",
                        content:
                            "Socrates focused much of his thought on questions of ethics, justice, courage, knowledge, and the good life. He repeatedly challenged the idea that wealth, reputation, or political power automatically made a person successful. For Socrates, examining one's own beliefs and character was essential to living well. His philosophical approach placed moral self-examination at the center of human life."
                    },
                    {
                        title: "The Trial",
                        content:
                            "In 399 BC, Socrates was brought to trial in Athens. He was accused of impiety and of corrupting the city's youth. The political and social tensions surrounding the trial were connected to the turbulent history of Athens following the Peloponnesian War. Socrates defended himself but was found guilty by the jury."
                    },
                    {
                        title: "The Death of Socrates",
                        content:
                            "Socrates was sentenced to death and executed by drinking hemlock. According to Plato's account, he refused opportunities to escape and accepted the judgment of the Athenian legal system. His final conversations focused on philosophy, death, and the nature of the soul. The image of Socrates calmly facing execution became one of the most influential examples of philosophical commitment in Western thought."
                    },
                    {
                        title: "Legacy",
                        content:
                            "Socrates profoundly influenced the development of Western philosophy despite leaving no written works. Plato became his most famous student and presented Socrates as the central character in many philosophical dialogues. Through Plato, Xenophon, and later philosophers, Socrates became an enduring symbol of intellectual humility, critical inquiry, moral courage, and the willingness to question established assumptions."
                    }
                ],

                image: {
                    url: "https://ancient-wisdom-ivory.vercel.app/images/socrates.jpg",
                    publicId: "seed/socrates"
                }
            },
            { new: true, upsert: true }
        );


        /* ======================================================
           PLATO
        ====================================================== */

        await HistoricalFigure.findOneAndUpdate(
            { name: "Plato" },
            {
                name: "Plato",

                birthDate: "c. 428 BC",
                deathDate: "c. 348 BC",

                birthPlace: "Athens, Greece",
                deathPlace: "Athens, Greece",

                eras: classicalGreece,

                tags: [
                    "Plato",
                    "philosophy",
                    "Athens",
                    "Academy",
                    "Greek philosophy",
                    "Republic"
                ],

                biography: [
                    {
                        title: "Student of Socrates",
                        content:
                            "Plato was born into an aristocratic Athenian family during a period of political instability. He became one of the most important students of Socrates and was deeply affected by his teacher's trial and execution. Socrates's death encouraged Plato to question the strengths and weaknesses of democratic politics and to investigate what kind of knowledge and character were necessary for good government."
                    },
                    {
                        title: "The Academy",
                        content:
                            "Plato founded the Academy in Athens, one of the earliest institutions dedicated to sustained philosophical and intellectual study. The Academy became a major center of learning and attracted students from different parts of the Greek world. Aristotle would later study there for many years. The institution survived in various forms for centuries and became a symbol of organized philosophical education."
                    },
                    {
                        title: "The Theory of Forms",
                        content:
                            "A central feature of Plato's philosophy is the Theory of Forms. Plato argued that the physical world perceived through the senses is constantly changing and imperfect, while true knowledge concerns stable and intelligible realities. Concepts such as justice, beauty, and goodness were therefore treated as having a deeper reality than their imperfect manifestations in the material world."
                    },
                    {
                        title: "The Republic",
                        content:
                            "In The Republic, Plato explored justice, education, political organization, and the nature of the ideal state. He presented the famous image of the philosopher-king, arguing that rulers should possess genuine knowledge and wisdom rather than simply seeking power. The work also contains the Allegory of the Cave, a powerful metaphor for the movement from ignorance toward understanding."
                    },
                    {
                        title: "Politics and Philosophy",
                        content:
                            "Plato's political philosophy emerged from his concerns about the instability of Greek city-states. He examined different forms of government and the ways political institutions could become corrupted. His ideal political system emphasized education, discipline, specialization, and rule by those capable of understanding justice and the common good."
                    },
                    {
                        title: "Legacy",
                        content:
                            "Plato became one of the most influential philosophers in history. His writings shaped later philosophy, theology, political theory, mathematics, and education. His dialogues remain central to the study of ancient philosophy, and questions raised by his works—about reality, knowledge, justice, education, and political power—continue to influence philosophical debates more than two thousand years after his death."
                    }
                ],

                image: {
                    url: "https://ancient-wisdom-ivory.vercel.app/images/plato.jpg",
                    publicId: "seed/plato"
                }
            },
            { new: true, upsert: true }
        );


        /* ======================================================
           SUN TZU
        ====================================================== */

        await HistoricalFigure.findOneAndUpdate(
            { name: "Sun Tzu" },
            {
                name: "Sun Tzu",

                birthDate: "c. 544 BC",
                deathDate: "c. 496 BC",

                birthPlace: "Qi, China",
                deathPlace: "Wu, China",

                eras: imperialChina,

                tags: [
                    "Sun Tzu",
                    "China",
                    "military strategy",
                    "The Art of War",
                    "warfare",
                    "strategy"
                ],

                biography: [
                    {
                        title: "A Military Strategist",
                        content:
                            "Sun Tzu is traditionally presented as a military strategist who lived during the Spring and Autumn period of ancient China. Historical details about his life remain uncertain, and some aspects of his biography may have been shaped by later tradition. Nevertheless, his name became inseparably associated with one of the most influential works on military strategy ever written."
                    },
                    {
                        title: "The Art of War",
                        content:
                            "The Art of War is a concise treatise examining strategy, leadership, intelligence, logistics, deception, and the management of conflict. Rather than celebrating warfare for its own sake, the text repeatedly emphasizes the importance of understanding circumstances and achieving objectives efficiently. Sun Tzu considers preparation and strategic calculation more important than simply relying on superior physical force."
                    },
                    {
                        title: "Knowing the Enemy",
                        content:
                            "One of the most famous ideas associated with Sun Tzu is the importance of understanding both oneself and one's opponent. Intelligence allows commanders to anticipate movements, identify weaknesses, and choose favorable conditions for confrontation. Information therefore becomes a weapon in its own right, capable of preventing unnecessary battles and reducing the cost of military campaigns."
                    },
                    {
                        title: "Deception and Adaptability",
                        content:
                            "Sun Tzu places great importance on deception and flexibility. Armies should avoid becoming predictable and should adapt their behavior according to changing circumstances. A successful commander does not simply follow a fixed plan but constantly evaluates terrain, morale, timing, resources, and the opponent's intentions. Strategy therefore becomes an intellectual discipline rather than merely an exercise in physical strength."
                    },
                    {
                        title: "Victory Without Destruction",
                        content:
                            "Sun Tzu repeatedly suggests that the highest form of strategic success is to achieve one's objectives without unnecessary destruction. Breaking an opponent's plans, alliances, or willingness to fight can be more effective than destroying the enemy army directly. This emphasis makes his work unusual among military texts and helps explain its continued relevance to strategic thinking."
                    },
                    {
                        title: "A Global Influence",
                        content:
                            "The Art of War eventually spread far beyond China and became influential in East Asian military traditions and, later, in Western strategic thought. Modern readers have applied Sun Tzu's principles not only to warfare but also to leadership, negotiation, business, and competitive strategy. His enduring influence comes from his emphasis on preparation, intelligence, adaptability, and understanding the environment before acting."
                    }
                ],

                image: {
                    url: "https://ancient-wisdom-ivory.vercel.app/images/sunTzu.jpg",
                    publicId: "seed/sun-tzu"
                }
            },
            { new: true, upsert: true }
        );


        /* ======================================================
           CONSTANTINE THE GREAT
        ====================================================== */

        await HistoricalFigure.findOneAndUpdate(
            { name: "Constantine the Great" },
            {
                name: "Constantine the Great",

                birthDate: "c. 272 AD",
                deathDate: "May 22, 337 AD",

                birthPlace: "Naissus, Roman Empire",
                deathPlace: "Nicomedia, Roman Empire",

                eras: ancientRome,

                tags: [
                    "Constantine",
                    "Roman Empire",
                    "Rome",
                    "Christianity",
                    "emperor",
                    "Byzantium"
                ],

                biography: [
                    {
                        title: "A Soldier's Son",
                        content:
                            "Constantine was born during a period of political instability in the Roman Empire. His father, Constantius Chlorus, became one of the rulers of the Tetrarchy, a political system designed to manage the enormous Roman state. Constantine grew up within the imperial military environment and developed the skills necessary for command and political leadership."
                    },
                    {
                        title: "The Struggle for Power",
                        content:
                            "After the death of his father in 306, Constantine was proclaimed emperor by his troops. The Roman Empire was divided among several competing rulers, leading to a series of civil wars. Constantine gradually defeated his rivals and eventually became the dominant ruler of the western Roman Empire before defeating Licinius and becoming sole emperor in 324."
                    },
                    {
                        title: "Constantine and Christianity",
                        content:
                            "Constantine's reign transformed the relationship between the Roman state and Christianity. Before his reign, Christians had experienced periods of persecution. Constantine adopted a policy of toleration and became personally associated with Christianity. The Edict of Milan in 313 helped establish religious tolerance, although the exact legal and political circumstances surrounding it were complex."
                    },
                    {
                        title: "The Council of Nicaea",
                        content:
                            "Constantine played an important role in the Council of Nicaea in 325, which brought bishops together to address theological disputes concerning the nature of Christ. Although Constantine was not a theologian responsible for the council's doctrines, his involvement demonstrated how closely imperial politics and Christianity were becoming connected."
                    },
                    {
                        title: "Constantinople",
                        content:
                            "Constantine established Constantinople on the site of the ancient Greek city of Byzantium and inaugurated it as an imperial capital in 330. Its strategic location between Europe and Asia made it exceptionally valuable. Constantinople would eventually become the capital of the Eastern Roman Empire and one of the most important cities of the medieval world."
                    },
                    {
                        title: "Legacy",
                        content:
                            "Constantine's reign marked a decisive transformation in Roman history. He reunified the empire after civil war, strengthened imperial institutions, promoted Christianity, and established a new imperial center at Constantinople. His decisions profoundly influenced the development of both Christianity and the later Roman world, making him one of the most consequential Roman emperors."
                    }
                ],

                image: {
                    url: "https://ancient-wisdom-ivory.vercel.app/images/canstantine.jpg",
                    publicId: "seed/constantine"
                }
            },
            { new: true, upsert: true }
        );


        /* ======================================================
           HANNIBAL BARCA
        ====================================================== */

        await HistoricalFigure.findOneAndUpdate(
            { name: "Hannibal Barca" },
            {
                name: "Hannibal Barca",

                birthDate: "247 BC",
                deathDate: "c. 183 BC",

                birthPlace: "Carthage, North Africa",
                deathPlace: "Bithynia",

                eras: [
                    ...ancientNumidia,
                    ...ancientRome
                ],

                tags: [
                    "Hannibal",
                    "Carthage",
                    "Carthaginian",
                    "Rome",
                    "Second Punic War",
                    "military",
                    "Alps"
                ],

                biography: [
                    {
                        title: "A Carthaginian Commander",
                        content:
                            "Hannibal Barca was born in Carthage around 247 BC into the powerful Barcid family. His father, Hamilcar Barca, was an important Carthaginian commander during the First Punic War. Hannibal grew up within a military environment and developed a deep hostility toward Rome, which had emerged as Carthage's principal rival in the western Mediterranean."
                    },
                    {
                        title: "The Road to Italy",
                        content:
                            "Hannibal became commander of Carthaginian forces in Iberia and expanded Carthaginian influence there. In 218 BC, conflict with Rome triggered the Second Punic War. Hannibal chose an extraordinarily ambitious strategy: instead of waiting for Rome to attack Carthage, he marched his army across the Pyrenees and the Alps to invade Italy from the north."
                    },
                    {
                        title: "The Battle of Cannae",
                        content:
                            "Hannibal won several spectacular victories in Italy, including at Trebia and Lake Trasimene. His greatest victory came at Cannae in 216 BC, where he surrounded and destroyed a much larger Roman army. The battle became a classic example of double envelopment and has been studied by military commanders for centuries."
                    },
                    {
                        title: "Why Rome Survived",
                        content:
                            "Despite Hannibal's victories, Rome refused to surrender. Roman leaders adopted strategies designed to avoid decisive battles and gradually weaken Carthaginian forces. Hannibal lacked the resources necessary to capture Rome itself, while Carthage struggled to provide sufficient reinforcements. The war eventually shifted in Rome's favor as Roman armies attacked Carthaginian territories elsewhere."
                    },
                    {
                        title: "Defeat at Zama",
                        content:
                            "Roman general Scipio Africanus eventually invaded North Africa, forcing Hannibal to return from Italy. The two commanders met at the Battle of Zama in 202 BC. Scipio defeated Hannibal, effectively ending Carthage's ability to challenge Rome militarily. Hannibal later served as a political leader in Carthage before being forced into exile."
                    },
                    {
                        title: "Military Legacy",
                        content:
                            "Hannibal became one of history's most admired military commanders. His ability to operate across difficult terrain, deceive opponents, and defeat larger armies made him a legendary figure in military history. His Alpine crossing and victory at Cannae remain subjects of study. His career also demonstrates the limitations of battlefield genius when it is not supported by sufficient political and logistical resources."
                    }
                ],

                image: {
                    url: "https://ancient-wisdom-ivory.vercel.app/images/hannibal.jpg",
                    publicId: "seed/hannibal"
                }
            },
            { new: true, upsert: true }
        );


        /* ======================================================
           GENGHIS KHAN
        ====================================================== */

        await HistoricalFigure.findOneAndUpdate(
            { name: "Genghis Khan" },
            {
                name: "Genghis Khan",

                birthDate: "c. 1162 AD",
                deathDate: "August 18, 1227 AD",

                birthPlace: "Mongolian Steppe",
                deathPlace: "Xingqing, Western Xia",

                eras: mongolEmpire,

                tags: [
                    "Genghis Khan",
                    "Mongol Empire",
                    "Mongols",
                    "conqueror",
                    "military",
                    "Central Asia"
                ],

                biography: [
                    {
                        title: "Temüjin and the Mongolian Steppe",
                        content:
                            "Genghis Khan was born as Temüjin into the politically fragmented world of the Mongolian steppe. After his father was killed, his family experienced poverty and insecurity. Temüjin gradually built alliances, defeated rival groups, and attracted followers through a combination of military ability, political intelligence, and personal loyalty."
                    },
                    {
                        title: "The Unification of the Mongols",
                        content:
                            "In 1206, after defeating many of his major rivals, Temüjin was proclaimed Genghis Khan. He reorganized Mongol society around military units that weakened traditional tribal divisions and strengthened loyalty to the new imperial leadership. This organization allowed him to mobilize enormous numbers of highly disciplined cavalry."
                    },
                    {
                        title: "Military Innovation",
                        content:
                            "Mongol armies were exceptionally mobile and relied on mounted archery, reconnaissance, communication, intelligence, and deception. Their commanders used feigned retreats, coordinated attacks, and rapid maneuvering to confuse opponents. They also incorporated engineers and specialists from conquered civilizations, allowing Mongol armies to conduct sophisticated siege operations."
                    },
                    {
                        title: "Expansion Across Asia",
                        content:
                            "Genghis Khan's armies conquered large territories in northern China, Central Asia, and the Islamic world. His campaigns destroyed several powerful states and created a political system connecting enormous distances. The scale of these conquests was accompanied by significant destruction and mass casualties, particularly in cities that resisted Mongol authority."
                    },
                    {
                        title: "Administration and Trade",
                        content:
                            "The Mongol Empire was not based solely on destruction. Genghis Khan established systems of communication, taxation, military organization, and imperial administration. Religious tolerance was often encouraged, and merchants received important privileges. These policies later contributed to greater movement of goods, people, and ideas across Eurasia."
                    },
                    {
                        title: "Legacy",
                        content:
                            "Genghis Khan created the foundation of the largest contiguous land empire in recorded history. His descendants expanded Mongol power even further, eventually controlling territories from China to Eastern Europe. His legacy remains deeply controversial because of the immense violence associated with his conquests, but his political and military innovations fundamentally transformed Eurasian history."
                    }
                ],

                image: {
                    url: "https://ancient-wisdom-ivory.vercel.app/images/khan.jpg",
                    publicId: "seed/genghis-khan"
                }
            },
            { new: true, upsert: true }
        );


        /* ======================================================
           ARISTOTLE
        ====================================================== */

        await HistoricalFigure.findOneAndUpdate(
            { name: "Aristotle" },
            {
                name: "Aristotle",

                birthDate: "384 BC",
                deathDate: "322 BC",

                birthPlace: "Stagira, Greece",
                deathPlace: "Chalcis, Euboea",

                eras: classicalGreece,

                tags: [
                    "Aristotle",
                    "philosophy",
                    "science",
                    "logic",
                    "Athens",
                    "Alexander"
                ],

                biography: [
                    {
                        title: "Early Life",
                        content:
                            "Aristotle was born in 384 BC in Stagira, a Greek city in northern Greece. His father served as a physician connected to the Macedonian court, giving Aristotle early exposure to natural observation and medicine. As a young man he traveled to Athens and joined Plato's Academy, where he studied philosophy for approximately twenty years."
                    },
                    {
                        title: "Student of Plato",
                        content:
                            "At Plato's Academy, Aristotle developed his own philosophical approach while engaging deeply with his teacher's ideas. Although influenced by Plato, Aristotle became increasingly critical of the Theory of Forms and emphasized the study of the physical world. His intellectual interests expanded across logic, biology, ethics, politics, metaphysics, rhetoric, and natural philosophy."
                    },
                    {
                        title: "Tutor to Alexander",
                        content:
                            "Aristotle was later invited to educate the young Alexander, the future king of Macedon. His influence on Alexander's intellectual development has been debated, but their relationship connected one of history's greatest philosophers with one of its most famous conquerors. Aristotle exposed the young prince to Greek literature, philosophy, science, and political thought."
                    },
                    {
                        title: "The Lyceum",
                        content:
                            "After returning to Athens, Aristotle established the Lyceum, a school that became a major center of philosophical and scientific investigation. His students collected information from many fields and developed methods of classification and observation. The Lyceum helped establish an intellectual tradition that combined philosophical reasoning with systematic investigation of the natural world."
                    },
                    {
                        title: "Philosophy and Science",
                        content:
                            "Aristotle's writings covered an extraordinary range of subjects. His work on logic helped establish formal systems of reasoning, while his studies of animals attempted to classify living organisms according to observable characteristics. His ethical philosophy emphasized virtue, habit, moderation, and the pursuit of human flourishing. His political writings examined different forms of government and the organization of communities."
                    },
                    {
                        title: "Legacy",
                        content:
                            "Aristotle's influence extended through the ancient, medieval, and early modern worlds. His works were preserved and developed by Byzantine, Islamic, Jewish, and Christian scholars before becoming central to European intellectual traditions. Although many of his scientific conclusions were eventually replaced, his methods of classification, logical reasoning, and systematic inquiry had an enormous historical influence."
                    }
                ],

                image: {
                    url: "https://ancient-wisdom-ivory.vercel.app/images/aristotle.jpg",
                    publicId: "seed/aristotle"
                }
            },
            { new: true, upsert: true }
        );


        /* ======================================================
           ODYSSEUS
        ====================================================== */

        await HistoricalFigure.findOneAndUpdate(
            { name: "Odysseus" },
            {
                name: "Odysseus",

                birthDate: "Mythological",
                deathDate: "Mythological",

                birthPlace: "Ithaca",
                deathPlace: "Ithaca",

                eras: classicalGreece,

                tags: [
                    "Odysseus",
                    "Ulysses",
                    "Greek mythology",
                    "Ithaca",
                    "Trojan War",
                    "Homer"
                ],

                biography: [
                    {
                        title: "King of Ithaca",
                        content:
                            "Odysseus, also known by the Roman name Ulysses, is one of the most famous heroes of Greek mythology. He was traditionally described as the king of Ithaca and the husband of Penelope. Unlike Achilles, whose defining quality was physical strength, Odysseus was celebrated primarily for intelligence, eloquence, adaptability, and strategic thinking."
                    },
                    {
                        title: "The Trojan War",
                        content:
                            "Odysseus participated in the Greek expedition against Troy and became associated with several important episodes of the conflict. Ancient traditions frequently portray him as a master strategist. The most famous story attributes the idea of the Trojan Horse to him, although this episode is mentioned only briefly in surviving ancient sources and was expanded considerably by later tradition."
                    },
                    {
                        title: "The Odyssey",
                        content:
                            "Homer's Odyssey follows Odysseus during his long journey home after the Trojan War. His voyage takes him through encounters with the Cyclops Polyphemus, the sorceress Circe, the Sirens, Scylla and Charybdis, and other supernatural dangers. These adventures emphasize his intelligence and ability to survive through strategy rather than brute force."
                    },
                    {
                        title: "Penelope and Ithaca",
                        content:
                            "While Odysseus is away, his wife Penelope is pressured by numerous suitors who believe he will never return. She delays remarriage through a series of clever strategies. Odysseus eventually reaches Ithaca disguised as a beggar, allowing him to assess the situation before revealing his identity."
                    },
                    {
                        title: "The Return",
                        content:
                            "Odysseus ultimately reveals himself and defeats the suitors who have occupied his household. His return restores his authority as king and reunites him with Penelope and his son Telemachus. The story emphasizes themes of identity, loyalty, perseverance, intelligence, and the longing to return home."
                    },
                    {
                        title: "A Symbol of Intelligence",
                        content:
                            "Odysseus became one of the most enduring figures of Greek mythology because he represents a different form of heroism from warriors such as Achilles. His greatest weapon is his mind. His ability to deceive, negotiate, improvise, and survive dangerous situations has made him a lasting symbol of strategic intelligence and adaptability."
                    }
                ],

                image: {
                    url: "https://ancient-wisdom-ivory.vercel.app/statues/ulysse.jpg",
                    publicId: "seed/odysseus"
                }
            },
            { new: true, upsert: true }
        );


        /* ======================================================
           CLEOPATRA
        ====================================================== */

        await HistoricalFigure.findOneAndUpdate(
            { name: "Cleopatra" },
            {
                name: "Cleopatra",

                birthDate: "69 BC",
                deathDate: "August 12, 30 BC",

                birthPlace: "Alexandria, Egypt",
                deathPlace: "Alexandria, Egypt",

                eras: ancientRome,

                tags: [
                    "Cleopatra",
                    "Egypt",
                    "Ptolemaic",
                    "Rome",
                    "Julius Caesar",
                    "Mark Antony",
                    "Alexandria"
                ],

                biography: [
                    {
                        title: "Queen of Ptolemaic Egypt",
                        content:
                            "Cleopatra VII was born in 69 BC into the Ptolemaic dynasty, a Greek-speaking royal family that had ruled Egypt since the death of Alexander the Great. Unlike many of her predecessors, Cleopatra was known for her political intelligence and reportedly learned the Egyptian language in addition to several other languages. She inherited a kingdom facing serious internal and external pressures."
                    },
                    {
                        title: "Political Struggle",
                        content:
                            "Cleopatra initially ruled alongside her younger brother Ptolemy XIII, but their relationship quickly deteriorated into a struggle for power. Cleopatra was temporarily forced from Alexandria before returning with military and political support. Her ability to navigate the conflict demonstrated the importance of diplomacy and personal alliances in the unstable politics of the eastern Mediterranean."
                    },
                    {
                        title: "Julius Caesar",
                        content:
                            "Cleopatra's political fortunes became closely connected with Julius Caesar when he arrived in Alexandria during the Roman civil wars. Cleopatra secured Caesar's support in her conflict with Ptolemy XIII. Their relationship had both personal and political dimensions, and Caesar helped restore Cleopatra to power. Cleopatra later visited Rome and strengthened the political connection between Egypt and Rome."
                    },
                    {
                        title: "Mark Antony",
                        content:
                            "After Caesar's assassination, Cleopatra formed a political and personal alliance with Mark Antony, one of the most powerful Roman leaders. Their relationship developed within the wider struggle for control of the Roman world. Antony relied on Egyptian resources while Cleopatra sought to preserve Egypt's independence and strengthen her dynasty."
                    },
                    {
                        title: "The Final Conflict",
                        content:
                            "Cleopatra and Antony eventually faced Octavian, Caesar's adopted heir and future emperor Augustus. Their forces were defeated at the naval Battle of Actium in 31 BC. The following year, Octavian invaded Egypt. Antony died by suicide, and Cleopatra soon followed. Egypt was incorporated into the Roman world, ending the independence of the Ptolemaic kingdom."
                    },
                    {
                        title: "Legacy",
                        content:
                            "Cleopatra became one of history's most famous queens, although her reputation was often shaped by Roman political propaganda and later artistic traditions. She was not simply a romantic figure but an experienced monarch who attempted to preserve Egypt's political independence during a period dominated by Rome. Her life represents the final chapter of the Hellenistic kingdoms and the transition toward Roman imperial power."
                    }
                ],

                image: {
                    url: "https://ancient-wisdom-ivory.vercel.app/images/cleopatra.jpg",
                    publicId: "seed/cleopatra"
                }
            },
            { new: true, upsert: true }
        );


        /* ======================================================
           JUBA II
        ====================================================== */

        await HistoricalFigure.findOneAndUpdate(
            { name: "Juba II" },
            {
                name: "Juba II",

                birthDate: "c. 48 BC",
                deathDate: "c. 23 AD",

                birthPlace: "Numidia, North Africa",
                deathPlace: "Mauretania",

                eras: [
                    ...ancientNumidia,
                    ...ancientRome
                ],

                tags: [
                    "Juba II",
                    "Numidia",
                    "Mauretania",
                    "North Africa",
                    "Rome",
                    "king"
                ],

                biography: [
                    {
                        title: "A Numidian Prince",
                        content:
                            "Juba II was born into the royal family of Numidia during a period of profound political transformation in North Africa. His father, Juba I, opposed Julius Caesar during the Roman civil wars. After the defeat of the Numidian kingdom, the young Juba was taken to Rome and raised within the imperial environment."
                    },
                    {
                        title: "Education in Rome",
                        content:
                            "Juba received an extensive education in Rome and became deeply familiar with Greek and Roman intellectual traditions. He developed interests in geography, history, natural science, and literature. His education allowed him to move between North African, Greek, and Roman cultural worlds and later contributed to his reputation as an unusually learned ruler."
                    },
                    {
                        title: "King of Mauretania",
                        content:
                            "Augustus eventually established Juba as king of Mauretania, a North African kingdom extending across parts of present-day Morocco and Algeria. Juba ruled in cooperation with Rome while retaining a degree of royal authority. His reign illustrates the complex relationship between Rome and allied kingdoms on the edges of the empire."
                    },
                    {
                        title: "Cleopatra Selene",
                        content:
                            "Juba married Cleopatra Selene, the daughter of Cleopatra VII and Mark Antony. Their marriage connected two important Hellenistic royal traditions. Together they established a court that encouraged Greek and Roman cultural influences while maintaining strong connections with North African traditions."
                    },
                    {
                        title: "Scholar and Author",
                        content:
                            "Juba was more than a political ruler. He wrote works on geography, history, theater, language, and natural phenomena. Although most of his writings have been lost, later authors cited his research. His intellectual interests demonstrate the cultural sophistication of North African courts during the Roman period."
                    },
                    {
                        title: "Legacy in North Africa",
                        content:
                            "Juba II became an important intermediary between Rome and the kingdoms of North Africa. His reign contributed to the development of cities, trade, scholarship, and Mediterranean cultural connections. His son Ptolemy succeeded him, but the kingdom was eventually annexed by Rome. Juba's life remains an important example of the interaction between indigenous North African traditions and the wider Roman world."
                    }
                ],

                image: {
                    url: "https://ancient-wisdom-ivory.vercel.app/images/juba2.jpg",
                    publicId: "seed/juba-ii"
                }
            },
            { new: true, upsert: true }
        );


        /* ======================================================
           MASSINISSA
        ====================================================== */

        await HistoricalFigure.findOneAndUpdate(
            { name: "Massinissa" },
            {
                name: "Massinissa",

                birthDate: "c. 238 BC",
                deathDate: "c. 148 BC",

                birthPlace: "Numidia, North Africa",
                deathPlace: "Cirta, Numidia",

                eras: [
                    ...ancientNumidia,
                    ...ancientRome
                ],

                tags: [
                    "Massinissa",
                    "Numidia",
                    "Berber",
                    "Amazigh",
                    "Carthage",
                    "Rome",
                    "king"
                ],

                biography: [
                    {
                        title: "King of the Massylii",
                        content:
                            "Massinissa was born around 238 BC and became one of the most important rulers in ancient North Africa. He belonged to the Massylian royal family and grew up during a period when Numidian kingdoms were increasingly drawn into the rivalry between Rome and Carthage. His political career would eventually transform Numidia into one of the most important kingdoms of the western Mediterranean."
                    },
                    {
                        title: "The Second Punic War",
                        content:
                            "During the Second Punic War, Massinissa initially maintained connections with Carthage before shifting his alliance toward Rome. His military knowledge of North Africa and the effectiveness of Numidian cavalry made him an important ally. His forces played a significant role in the campaign against Hannibal and Carthage."
                    },
                    {
                        title: "The Unification of Numidia",
                        content:
                            "After the defeat of Carthage, Massinissa expanded his territory and consolidated several Numidian regions under his authority. He transformed Numidia into a stronger and more centralized kingdom. His reign demonstrated that indigenous North African states possessed significant political and military power rather than existing merely as peripheral territories controlled by Mediterranean empires."
                    },
                    {
                        title: "Agriculture and Economic Development",
                        content:
                            "Massinissa promoted agriculture and permanent settlement within Numidia. Ancient sources associate his reign with the development of agricultural production and the transformation of parts of Numidia from predominantly pastoral economies toward more settled agricultural systems. His policies strengthened the economic foundations of the kingdom."
                    },
                    {
                        title: "Relations with Rome and Carthage",
                        content:
                            "Massinissa maintained a close alliance with Rome while continuing to expand Numidian territory at Carthage's expense. His territorial ambitions contributed to growing tensions between Numidia and the weakened Carthaginian state. These tensions eventually helped create the political circumstances that led to the Third Punic War."
                    },
                    {
                        title: "Legacy",
                        content:
                            "Massinissa is remembered as one of the foundational rulers of ancient Numidia. His long reign strengthened Numidian political identity and demonstrated the importance of North African kingdoms in Mediterranean affairs. He remains an important historical figure in the history of the Maghreb and in the long political traditions of the region's indigenous peoples."
                    }
                ],

                image: {
                    url: "https://ancient-wisdom-ivory.vercel.app/images/masinissa.jpg",
                    publicId: "seed/massinissa"
                }
            },
            { new: true, upsert: true }
        );


        /* ======================================================
           SCIPIO AFRICANUS
        ====================================================== */

        await HistoricalFigure.findOneAndUpdate(
            { name: "Scipio Africanus" },
            {
                name: "Scipio Africanus",

                birthDate: "236 BC",
                deathDate: "183 BC",

                birthPlace: "Rome, Roman Republic",
                deathPlace: "Liternum, Roman Republic",

                eras: ancientRome,

                tags: [
                    "Scipio Africanus",
                    "Rome",
                    "Roman Republic",
                    "Hannibal",
                    "Second Punic War",
                    "military"
                ],

                biography: [
                    {
                        title: "A Roman Commander",
                        content:
                            "Publius Cornelius Scipio was born into one of Rome's most prominent aristocratic families. He entered military life during the Second Punic War, a period in which Rome faced the greatest military threat of its early history. Scipio witnessed the catastrophic Roman defeats caused by Hannibal and gradually developed a strategy designed to change the course of the war."
                    },
                    {
                        title: "The Spanish Campaign",
                        content:
                            "Scipio took command of Roman forces in Iberia and launched a series of aggressive campaigns against Carthaginian armies. His capture of New Carthage was particularly important because the city contained military supplies, hostages, and strategic resources. His victories eventually expelled Carthaginian forces from most of Iberia."
                    },
                    {
                        title: "Alliance with Massinissa",
                        content:
                            "Scipio understood the importance of Numidian cavalry and developed an alliance with Massinissa. The Numidian king provided highly mobile cavalry forces that became extremely valuable in the final stages of the war. The partnership demonstrated Scipio's ability to combine Roman military strength with the specialized capabilities of allied forces."
                    },
                    {
                        title: "The Battle of Zama",
                        content:
                            "In 202 BC, Scipio confronted Hannibal at the Battle of Zama in North Africa. Roman infantry, supported by Numidian cavalry, defeated the Carthaginian army. Scipio's victory effectively ended the Second Punic War and established him as Rome's most celebrated military commander of the generation."
                    },
                    {
                        title: "Africanus",
                        content:
                            "After his victory, Scipio received the honorific title Africanus. His military reputation became enormous, and he enjoyed considerable political influence in Rome. However, his popularity and power also generated suspicion among political rivals who feared the concentration of authority within individual commanders."
                    },
                    {
                        title: "Legacy",
                        content:
                            "Scipio Africanus became one of Rome's greatest military figures. His victory over Hannibal transformed the balance of power in the Mediterranean and established Rome as the dominant western Mediterranean power. His campaigns remain important in the study of military strategy, particularly for the way he adapted Roman forces to counter Hannibal's methods."
                    }
                ],

                image: {
                    url: "https://ancient-wisdom-ivory.vercel.app/images/scipio.jpg",
                    publicId: "seed/scipio-africanus"
                }
            },
            { new: true, upsert: true }
        );


        console.log(
            "Historical figures seeded successfully."
        );

    } catch (error) {

        console.error(
            "Historical figure seed failed:",
            error
        );

        throw error;
    }
};


export default seedFigures;