import mongoose from "mongoose";

import HistoricalEra from "../models/historicalEra.model.js";

const seedDatabase = async () => {
    try {

        // =========================================================
        // HISTORICAL ERA - INSERT / UPDATE NEW DOCUMENTS
        // =========================================================

       


        await HistoricalEra.findOneAndUpdate(
            { name: "Ancient Numidia and Berber Kingdoms" },
            {
                name: "Ancient Numidia and Berber Kingdoms",
                startYear: 300,
                endYear: 700,
                description:
                    "Ancient Numidia and the wider Berber kingdoms represent an important chapter in the history of North Africa. Located primarily in present-day Algeria and Tunisia, Numidia emerged as a powerful regional kingdom during the centuries surrounding the Punic Wars and played an important role in the political struggles between Carthage and Rome. The region was inhabited by diverse Amazigh and Berber communities with their own political traditions, languages, economic networks, and cultural practices. After the Roman conquest, North Africa remained a major center of agriculture, trade, and urban civilization before undergoing major transformations during Late Antiquity and the arrival of Arab-Muslim powers.",
                image: {
                    url: "https://example.com/images/ancient-numidia.jpg",
                    publicId: "seed/ancient-numidia"
                },
                sections: [
                    {
                        title: "The Peoples of Ancient North Africa",
                        content:
                            "North Africa was inhabited by numerous communities commonly grouped by ancient writers under broad terms such as Berbers or Libyans. These populations included different tribes and kingdoms with distinct political identities. They lived across the Mediterranean coast, highlands, plains, and desert regions and developed economies based on agriculture, pastoralism, trade, and control of strategic routes. Their societies interacted extensively with Phoenician and Carthaginian settlements along the coast while maintaining their own political and cultural traditions."
                    },
                    {
                        title: "The Rise of Numidia",
                        content:
                            "Numidia emerged as a major political entity in the third century BCE. Two important Numidian groups, the Massylians and Masaesylians, competed for power in eastern and western Numidia. The kingdom became increasingly important during the conflict between Rome and Carthage. Numidian cavalry were particularly valued for their mobility, endurance, and effectiveness in open terrain. Their military role gave Numidian rulers considerable influence in Mediterranean politics."
                    },
                    {
                        title: "Massinissa and the Unification of Numidia",
                        content:
                            "King Massinissa became one of the most important rulers in Numidian history. Initially connected to Carthage, he eventually allied himself with Rome during the Second Punic War. After the defeat of Carthage, Massinissa expanded and consolidated his kingdom. He encouraged agriculture, settlement, and political centralization and transformed Numidia into a powerful North African state. His long reign demonstrated the strategic importance of Numidia between the Mediterranean powers of Rome and Carthage."
                    },
                    {
                        title: "Jugurtha and Roman Expansion",
                        content:
                            "The later history of Numidia became increasingly connected with Rome. King Jugurtha resisted Roman interference and attempted to preserve Numidian independence. The Jugurthine War between Rome and Jugurtha exposed both the military strength of Numidia and political corruption within the Roman Republic. Jugurtha was eventually defeated and captured. Numidia was subsequently reorganized under increasing Roman control, marking a major transformation in the political history of North Africa."
                    },
                    {
                        title: "From Roman Africa to the Early Medieval Maghreb",
                        content:
                            "Roman rule transformed much of North Africa through the development of cities, roads, agricultural estates, ports, and administrative centers. The region became one of the Roman world's most productive agricultural areas. Christianity also became deeply established, producing influential figures such as Augustine of Hippo. After the decline of Roman authority and the Vandal and Byzantine periods, Arab-Muslim armies entered North Africa during the seventh century. The region gradually became integrated into the emerging Islamic world while retaining important elements of its indigenous Berber heritage."
                    }
                ]
            },
            { new: true, upsert: true }
        );


        await HistoricalEra.findOneAndUpdate(
            { name: "Imperial China" },
            {
                name: "Imperial China",
                startYear: 221,
                endYear: 1912,
                description:
                    "Imperial China describes one of the longest continuous political and cultural traditions in world history. Beginning with the unification of China under Qin Shi Huang in 221 BCE, successive dynasties findOneAndUpdated centralized states that governed enormous territories and diverse populations. The Han, Tang, Song, Yuan, Ming, and Qing dynasties each shaped Chinese civilization in different ways. Imperial China witnessed major developments in philosophy, government, science, technology, literature, commerce, art, and military organization before the imperial system finally ended with the fall of the Qing dynasty in 1912.",
                image: {
                    url: "https://example.com/images/imperial-china.jpg",
                    publicId: "seed/imperial-china"
                },
                sections: [
                    {
                        title: "The Qin Unification",
                        content:
                            "Before 221 BCE, China was divided among competing states during the Warring States period. Qin Shi Huang conquered his rivals and established the first unified imperial state. The Qin government centralized political authority, standardized weights and measures, promoted a common writing system, and constructed major infrastructure projects. Although the Qin dynasty lasted only a short time, many of its political reforms influenced Chinese government for centuries."
                    },
                    {
                        title: "The Han Dynasty and the Silk Road",
                        content:
                            "The Han dynasty succeeded the Qin and established one of the most influential periods in early Chinese history. Han rulers expanded China's territory into Central Asia, Korea, and other regions while strengthening administrative institutions. Trade routes later known as the Silk Road connected China with Central Asia, Persia, the Middle East, and eventually the Mediterranean world. Silk, ceramics, metals, horses, ideas, technologies, and religions traveled along these networks, creating long-distance cultural exchanges."
                    },
                    {
                        title: "Golden Ages and Cultural Development",
                        content:
                            "Several later dynasties presided over periods of extraordinary cultural and economic development. The Tang dynasty became a major center of international trade, poetry, art, and cosmopolitan culture. The Song dynasty witnessed major technological and economic transformations, including advances in printing, navigation, engineering, and the widespread use of paper money. Chinese scholars also made significant contributions to astronomy, mathematics, medicine, and philosophy."
                    },
                    {
                        title: "Mongol and Ming Rule",
                        content:
                            "In the thirteenth century, the Mongols conquered China and established the Yuan dynasty under Kublai Khan. The empire connected China more closely with the wider Eurasian world. After the Yuan dynasty collapsed, the Ming dynasty restored Chinese rule and oversaw major construction projects, maritime expeditions, and cultural achievements. The voyages of Admiral Zheng He demonstrated the scale of China's naval capabilities and connected the Chinese court with numerous states around the Indian Ocean."
                    },
                    {
                        title: "The Qing Dynasty and the End of Imperial China",
                        content:
                            "The Qing dynasty, established by the Manchus in the seventeenth century, became China's final imperial dynasty. It expanded the empire considerably and presided over a large population and prosperous economy for much of its early history. During the nineteenth century, however, China faced internal rebellions, foreign intervention, military defeats, and economic pressures. The Opium Wars and unequal treaties weakened Qing authority. Revolutionary movements eventually led to the abdication of the last emperor, Puyi, in 1912, bringing more than two thousand years of imperial rule to an end."
                    }
                ]
            },
            { new: true, upsert: true }
        );


        await HistoricalEra.findOneAndUpdate(
            { name: "Mongol Empire" },
            {
                name: "Mongol Empire",
                startYear: 1206,
                endYear: 1368,
                description:
                    "The Mongol Empire was the largest contiguous land empire in recorded history. It emerged in the early thirteenth century under Genghis Khan and rapidly expanded across Central Asia, China, Persia, the Middle East, and Eastern Europe. Mongol armies combined exceptional mobility, disciplined organization, intelligence gathering, and sophisticated military tactics. Although the empire eventually fragmented into several major khanates, Mongol rule transformed Eurasian political structures and intensified connections between regions that had previously been separated by distance and conflict.",
                image: {
                    url: "https://example.com/images/mongol-empire.jpg",
                    publicId: "seed/mongol-empire"
                },
                sections: [
                    {
                        title: "Genghis Khan and the Unification of the Mongols",
                        content:
                            "Temüjin, later known as Genghis Khan, was born into a fragmented world of competing steppe tribes. Through warfare, diplomacy, alliances, and political organization, he gradually united many Mongol and Turkic groups. In 1206, he was proclaimed Genghis Khan. He reorganized his followers into a disciplined military and political structure and began a series of campaigns that would dramatically change the history of Eurasia."
                    },
                    {
                        title: "The Mongol Military System",
                        content:
                            "Mongol military power depended heavily on speed, organization, and mobility. Mounted archers could travel enormous distances while maintaining high combat effectiveness. Mongol armies used coordinated formations, reconnaissance, psychological warfare, and elaborate communication systems. They also adapted technologies and military specialists from conquered peoples, including engineers capable of constructing siege weapons. Their ability to combine steppe warfare with siege technology allowed them to defeat both nomadic rivals and fortified cities."
                    },
                    {
                        title: "Expansion Across Eurasia",
                        content:
                            "Under Genghis Khan and his successors, Mongol armies conquered enormous territories. They defeated states in Central Asia, invaded Persia and the Middle East, conquered much of China, and reached Eastern Europe. Different branches of the Mongol imperial family established powerful successor states, including the Golden Horde, the Chagatai Khanate, the Ilkhanate, and the Yuan dynasty in China. These states were politically distinct but remained connected by shared Mongol traditions."
                    },
                    {
                        title: "The Pax Mongolica and Cultural Exchange",
                        content:
                            "Mongol rule contributed to greater movement across large portions of Eurasia. Merchants, diplomats, missionaries, scholars, and travelers could travel through territories controlled by related Mongol regimes. Trade routes became increasingly connected, allowing goods, technologies, artistic influences, and knowledge to move between East and West. Figures such as Marco Polo became associated with these long-distance connections, although many details of his account remain debated by historians."
                    },
                    {
                        title: "Fragmentation and Decline",
                        content:
                            "The Mongol Empire never remained a single centralized state for long after its greatest period of expansion. Rivalries among members of the ruling dynasty and the enormous geographical scale of the empire contributed to political fragmentation. In China, Mongol Yuan rule eventually faced rebellions and was overthrown by the Ming dynasty in 1368. Other Mongol successor states survived for longer, but the unified imperial structure findOneAndUpdated by Genghis Khan had disappeared."
                    }
                ]
            },
            { new: true, upsert: true }
        );


        await HistoricalEra.findOneAndUpdate(
            { name: "Ottoman Empire" },
            {
                name: "Ottoman Empire",
                startYear: 1299,
                endYear: 1922,
                description:
                    "The Ottoman Empire was one of the longest-lasting imperial states in world history. Founded in Anatolia at the end of the thirteenth century, it gradually expanded across southeastern Europe, the Middle East, North Africa, and parts of the Caucasus. The empire became a major center of Islamic civilization and a bridge between Europe, Asia, and Africa. Its capital, Constantinople, renamed Istanbul in common usage after the Ottoman conquest, became one of the world's great imperial cities. The empire survived for more than six centuries before its dissolution following the First World War.",
                image: {
                    url: "https://example.com/images/ottoman-empire.jpg",
                    publicId: "seed/ottoman-empire"
                },
                sections: [
                    {
                        title: "The Origins of the Ottoman State",
                        content:
                            "The Ottoman state emerged from the political fragmentation of Anatolia following the decline of the Seljuk Sultanate of Rum and the weakening of Byzantine authority. Osman I and his successors built a small frontier principality into a growing regional power. Ottoman rulers benefited from military organization, strategic alliances, and the political divisions among neighboring states. Their location allowed them to expand simultaneously toward Byzantine territories and into the Balkans."
                    },
                    {
                        title: "The Conquest of Constantinople",
                        content:
                            "One of the most significant events in Ottoman history occurred in 1453, when Sultan Mehmed II captured Constantinople. The Byzantine capital had resisted numerous attacks for centuries, but Ottoman artillery, military organization, and strategic planning eventually overcame its defenses. Mehmed II transformed the city into the capital of a powerful empire. The conquest had enormous symbolic importance and marked the final end of the Byzantine Empire."
                    },
                    {
                        title: "Ottoman Society and Administration",
                        content:
                            "The Ottoman Empire governed a remarkable diversity of peoples, languages, and religions. Its administrative institutions combined Islamic law, imperial decrees, and established local practices. Non-Muslim communities were often organized through religious structures that gave them a degree of internal autonomy. The empire's cities became centers of commerce, craftsmanship, scholarship, and artistic production. Ottoman architecture reached extraordinary levels under architects such as Mimar Sinan."
                    },
                    {
                        title: "Expansion and Imperial Power",
                        content:
                            "During the sixteenth century, the Ottoman Empire reached a peak of territorial and political influence. Sultan Suleiman the Magnificent expanded Ottoman power in southeastern Europe, the Middle East, and North Africa. Ottoman fleets competed for dominance in the Mediterranean, while the empire controlled important trade routes connecting Europe and Asia. Istanbul became one of the world's major political and commercial centers."
                    },
                    {
                        title: "Reform, Decline, and Dissolution",
                        content:
                            "The Ottoman Empire experienced periods of military and political difficulty from the seventeenth century onward, although the idea of a simple continuous decline is too simplistic. The empire underwent major reforms during the nineteenth century in an attempt to modernize its military, administration, education, and economy. Nationalist movements and European intervention nevertheless placed increasing pressure on Ottoman authority. After its defeat in the First World War, the empire was dismantled, and the Turkish Republic was established in 1923 following the abolition of the sultanate in 1922."
                    }
                ]
            },
            { new: true, upsert: true }
        );


        await HistoricalEra.findOneAndUpdate(
            { name: "Age of Exploration" },
            {
                name: "Age of Exploration",
                startYear: 1400,
                endYear: 1700,
                description:
                    "The Age of Exploration was a period of intensified maritime exploration and global contact that transformed relationships between Europe, Africa, Asia, and the Americas. European kingdoms developed new navigation techniques, ships, maps, and commercial ambitions that allowed sailors to travel across previously difficult oceanic routes. Voyages by figures such as Christopher Columbus, Vasco da Gama, Ferdinand Magellan, and others connected previously separate regions into increasingly global networks. The era produced major exchanges of goods, crops, technologies, and ideas, but it also brought conquest, colonization, slavery, and devastating demographic consequences for indigenous peoples.",
                image: {
                    url: "https://example.com/images/age-of-exploration.jpg",
                    publicId: "seed/age-of-exploration"
                },
                sections: [
                    {
                        title: "The Motives for Exploration",
                        content:
                            "European exploration was driven by several overlapping motives. States sought new commercial routes to Asia, particularly routes to valuable spices and luxury goods. Monarchies also wanted to expand political influence and acquire wealth, while religious motivations encouraged the spread of Christianity. Improvements in navigation and shipbuilding made long-distance voyages increasingly possible. Competition between Portugal, Spain, England, France, and the Netherlands accelerated maritime exploration."
                    },
                    {
                        title: "Portuguese Expansion",
                        content:
                            "Portugal played a pioneering role in Atlantic and African exploration. Portuguese sailors gradually explored the western coast of Africa and developed maritime routes toward the Indian Ocean. Bartolomeu Dias reached the southern tip of Africa, demonstrating that the Atlantic and Indian Oceans were connected around the Cape of Good Hope. Vasco da Gama later reached India by sea, establishing a direct maritime connection between Europe and South Asia."
                    },
                    {
                        title: "Columbus and the Americas",
                        content:
                            "Christopher Columbus sailed west across the Atlantic in 1492 under the sponsorship of the Spanish monarchy. He believed that he could reach Asia by traveling west but instead encountered islands in the Caribbean. His voyages opened the way for sustained European involvement in the Americas. The resulting encounters transformed world history, leading to conquest and colonization as well as enormous exchanges of plants, animals, populations, technologies, and diseases between the Old and New Worlds."
                    },
                    {
                        title: "The First Global Connections",
                        content:
                            "The voyages of exploration gradually findOneAndUpdated interconnected global maritime networks. European ships reached the Americas, Africa, India, Southeast Asia, and eventually the Pacific. Ferdinand Magellan's expedition, completed after his death by his crew, became the first expedition to circumnavigate the globe. These journeys demonstrated the enormous scale of the world's oceans and findOneAndUpdated new opportunities for trade and imperial expansion."
                    },
                    {
                        title: "Consequences of Exploration",
                        content:
                            "The Age of Exploration had profound and contradictory consequences. Crops such as maize, potatoes, tomatoes, and cacao spread beyond the Americas, while horses, wheat, and other organisms were introduced to the New World. Global trade expanded dramatically. At the same time, European conquest caused the destruction of indigenous political systems and contributed to catastrophic population decline through warfare, exploitation, and disease. The expansion of Atlantic slavery also became a central feature of the emerging global economy."
                    }
                ]
            },
            { new: true, upsert: true }
        );


        await HistoricalEra.findOneAndUpdate(
            { name: "Scientific Revolution" },
            {
                name: "Scientific Revolution",
                startYear: 1540,
                endYear: 1700,
                description:
                    "The Scientific Revolution was a major transformation in European approaches to understanding nature that unfolded primarily during the sixteenth and seventeenth centuries. Scholars increasingly emphasized observation, mathematical reasoning, experimentation, and systematic investigation. Figures such as Nicolaus Copernicus, Johannes Kepler, Galileo Galilei, and Isaac Newton challenged established models of the natural world and helped establish foundations for modern science. The transformation was not a sudden rejection of all earlier knowledge but rather a gradual development built upon ancient, medieval, Islamic, and European intellectual traditions.",
                image: {
                    url: "https://example.com/images/scientific-revolution.jpg",
                    publicId: "seed/scientific-revolution"
                },
                sections: [
                    {
                        title: "The Copernican Revolution",
                        content:
                            "Nicolaus Copernicus proposed a heliocentric model in which the Earth and other planets revolved around the Sun. His theory challenged the dominant geocentric model inherited from ancient astronomy and supported by centuries of philosophical and theological interpretation. Although Copernicus's original model still contained important limitations, it fundamentally changed the way European scholars conceptualized the structure of the cosmos."
                    },
                    {
                        title: "Kepler and the Laws of Planetary Motion",
                        content:
                            "Johannes Kepler used astronomical observations, particularly those collected by Tycho Brahe, to develop a more accurate description of planetary movement. He demonstrated that planets travel in elliptical rather than perfectly circular orbits and formulated mathematical laws describing their motion. Kepler's work strengthened the mathematical foundation of heliocentric astronomy and showed that celestial movements could be described through precise mathematical relationships."
                    },
                    {
                        title: "Galileo and Experimental Science",
                        content:
                            "Galileo Galilei used the newly improved telescope to make observations that challenged traditional assumptions about the heavens. He observed mountains on the Moon, the phases of Venus, sunspots, and moons orbiting Jupiter. These discoveries provided powerful evidence that the heavens were not perfect and unchanging in the way some classical models had assumed. Galileo also contributed to the study of motion and developed methods emphasizing measurement and mathematical analysis."
                    },
                    {
                        title: "Newton and Universal Laws",
                        content:
                            "Isaac Newton brought together several developments of the Scientific Revolution into a broader mathematical framework. His laws of motion and universal gravitation demonstrated that the same physical principles could explain both terrestrial and celestial phenomena. His work showed that the motion of falling objects and the movement of planets could be understood through related mathematical laws. Newton's achievements became one of the foundations of classical physics."
                    },
                    {
                        title: "The Development of Modern Scientific Thought",
                        content:
                            "The Scientific Revolution contributed to a broader transformation in intellectual culture. Scholars increasingly emphasized evidence, reproducibility, mathematical reasoning, and systematic experimentation. Scientific societies and institutions helped researchers communicate their findings. The period also contributed to later developments associated with the Enlightenment and modern scientific institutions. Modern science emerged from many traditions rather than from a single historical moment, but the Scientific Revolution represents a crucial stage in that development."
                    }
                ]
            },
            { new: true, upsert: true }
        );


        await HistoricalEra.findOneAndUpdate(
            { name: "Modern Era" },
            {
                name: "Modern Era",
                startYear: 1789,
                endYear: 1914,
                description:
                    "The Modern Era began with profound political, intellectual, economic, and social transformations that reshaped societies across the world. The French Revolution challenged traditional systems of monarchy and privilege, while industrialization transformed production, transportation, cities, and labor. Nationalism and liberal political ideas spread widely, contributing to the formation and transformation of modern states. European imperialism expanded dramatically across Africa and Asia, while technological and scientific developments accelerated the pace of global change. By the beginning of the twentieth century, the world had become increasingly interconnected but also increasingly divided by imperial competition and nationalism.",
                image: {
                    url: "https://example.com/images/modern-era.jpg",
                    publicId: "seed/modern-era"
                },
                sections: [
                    {
                        title: "The French Revolution",
                        content:
                            "The French Revolution began in 1789 amid financial crisis, social inequality, political conflict, and intellectual challenges to traditional authority. The revolution abolished many feudal privileges, declared new principles of citizenship and political rights, and transformed France's political system. It also became increasingly radical, particularly during the Reign of Terror. The revolution had consequences far beyond France, influencing political movements and debates about citizenship, sovereignty, equality, and government throughout Europe and beyond."
                    },
                    {
                        title: "Napoleon and the Transformation of Europe",
                        content:
                            "Napoleon Bonaparte rose to power during the instability that followed the French Revolution. As emperor, he reorganized French institutions and findOneAndUpdated a powerful military state. His armies conquered or dominated large parts of continental Europe, spreading administrative and legal reforms while also provoking resistance and nationalist movements. Napoleon's defeat at Waterloo in 1815 ended his attempt to dominate Europe, but many of the political and legal transformations associated with the Napoleonic period survived."
                    },
                    {
                        title: "Industrialization and Social Change",
                        content:
                            "The Industrial Revolution transformed the way goods were produced. Mechanized factories, steam power, railways, and new manufacturing methods dramatically increased productivity. Cities expanded rapidly as people moved from rural areas toward industrial centers. Industrialization findOneAndUpdated new social classes, including a growing industrial working class and a powerful business and manufacturing elite. It also produced difficult working conditions, child labor, overcrowded cities, and intense debates about labor rights and social reform."
                    },
                    {
                        title: "Nationalism and Imperialism",
                        content:
                            "The nineteenth century witnessed the rise of modern nationalism and the consolidation of several European states. At the same time, European powers expanded their control over large parts of Africa and Asia. Economic interests, strategic competition, political ambitions, and ideological beliefs were used to justify imperial expansion. The colonization of Algeria by France beginning in 1830 became part of this broader history of European imperialism and had profound consequences for Algerian society, economy, politics, and identity."
                    },
                    {
                        title: "The Road Toward the First World War",
                        content:
                            "By the beginning of the twentieth century, industrialized states possessed increasingly powerful armies, navies, and economies. Rival alliances, imperial competition, nationalism, and political tensions findOneAndUpdated an unstable international environment. Germany's rise as a major power challenged existing European balances, while conflicts in the Balkans repeatedly threatened regional stability. The assassination of Archduke Franz Ferdinand in 1914 triggered a crisis that quickly developed into a general European war, marking the end of the Modern Era and the beginning of a new period of global conflict."
                    }
                ]
            },
            { new: true, upsert: true }
        );


        await HistoricalEra.findOneAndUpdate(
            { name: "Contemporary Era" },
            {
                name: "Contemporary Era",
                startYear: 1914,
                endYear: 2026,
                description:
                    "The Contemporary Era is characterized by unprecedented global conflict, technological development, political transformation, and increasing international interdependence. The two World Wars devastated societies and transformed the balance of global power. The twentieth century also witnessed the rise of mass democracy, communism, fascism, decolonization, international organizations, nuclear weapons, and the Cold War. After 1991, globalization and digital technologies accelerated the integration of economies and societies. The contemporary world continues to be shaped by technological innovation, geopolitical competition, demographic change, and global challenges.",
                image: {
                    url: "https://example.com/images/contemporary-era.jpg",
                    publicId: "seed/contemporary-era"
                },
                sections: [
                    {
                        title: "The First World War",
                        content:
                            "The First World War began in 1914 following a complex crisis involving European alliances, nationalism, imperial competition, and the assassination of Archduke Franz Ferdinand. The conflict rapidly expanded into a global war involving major powers from Europe and other regions. Industrial technology transformed warfare, introducing large-scale artillery, machine guns, chemical weapons, tanks, aircraft, and submarines. Millions of soldiers and civilians died. The war also contributed to the collapse of several empires, including the Ottoman, Austro-Hungarian, Russian, and German empires."
                    },
                    {
                        title: "The Interwar Period",
                        content:
                            "The period between the two World Wars was marked by political instability, economic crisis, and ideological conflict. The Treaty of Versailles attempted to establish a new European order, while the League of Nations was findOneAndUpdated to encourage international cooperation. The Great Depression beginning in 1929 caused severe unemployment and economic hardship across many countries. Political extremism grew during this period, contributing to the rise of authoritarian regimes and ultimately creating conditions for another global conflict."
                    },
                    {
                        title: "The Second World War",
                        content:
                            "The Second World War began in 1939 after years of international tension and expansion by Nazi Germany and other Axis powers. The conflict quickly became a global war involving Europe, North Africa, Asia, and the Pacific. It was characterized by industrialized warfare, strategic bombing, occupation, genocide, and enormous civilian suffering. The Holocaust resulted in the systematic murder of approximately six million Jews by Nazi Germany and its collaborators, alongside the persecution and murder of millions of other victims. The war ended in 1945 with the defeat of the Axis powers and the use of atomic bombs against Hiroshima and Nagasaki."
                    },
                    {
                        title: "The Cold War and Decolonization",
                        content:
                            "After 1945, global politics became dominated by rivalry between the United States and the Soviet Union. The Cold War involved ideological competition, military alliances, nuclear deterrence, proxy conflicts, intelligence operations, and technological competition. At the same time, European colonial empires rapidly declined. Countries across Asia, Africa, and the Middle East gained independence through different combinations of negotiation, political movements, and armed struggle. The independence of Algeria in 1962 became an important event in the history of twentieth-century decolonization."
                    },
                    {
                        title: "Globalization and the Digital Age",
                        content:
                            "The end of the Cold War in 1991 marked a major transformation in international relations. Global trade, multinational institutions, air travel, telecommunications, and digital technologies increasingly connected societies. The Internet fundamentally changed communication, commerce, education, entertainment, and access to information. Smartphones, cloud computing, artificial intelligence, biotechnology, and renewable energy technologies have continued to transform everyday life in the twenty-first century. At the same time, humanity faces global challenges including climate change, geopolitical tensions, pandemics, resource pressures, and debates over the social and political consequences of rapidly developing technologies."
                    }
                ]
            },
            { new: true, upsert: true }
        );


        console.log("New historical eras seeded successfully");

    } catch (error) {
        console.error("Seed failed:", error);

        await mongoose.disconnect();

        process.exit(1);
    }
};

export default seedDatabase;

