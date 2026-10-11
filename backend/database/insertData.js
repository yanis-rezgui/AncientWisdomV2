
// seeds/seedArticles.js

import Article from "../models/Learn/article.model.js";
import HistoricalEra from "../models/historicalEra.model.js";

const articlesData = [
    {
        title: "The Scientific Revolution: Challenging the Ancient Worldview",
        description:
            "Between the sixteenth and seventeenth centuries, European thinkers transformed humanity's understanding of the natural world. Through observation, experimentation, mathematics, and debate, figures such as Copernicus, Galileo, Kepler, and Newton challenged established beliefs and helped establish the foundations of modern science.",
        image: {
            url: "CLOUDINARY_URL_SCIENTIFIC_REVOLUTION",
            publicId: "CLOUDINARY_PUBLIC_ID_SCIENTIFIC_REVOLUTION",
        },
        eraName: "Scientific Revolution",
        tags: [
            "Scientific Revolution",
            "Astronomy",
            "Galileo",
            "Copernicus",
            "Newton",
            "Science",
            "History of Ideas",
        ],
        sections: [
            {
                title: "A New Approach to Understanding Nature",
                content: `For centuries, European scholarship relied heavily on ideas inherited from ancient Greek philosophers, especially Aristotle, and astronomical models associated with Claudius Ptolemy. These traditions were preserved and developed by medieval scholars, but many explanations of the natural world depended on established authority rather than systematic experimental testing.

During the sixteenth century, new observations, mathematical techniques, navigational demands, and the spread of printed books encouraged scholars to reconsider inherited explanations. The Scientific Revolution was not a sudden rejection of all earlier knowledge. It was a gradual transformation in how natural phenomena were investigated, explained, and debated.

A central development was the growing importance of combining observation with mathematical reasoning. Instead of accepting a theory simply because it came from an ancient authority, investigators increasingly asked whether evidence supported it. Experiments, astronomical measurements, and the careful comparison of predictions with observations became increasingly influential.

Printing helped these ideas circulate across Europe. Scholars could publish findings, criticize one another's arguments, and build upon previous discoveries. Scientific knowledge increasingly emerged through an international network of correspondence, publications, institutions, and debates rather than through the work of isolated thinkers alone.`,
            },
            {
                title: "Copernicus and the Moving Earth",
                content: `In 1543, Nicolaus Copernicus published De revolutionibus orbium coelestium, a work that proposed a heliocentric model in which Earth and the other planets moved around the Sun. This challenged the traditional geocentric arrangement, which placed Earth at the center of the cosmos.

The Copernican model offered a new way to organize the movements of the planets. It helped explain phenomena such as the apparent retrograde motion of planets as consequences of the relative movements of Earth and other planets. However, Copernicus did not immediately establish the modern understanding of the solar system. His model still relied on circular motions and complicated geometrical arrangements.

The idea that Earth moved through space raised major philosophical, scientific, and theological questions. Many scholars considered it difficult to reconcile with common experience and the physics inherited from Aristotle. Acceptance therefore required more than simply presenting a new astronomical diagram; it demanded changes in the broader understanding of motion and the universe.

Later astronomers expanded the debate. Johannes Kepler used the observations of Tycho Brahe to formulate laws describing planetary motion, including the discovery that planets travel in elliptical rather than perfectly circular orbits. These findings made heliocentric astronomy more mathematically powerful and prepared the way for later explanations of gravity.`,
            },
            {
                title: "Galileo, Observation, and Scientific Conflict",
                content: `The development of the telescope transformed astronomy in the early seventeenth century. Galileo Galilei used improved telescopic instruments to observe features that challenged traditional descriptions of the heavens. His discoveries included mountains and craters on the Moon, numerous stars invisible to the naked eye, and four moons orbiting Jupiter.

These observations undermined the idea that every celestial object revolved directly around Earth. Galileo also observed the phases of Venus, evidence that Venus traveled around the Sun rather than remaining in a simple Earth-centered arrangement. His findings strengthened the case for changing established astronomical models.

Galileo's support for heliocentrism brought him into conflict with Church authorities. In 1633, the Roman Inquisition tried him, and he was compelled to recant his support for the proposition that Earth moved around the Sun. He spent the remainder of his life under house arrest. The episode became a famous example of the tensions that could arise when new scientific arguments challenged established interpretations of nature and scripture.

Yet Galileo's importance extended beyond astronomy. His studies of falling bodies and motion helped encourage the mathematical investigation of physical phenomena. His work demonstrated how carefully designed observations and quantitative analysis could challenge assumptions that had survived for centuries.`,
            },
            {
                title: "Newton and the Laws of Nature",
                content: `Isaac Newton brought together important developments in astronomy and mechanics. In 1687, he published Philosophiæ Naturalis Principia Mathematica, commonly known as the Principia. In this work, Newton formulated laws of motion and a universal law of gravitation that could explain both terrestrial movement and the motions of celestial bodies.

Newton's achievement helped demonstrate that the same physical principles could govern objects on Earth and planets in the heavens. The movements of the Moon, the paths of planets, and the behavior of falling objects could be analyzed within a unified mathematical framework. This was a major step toward the modern conception of universal physical laws.

The Scientific Revolution also changed scientific institutions and practices. Academies and societies, including the Royal Society in England and the French Academy of Sciences, helped organize research, communicate findings, and promote the exchange of knowledge. Scientific work increasingly depended on collective investigation and the evaluation of evidence by other scholars.

The transformation was neither complete nor universally accepted during Newton's lifetime. Many questions remained unresolved, and scientific knowledge continued to change. Nevertheless, the methods and discoveries of this period profoundly influenced later developments in physics, astronomy, chemistry, medicine, and engineering. The Scientific Revolution established enduring expectations that claims about nature should be investigated through evidence, reasoning, and reproducible methods.`,
            },
        ],
    },

    {
        title: "Ptolemaic Egypt: The Kingdom of the Ptolemies",
        description:
            "After Alexander the Great conquered Egypt, the Ptolemaic dynasty established one of the most influential Hellenistic kingdoms. Ruled from Alexandria, the kingdom combined Macedonian Greek political traditions with Egyptian religious institutions and became a major center of trade, scholarship, art, and cultural exchange before its annexation by Rome.",
        image: {
            url: "CLOUDINARY_URL_PTOLEMAIC_EGYPT",
            publicId: "CLOUDINARY_PUBLIC_ID_PTOLEMAIC_EGYPT",
        },
        eraName: "Hellenistic Period",
        tags: [
            "Ptolemaic Egypt",
            "Hellenistic Period",
            "Alexandria",
            "Cleopatra",
            "Ancient Egypt",
            "Ptolemy",
            "Ancient History",
        ],
        sections: [
            {
                title: "From Alexander's Conquest to a New Dynasty",
                content: `In 332 BCE, Alexander the Great entered Egypt during his campaign against the Persian Empire. Many Egyptians had experienced periods of Persian rule, and Alexander presented himself as a legitimate ruler within Egyptian traditions. He visited the oracle of Amun at Siwa and founded the city of Alexandria on the Mediterranean coast, creating a settlement that would become one of the most important cities of the ancient world.

Following Alexander's death in 323 BCE, his generals struggled for control of the territories he had conquered. Ptolemy, one of Alexander's commanders, secured control of Egypt and gradually established an independent dynasty. In 305 BCE, he adopted the title of king, beginning the Ptolemaic monarchy that would rule Egypt for nearly three centuries.

Egypt offered important advantages to its new rulers. The Nile Valley produced substantial agricultural surpluses, while the country's position connected the Mediterranean with routes toward the Red Sea and northeastern Africa. Control over farming, taxation, and international commerce helped finance the royal administration, military forces, and major building projects.

The Ptolemies inherited the institutions of the Egyptian state but also brought Macedonian and Greek elites into positions of authority. Their kingdom became a characteristic Hellenistic society, shaped by the interaction of Greek political culture with the much older traditions of Egypt.`,
            },
            {
                title: "Alexandria: A Center of Knowledge and Commerce",
                content: `Alexandria developed into a major Mediterranean port and a center of intellectual life. Its location connected maritime trade with Egypt's agricultural wealth and routes leading toward the Red Sea. Merchants, sailors, administrators, craftspeople, and scholars contributed to the city's cosmopolitan character.

The Ptolemaic rulers supported the Mouseion, an institution associated with the Muses that brought scholars together for study and research. The famous Library of Alexandria was connected with this intellectual environment and became a symbol of the ambition to collect and preserve written knowledge from many cultures. Ancient accounts of the library differ, and its exact organization and history remain subjects of scholarly debate.

Alexandria attracted scholars working in mathematics, astronomy, geography, medicine, and literary criticism. Euclid's work on geometry, the astronomical investigations associated with Aristarchus, and the geographical and mathematical achievements of Eratosthenes illustrate the remarkable intellectual activity of the Hellenistic world.

This scholarly environment depended on royal patronage and the concentration of resources in the capital. It also reflected broader networks of communication across the eastern Mediterranean. Greek became an important language of administration and scholarship, while Egyptian languages and religious traditions continued to shape life throughout the kingdom.`,
            },
            {
                title: "Religion, Society, and Cultural Exchange",
                content: `The Ptolemaic monarchy governed a population with diverse languages, social positions, and religious traditions. Greek-speaking settlers and officials often occupied privileged positions, while the majority of the population lived in Egyptian villages and depended on agriculture. The royal administration collected taxes and organized production, connecting local communities to the economic needs of the state.

The Ptolemies understood that ruling Egypt required cooperation with influential Egyptian priests and temples. They sponsored temple construction and restoration, participated in religious ceremonies, and adopted elements of pharaonic royal imagery. Their monuments portrayed them according to Egyptian conventions, presenting the king as a protector of cosmic order and a servant of the gods.

Cultural exchange also produced new religious forms. The cult of Serapis, promoted under the early Ptolemies, combined elements associated with Greek and Egyptian religious traditions. Although it did not erase the differences between the two cultures, it provided a shared religious symbol that could appeal to different communities, particularly in urban settings.

The kingdom's society remained unequal, and cultural interaction did not mean equal access to power. Nevertheless, the Ptolemaic period illustrates how political authority could adapt to local traditions while creating new forms of cultural life. Egyptian temples, Greek cities, and international trading communities all formed part of the same kingdom.`,
            },
            {
                title: "Cleopatra VII and the End of Ptolemaic Rule",
                content: `Cleopatra VII, who became queen in 51 BCE, was the last active ruler of the Ptolemaic dynasty. Her reign unfolded during a period when Roman political power increasingly shaped the eastern Mediterranean. Internal dynastic disputes and the growing influence of Roman leaders made it difficult for Egypt to preserve its independence.

Cleopatra worked to secure her position through diplomacy, military alliances, and personal relationships with powerful Roman figures, including Julius Caesar and Mark Antony. These relationships were political as well as personal, reflecting Egypt's need to navigate the struggles of the late Roman Republic. Cleopatra also sought to maintain the kingdom's economic resources and royal authority.

The conflict between Mark Antony and Octavian culminated in the naval battle of Actium in 31 BCE. Antony and Cleopatra's forces were defeated, and Octavian subsequently invaded Egypt. In 30 BCE, both Antony and Cleopatra died, and Egypt became a Roman province.

The end of the Ptolemaic kingdom did not end Egypt's historical significance. Its agricultural wealth remained essential to the Roman Empire, while Alexandria continued as an important center of trade and learning. The Ptolemaic period left a lasting legacy in the history of science, urban life, religious exchange, and the political relationships between the Mediterranean's great powers.`,
            },
        ],
    },

    {
        title: "Anglo-Saxon England: Kingdoms, Culture, and Unification",
        description:
            "Following the end of Roman rule in Britain, several Anglo-Saxon kingdoms emerged and competed for power. Through warfare, migration, Christianization, trade, and cultural exchange, these kingdoms developed distinctive institutions and traditions that eventually contributed to the formation of a unified English kingdom.",
        image: {
            url: "CLOUDINARY_URL_ANGLO_SAXON_ENGLAND",
            publicId: "CLOUDINARY_PUBLIC_ID_ANGLO_SAXON_ENGLAND",
        },
        eraName: "Anglo-Saxon England",
        tags: [
            "Anglo-Saxon England",
            "Early Medieval Britain",
            "Wessex",
            "Christianization",
            "Vikings",
            "Alfred the Great",
            "English History",
        ],
        sections: [
            {
                title: "Britain After Roman Rule",
                content: `Roman political authority in Britain ended in the early fifth century, leaving a complex landscape of local communities, former Roman towns, and regional rulers. The withdrawal of imperial administration did not mean that all Roman culture immediately disappeared. Some towns, roads, buildings, and economic practices continued to influence life, although many regions experienced major changes in settlement and political organization.

During the fifth and sixth centuries, people from continental northwestern Europe, including groups traditionally identified as Angles, Saxons, and Jutes, migrated to Britain. The nature and scale of these movements remain debated. Archaeological evidence suggests a mixture of migration, cultural change, intermarriage, and the reorganization of local communities rather than a single uniform invasion.

Over time, Germanic languages and cultural practices became dominant in much of what is now England. The term Anglo-Saxon is used to describe many of these communities and the societies that developed from them. Britain nevertheless remained diverse: Brittonic-speaking populations continued in Wales, Cornwall, and other regions, while northern areas had their own political and cultural traditions.

The new communities developed local leadership, agricultural settlements, warrior elites, and royal dynasties. Their kingdoms competed for land and influence, laying the foundations for the political landscape of early medieval England.`,
            },
            {
                title: "The Rise of the Anglo-Saxon Kingdoms",
                content: `By the seventh century, several major kingdoms had emerged, including Northumbria, Mercia, East Anglia, Kent, Essex, Sussex, and Wessex. Their boundaries and relative strength changed repeatedly as rulers fought wars, established alliances, and absorbed smaller territories. No single kingdom controlled all of England throughout this period.

Kingship depended on military leadership, personal loyalty, control of land, and the distribution of rewards to followers. Rulers maintained relationships with nobles and warrior retinues, while religious institutions gradually became important landowners and centers of political influence. Tribute, gifts, and control of trade routes also contributed to royal power.

The kingdom of Northumbria became a major center of learning and religious culture during the seventh and eighth centuries. Mercia later emerged as a dominant power in much of central England, particularly under rulers such as Æthelbald and Offa. Offa is associated with the construction of Offa's Dyke, a substantial earthwork along part of the boundary between Mercia and Welsh territories.

Wessex became increasingly important during the ninth century, especially as Viking armies challenged the existing kingdoms. Its rulers developed military and administrative responses that helped preserve their independence. The later expansion of Wessex would play a central role in the formation of a more unified English kingdom.`,
            },
            {
                title: "Christianization and the Growth of Learning",
                content: `Christianity spread through several interconnected routes. In 597, Pope Gregory the Great sent Augustine on a mission to the kingdom of Kent, where King Æthelberht permitted the establishment of a Christian community. At the same time, missionaries and church leaders connected with Irish Christian traditions were active in northern Britain, particularly in Northumbria.

The conversion of Anglo-Saxon rulers was often a gradual political and cultural process rather than a single event. Kings and communities adopted Christianity at different times, and older religious practices could persist alongside the new faith. Monasteries became important centers for worship, education, manuscript production, and international communication.

Anglo-Saxon scholars participated in a wider European intellectual world. Bede, a monk from Northumbria, wrote historical and theological works that became important sources for understanding early medieval Britain. Monasteries preserved Latin learning while also developing traditions of vernacular writing and poetry.

Artistic achievements included illuminated manuscripts, carved stone crosses, metalwork, and objects decorated with intricate interlacing patterns. Christian imagery interacted with earlier artistic traditions, creating distinctive forms of visual culture. These developments helped connect Anglo-Saxon kingdoms to wider religious and intellectual networks across Europe.`,
            },
            {
                title: "Viking Raids and the Age of Alfred the Great",
                content: `Viking attacks became a major challenge to Anglo-Saxon England from the late eighth century onward. The raid on Lindisfarne in 793 became one of the most famous early attacks, although Scandinavian contact with Britain involved trade, settlement, and political activity as well as warfare. During the ninth century, larger Viking forces campaigned across several Anglo-Saxon kingdoms.

In 865, a force commonly called the Great Heathen Army arrived in England. It conquered or destabilized several kingdoms, including Northumbria and East Anglia, and placed Mercia under severe pressure. Wessex survived under King Alfred, who became one of the most influential rulers in English history.

Alfred's forces defeated a Viking army at the Battle of Edington in 878. He subsequently developed fortified settlements, reorganized military service, and supported legal and educational reforms. His policies helped Wessex resist further attacks and provided a model for later rulers. Alfred also promoted translations of important Latin works into Old English, strengthening the use of the vernacular in learning and administration.

His successors expanded Wessex's influence into territories formerly controlled by other Anglo-Saxon kingdoms. During the tenth century, rulers such as Æthelstan consolidated control over much of England. Although political unity remained contested, the foundations of the English kingdom were increasingly established through military campaigns, royal administration, and cooperation with local elites.`,
            },
            {
                title: "Legacy of Anglo-Saxon England",
                content: `Anglo-Saxon England developed institutions that influenced the later English state. Royal law codes, local assemblies, systems of landholding, and forms of regional administration evolved over centuries. Their origins were varied, and many institutions changed significantly after the Norman Conquest of 1066, but Anglo-Saxon practices remained an important part of England's political development.

The English language emerged from the Germanic dialects spoken by Anglo-Saxon communities. Old English differed greatly from modern English, yet many everyday words and aspects of English grammar have roots in this period. Contact with Latin through Christianity and with Old Norse through Scandinavian settlement also shaped linguistic development.

The period produced a rich literary and artistic heritage, including the epic poem Beowulf, religious writings, chronicles, and material objects such as the Sutton Hoo ship burial treasures. These works provide evidence of elite culture, religious change, craftsmanship, and connections across the North Sea world.

Anglo-Saxon history should not be understood as an isolated prelude to modern England. It was part of a wider early medieval world shaped by migration, trade, Christianity, warfare, and political experimentation. Its kingdoms helped create the institutions, language, and cultural traditions from which medieval England developed.`,
            },
        ],
    },

    {
        title: "The Khmer Empire: Angkor and the Power of Water",
        description:
            "The Khmer Empire dominated much of mainland Southeast Asia for centuries, reaching its height around the monumental city of Angkor. Its rulers built enormous temples, developed sophisticated water-management systems, and supported extensive networks of agriculture and trade, leaving an architectural and cultural legacy that continues to shape Cambodia today.",
        image: {
            url: "CLOUDINARY_URL_KHMER_EMPIRE",
            publicId: "CLOUDINARY_PUBLIC_ID_KHMER_EMPIRE",
        },
        eraName: "Khmer Empire",
        tags: [
            "Khmer Empire",
            "Angkor",
            "Cambodia",
            "Southeast Asia",
            "Angkor Wat",
            "Jayavarman VII",
            "Ancient Architecture",
        ],
        sections: [
            {
                title: "The Origins of the Khmer Empire",
                content: `The Khmer Empire emerged in mainland Southeast Asia during the early medieval period, building upon older political and cultural networks in the Mekong region. Communities in the area participated in trade connecting the Indian Ocean, the South China Sea, and inland river systems. These connections brought goods, ideas, religious traditions, and political influences into the region.

Inscriptions traditionally associate the establishment of a unified Khmer kingship with Jayavarman II in the early ninth century. The details of this process remain complex, but his reign is often treated as a turning point in the consolidation of royal authority. Later rulers expanded their influence through military campaigns, marriage alliances, religious patronage, and the organization of agricultural production.

The empire was not a centralized state in the modern sense. Its rulers depended on relationships with regional elites, temple institutions, and local communities. Royal authority could vary considerably across territories, and political influence changed as rulers gained or lost the support of powerful groups.

The Khmer state developed an artistic and political language that drew on regional traditions as well as religious ideas from South Asia. Sanskrit inscriptions, Hindu deities, Buddhist imagery, and local beliefs all contributed to the cultural world in which Khmer kingship operated.`,
            },
            {
                title: "Angkor: A Monumental Capital",
                content: `Angkor became the most famous center of Khmer political and religious life. Located in present-day Cambodia, the wider Angkor region contained temples, reservoirs, canals, roads, settlements, and agricultural land. It was not simply a city of stone monuments but an extensive landscape in which royal institutions and rural communities were closely connected.

Khmer rulers commissioned temples to express political legitimacy, honor deities, commemorate ancestors, and demonstrate their capacity to mobilize labor and resources. Monumental architecture often combined carefully planned layouts, towers, courtyards, sculptures, and extensive reliefs. These buildings transformed religious and political ideas into durable features of the landscape.

Angkor Wat, constructed during the reign of Suryavarman II in the twelfth century, is among the most remarkable examples of Khmer architecture. Initially associated with the Hindu god Vishnu, it is famous for its scale, balanced design, and extensive carved galleries. Its reliefs depict religious narratives, royal processions, and scenes of battle, providing insight into the values and imagery of the period.

The monuments were created by skilled builders, artisans, laborers, and administrators working within a complex system of resource collection and royal patronage. Their construction reveals both the wealth of the kingdom and the organizational capacity of its rulers.`,
            },
            {
                title: "Water Management and Agricultural Wealth",
                content: `Agriculture formed the foundation of the Khmer Empire's economy. Rice cultivation supported large populations, royal institutions, and religious establishments. The seasonal rhythm of the monsoon made water management particularly important, as communities had to navigate both periods of abundant rainfall and intervals of reduced water supply.

The Angkor region developed a remarkable network of reservoirs, canals, embankments, and other hydraulic features. Large reservoirs, commonly called barays, stored water and became prominent features of the landscape. Smaller channels and local systems helped distribute water and connect settlements with cultivated land.

The exact functions of individual reservoirs and canals remain debated. Some supported irrigation, while others may also have served religious, political, or landscape-design purposes. It is therefore misleading to imagine Angkor as a perfectly controlled hydraulic machine. Its water systems were complex, changed over time, and required ongoing maintenance.

The relationship between water management and royal authority was nevertheless significant. Monumental reservoirs and organized infrastructure could demonstrate a ruler's ability to coordinate labor and support agricultural production. At the same time, the system depended on local knowledge, seasonal conditions, and the work of communities throughout the region.`,
            },
            {
                title: "Jayavarman VII and the Buddhist Transformation",
                content: `Jayavarman VII, who ruled in the late twelfth and early thirteenth centuries, presided over one of the most ambitious periods of Khmer building and state development. His reign followed conflict and political disruption, and he undertook major construction projects intended to restore authority and support the population.

Jayavarman VII is closely associated with Mahayana Buddhism. The Bayon, located at the center of Angkor Thom, is famous for its towers bearing large carved faces and its extensive reliefs. These images and architectural arrangements expressed a distinctive royal and religious vision, although scholars continue to debate the identities and meanings of the faces.

The king also sponsored roads, bridges, temples, and institutions often interpreted as hospitals or rest houses. These projects connected parts of the kingdom and demonstrate the importance of public works in royal ideology. Inscriptions describe an image of kingship associated with compassion, protection, and the welfare of subjects.

Buddhism did not simply replace every earlier tradition. Hindu religious practices remained influential, and Khmer religious life continued to evolve through interaction among different beliefs and institutions. The monuments of this period reflect a dynamic religious environment as well as the political ambitions of the monarchy.`,
            },
            {
                title: "Transformation and the Legacy of Angkor",
                content: `From the late medieval period onward, the Khmer Empire experienced significant political and environmental changes. Regional power shifted, neighboring states became increasingly influential, and the political center gradually moved away from Angkor. The transformation was not the result of one sudden catastrophe but a long process involving changing trade patterns, military pressures, dynastic politics, and environmental challenges.

Researchers have investigated how severe droughts and periods of intense monsoon rainfall may have affected Angkor's extensive water infrastructure. Damage to canals and embankments could have made the system more difficult to maintain. Environmental stress was likely one factor among several, and historians continue to examine how these pressures interacted with political and economic developments.

Angkor did not become entirely abandoned. Religious activity continued at important monuments, and the region remained part of Cambodian cultural memory. The history of Khmer civilization extended beyond the decline of its imperial capital, with later Cambodian kingdoms preserving and adapting many traditions.

Today, Angkor's temples are among the most important archaeological and cultural sites in Southeast Asia. They reveal the achievements of Khmer engineers, artists, rulers, and communities, while reminding modern observers that monumental civilizations depend on complex relationships between political power, social organization, the environment, and everyday life.`,
            },
        ],
    },

    {
        title: "The Age of Exploration: Voyages Across the Oceans",
        description:
            "From the fifteenth century onward, European maritime expeditions connected distant parts of the world through new oceanic routes. Driven by commercial ambitions, political competition, religious goals, and navigational developments, these voyages transformed global trade while also initiating conquest, colonization, forced labor, and profound demographic and cultural changes.",
        image: {
            url: "CLOUDINARY_URL_AGE_OF_EXPLORATION",
            publicId: "CLOUDINARY_PUBLIC_ID_AGE_OF_EXPLORATION",
        },
        eraName: "Age of Exploration",
        tags: [
            "Age of Exploration",
            "Maritime History",
            "Portuguese Empire",
            "Christopher Columbus",
            "Vasco da Gama",
            "Global Trade",
            "Colonization",
        ],
        sections: [
            {
                title: "Why European States Sought Oceanic Routes",
                content: `During the fifteenth century, European rulers and merchants increasingly sought direct maritime access to the commercial networks of Africa and Asia. Spices, textiles, precious metals, and other valuable goods moved through extensive trading systems linking the Indian Ocean, the Middle East, the Mediterranean, and Europe. European merchants participated in these networks long before the Age of Exploration, but they often depended on intermediaries and established trading centers.

Political competition encouraged rulers to seek alternative routes and new sources of wealth. Portuguese leaders invested in Atlantic and African voyages, while the Spanish monarchy later sponsored expeditions across the Atlantic. Other European powers eventually entered the competition, creating a wider struggle for commercial access, strategic ports, and overseas territories.

Religious motives also played a role. Some expeditions sought opportunities to spread Christianity or establish alliances against Muslim powers. Yet religious goals were closely connected with political ambitions and commercial interests, and the motivations of explorers, monarchs, merchants, and missionaries were not always identical.

Maritime expansion was made possible by accumulated knowledge from many regions. European sailors drew upon Mediterranean, Arab, African, and Asian navigational traditions, as well as improvements in shipbuilding, cartography, and astronomical navigation. The expansion of oceanic travel was therefore part of a broader history of knowledge exchange rather than a purely European invention.`,
            },
            {
                title: "Portuguese Voyages Along Africa",
                content: `Portugal played an important early role in European Atlantic exploration. During the fifteenth century, Portuguese expeditions traveled progressively farther along the western coast of Africa. These voyages improved European geographic knowledge, established commercial contacts, and created opportunities for Portuguese rulers and merchants to participate directly in Atlantic and African trade.

Portuguese mariners explored Atlantic island groups, including Madeira and the Azores, and developed settlements and plantation economies in some areas. These developments became connected with sugar production and the growth of systems of coerced labor. Portuguese expansion was therefore linked not only to navigation and commerce but also to the development of colonial exploitation.

In 1488, Bartolomeu Dias rounded the southern tip of Africa, demonstrating that the Atlantic and Indian Ocean routes could be connected by sea. In 1497–1498, Vasco da Gama sailed around Africa and reached India, opening a direct maritime connection between Portugal and important Indian Ocean trading centers.

Portuguese activity in the Indian Ocean involved both trade and armed coercion. Portuguese authorities established fortified ports and attempted to control strategic maritime routes, bringing them into competition with established commercial powers. The Indian Ocean was already a highly developed trading world, and Portuguese newcomers had to negotiate, cooperate, and fight within networks they had not created.`,
            },
            {
                title: "Columbus and the Atlantic Crossing",
                content: `In 1492, Christopher Columbus sailed west across the Atlantic under the sponsorship of the Spanish Crown. He hoped to reach Asia by traveling in the opposite direction from the established routes around Africa. His calculations underestimated the size of Earth and did not account for the existence of the American continents as a major obstacle between Europe and Asia.

Columbus reached islands in the Caribbean, where Indigenous peoples had established diverse societies long before European arrival. He initially interpreted his discoveries through the geographical assumptions of his time and continued to believe that he had reached areas near Asia. Subsequent voyages expanded Spanish knowledge of the Caribbean and contributed to the rapid establishment of colonial claims.

The voyages initiated a profound transformation in relations between the peoples of Europe and the Americas. European expeditions brought new goods, animals, crops, diseases, military technologies, and political institutions across the Atlantic. Indigenous communities responded in varied ways, including diplomacy, trade, resistance, adaptation, and alliance with competing European powers.

The consequences were devastating for many Indigenous populations. Epidemic diseases, warfare, forced labor, dispossession, and the disruption of existing societies contributed to catastrophic demographic decline in numerous regions. The history of Atlantic exploration must therefore be understood not simply as a story of navigation, but also as the beginning of an unequal and often violent process of conquest and colonization.`,
            },
            {
                title: "Magellan's Expedition and Global Circumnavigation",
                content: `In 1519, an expedition organized under Ferdinand Magellan's command departed Spain to seek a western route to the Spice Islands of Southeast Asia. The fleet crossed the Atlantic, traveled down the coast of South America, and navigated the difficult strait that later received Magellan's name. It then entered the vast Pacific Ocean, whose scale and challenges were greater than the expedition had anticipated.

The voyage faced hunger, disease, exhaustion, mutiny, and dangerous navigation. Magellan himself was killed in the Philippines in 1521 during a conflict involving local communities. The expedition continued under other commanders, and the ship Victoria eventually returned to Spain in 1522 under Juan Sebastián Elcano's leadership.

The voyage became the first documented circumnavigation of the Earth completed by a surviving expedition. It demonstrated the practical possibility of traveling around the globe by sea and provided new information about the distances between the Atlantic, Pacific, and Indian Oceans. The journey also revealed the enormous logistical challenges involved in sustaining long-distance oceanic voyages.

The expedition was not a simple scientific adventure detached from imperial ambition. It sought access to valuable spice-producing regions and unfolded within a context of European competition for overseas commerce. Its achievements in navigation occurred alongside encounters, conflicts, and colonial ambitions that affected the peoples of the regions through which the expedition traveled.`,
            },
            {
                title: "The Columbian Exchange and a Connected World",
                content: `The expansion of oceanic travel connected the Americas, Europe, Africa, and Asia through increasingly extensive exchanges of plants, animals, people, diseases, and commodities. Historians often describe this transformation as the Columbian Exchange, referring particularly to the movement of species and other biological and cultural elements between the Old World and the Americas after 1492.

Crops originating in the Americas, including potatoes, maize, tomatoes, and cacao, spread to other parts of the world. These foods eventually transformed agricultural systems and diets in many societies. In the opposite direction, Europeans introduced animals such as horses, cattle, and pigs to the Americas, where they altered some Indigenous economies and environments. The effects varied significantly by region.

The exchange also involved devastating consequences. Diseases such as smallpox spread among Indigenous populations that lacked prior exposure to them, contributing to severe mortality. European colonial systems expanded the extraction of land and resources, while the transatlantic slave trade forcibly transported millions of Africans to the Americas under brutal conditions.

Oceanic exploration reshaped global economic and political relationships. Silver from the Americas became part of international trade networks linking Europe with Asia, while colonial ports and plantation economies grew in importance. These developments laid foundations for a more interconnected global economy, but one marked by unequal power, exploitation, resistance, and profound human suffering.`,
            },
        ],
    },
];


const seedArticles = async () => {
    try {
        const missingEras = [
            ...new Set(
                articlesData.map((article) => article.eraName)
            )
        ];

        const eras = await HistoricalEra.find({
            name: { $in: missingEras }
        }).select("_id name");

        const erasMap = new Map(
            eras.map((era) => [era.name, era._id])
        );

        const unresolvedEras = missingEras.filter(
            (eraName) => !erasMap.has(eraName)
        );

        if (unresolvedEras.length > 0) {
            throw new Error(
                `Missing HistoricalEra documents: ${unresolvedEras.join(", ")}. Seed your eras first.`
            );
        }

      

        let created = 0;
        let updated = 0;

        for (const articleData of articlesData) {
            const { eraName, ...article } = articleData;

            const dataToSave = {
                ...article,
                era: erasMap.get(eraName)
            };

            const existingArticle = await Article.findOne({
                title: dataToSave.title
            });

            if (existingArticle) {
                existingArticle.set(dataToSave);
                await existingArticle.save();
                updated++;
            } else {
                await Article.create(dataToSave);
                created++;
            }
        }

        console.log("Articles seed completed successfully.");
        console.log(`Created: ${created}`);
        console.log(`Updated: ${updated}`);
    } catch (error) {
        console.error("Error seeding articles:", error);
        throw error;
    }
};

export default seedArticles;
