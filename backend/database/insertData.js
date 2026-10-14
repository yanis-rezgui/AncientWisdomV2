
import LocationChallenge from "../models/Games/locationChallenge.model.js";

const locationChallengesData = [
    // 1–10: Easy
    {
        title: "The Great Pyramid of Giza",
        slug: "great-pyramid-giza-location",
        question: "Where is the Great Pyramid of Giza located?",
        answer: "Giza, Egypt",
        coordinates: { latitude: 29.9792, longitude: 31.1342 },
        mapZoom: 5,
        hint: "Look near the Nile River, close to modern Cairo.",
        explanation:
            "The Great Pyramid of Giza was built for Pharaoh Khufu during the Fourth Dynasty of ancient Egypt, around the 26th century BCE. It is the largest of the three pyramids at Giza.",
        difficulty: "Easy",
        points: 100,
    },
    {
        title: "The Colosseum",
        slug: "colosseum-rome-location",
        question: "Where can you find the Colosseum?",
        answer: "Rome, Italy",
        coordinates: { latitude: 41.8902, longitude: 12.4922 },
        mapZoom: 5,
        hint: "Look in the capital of the ancient Roman Empire.",
        explanation:
            "The Colosseum is a large amphitheater in Rome, inaugurated in the first century CE. It hosted gladiatorial contests and other public spectacles.",
        difficulty: "Easy",
        points: 100,
    },
    {
        title: "The Parthenon",
        slug: "parthenon-athens-location",
        question: "In which city does the Parthenon stand?",
        answer: "Athens, Greece",
        coordinates: { latitude: 37.9715, longitude: 23.7267 },
        mapZoom: 5,
        hint: "This city was a major center of ancient Greek democracy and philosophy.",
        explanation:
            "The Parthenon stands on the Acropolis of Athens. Built in the fifth century BCE, it was dedicated to Athena, the city's patron goddess.",
        difficulty: "Easy",
        points: 100,
    },
    {
        title: "Stonehenge",
        slug: "stonehenge-england-location",
        question: "Where is the prehistoric monument of Stonehenge?",
        answer: "Wiltshire, England, United Kingdom",
        coordinates: { latitude: 51.1789, longitude: -1.8262 },
        mapZoom: 5,
        hint: "Look in southern Great Britain, west of London.",
        explanation:
            "Stonehenge is a prehistoric stone circle in Wiltshire, England. It was constructed in several phases during the Neolithic and Bronze Ages.",
        difficulty: "Easy",
        points: 100,
    },
    {
        title: "Machu Picchu",
        slug: "machu-picchu-peru-location",
        question: "Where is the Inca site of Machu Picchu?",
        answer: "Cusco Region, Peru",
        coordinates: { latitude: -13.1631, longitude: -72.5450 },
        mapZoom: 4,
        hint: "Look in the Andes Mountains of western South America.",
        explanation:
            "Machu Picchu is an Inca archaeological site in the Andes of Peru. Built in the fifteenth century, it is associated with the Inca ruler Pachacuti.",
        difficulty: "Easy",
        points: 100,
    },
    {
        title: "The Taj Mahal",
        slug: "taj-mahal-agra-location",
        question: "In which Indian city is the Taj Mahal located?",
        answer: "Agra, India",
        coordinates: { latitude: 27.1751, longitude: 78.0421 },
        mapZoom: 4,
        hint: "Look in northern India, south of Delhi.",
        explanation:
            "The Mughal emperor Shah Jahan commissioned the Taj Mahal in memory of his wife Mumtaz Mahal. Construction began in 1632.",
        difficulty: "Easy",
        points: 100,
    },
    {
        title: "The Great Wall of China",
        slug: "great-wall-mutianyu-location",
        question: "In which country can you visit the Great Wall?",
        answer: "China",
        coordinates: { latitude: 40.4319, longitude: 116.5704 },
        mapZoom: 4,
        hint: "Look in East Asia, west of the Korean Peninsula.",
        explanation:
            "The Great Wall is a network of fortifications built and rebuilt over many centuries to defend Chinese states and empires. These coordinates indicate the Mutianyu section near Beijing.",
        difficulty: "Easy",
        points: 100,
    },
    {
        title: "The Statue of Liberty",
        slug: "statue-of-liberty-new-york-location",
        question: "Where does the Statue of Liberty stand?",
        answer: "New York Harbor, United States",
        coordinates: { latitude: 40.6892, longitude: -74.0445 },
        mapZoom: 5,
        hint: "Look on the northeastern coast of the United States.",
        explanation:
            "The Statue of Liberty was dedicated in 1886. France gifted the monument to the United States, and it became a symbol of liberty and immigration.",
        difficulty: "Easy",
        points: 100,
    },
    {
        title: "The Eiffel Tower",
        slug: "eiffel-tower-paris-location",
        question: "In which city was the Eiffel Tower built?",
        answer: "Paris, France",
        coordinates: { latitude: 48.8584, longitude: 2.2945 },
        mapZoom: 5,
        hint: "Look in western Europe, in the capital of France.",
        explanation:
            "Designed by Gustave Eiffel's engineering company, the tower was completed for the 1889 World's Fair in Paris.",
        difficulty: "Easy",
        points: 100,
    },
    {
        title: "The Pyramids of Teotihuacan",
        slug: "teotihuacan-mexico-location",
        question: "Where are the Pyramid of the Sun and Pyramid of the Moon?",
        answer: "Teotihuacan, Mexico",
        coordinates: { latitude: 19.6925, longitude: -98.8438 },
        mapZoom: 5,
        hint: "Look northeast of Mexico City.",
        explanation:
            "Teotihuacan was a major Mesoamerican city that flourished centuries before the Aztec Empire. Its monumental pyramids remain among the most famous archaeological structures in Mexico.",
        difficulty: "Easy",
        points: 100,
    },

    // 11–20: Medium
    {
        title: "Ancient Babylon",
        slug: "ancient-babylon-iraq-location",
        question: "Where was the ancient city of Babylon located?",
        answer: "Near Hillah, Iraq",
        coordinates: { latitude: 32.5364, longitude: 44.4200 },
        mapZoom: 5,
        hint: "Look in Mesopotamia, between the Tigris and Euphrates regions.",
        explanation:
            "Babylon was one of the most important cities of ancient Mesopotamia. It flourished especially under rulers such as Hammurabi and Nebuchadnezzar II.",
        difficulty: "Medium",
        points: 150,
    },
    {
        title: "Carthage",
        slug: "ancient-carthage-tunisia-location",
        question: "Where was the ancient city of Carthage established?",
        answer: "Near Tunis, Tunisia",
        coordinates: { latitude: 36.8528, longitude: 10.3233 },
        mapZoom: 5,
        hint: "Look along the southern shore of the Mediterranean Sea.",
        explanation:
            "Carthage was a powerful Phoenician-founded city in North Africa. It became Rome's major rival during the Punic Wars.",
        difficulty: "Medium",
        points: 150,
    },
    {
        title: "The Battle of Marathon",
        slug: "battle-marathon-greece-location",
        question: "Where did the Athenians fight the Persians at Marathon?",
        answer: "Marathon, Greece",
        coordinates: { latitude: 38.1530, longitude: 24.0000 },
        mapZoom: 6,
        hint: "Look northeast of Athens, near the coast of Attica.",
        explanation:
            "In 490 BCE, an Athenian-led Greek force defeated a Persian expeditionary army near Marathon. The battle became a celebrated event in Greek history.",
        difficulty: "Medium",
        points: 150,
    },
    {
        title: "The Battle of Waterloo",
        slug: "battle-waterloo-belgium-location",
        question: "Where was Napoleon finally defeated in 1815?",
        answer: "Near Waterloo, Belgium",
        coordinates: { latitude: 50.6800, longitude: 4.4120 },
        mapZoom: 6,
        hint: "Look south of Brussels.",
        explanation:
            "The Battle of Waterloo took place on 18 June 1815. Napoleon's French army was defeated by allied forces led by the Duke of Wellington and Gebhard Leberecht von Blücher.",
        difficulty: "Medium",
        points: 150,
    },
    {
        title: "The Battle of Actium",
        slug: "battle-actium-greece-location",
        question: "Where did Octavian defeat the forces of Antony and Cleopatra?",
        answer: "Near Actium, Greece",
        coordinates: { latitude: 38.9550, longitude: 20.7500 },
        mapZoom: 6,
        hint: "Look on the western coast of Greece, near the entrance to the Ambracian Gulf.",
        explanation:
            "The naval Battle of Actium in 31 BCE helped Octavian defeat Mark Antony and Cleopatra. Octavian later became Augustus, the first Roman emperor.",
        difficulty: "Medium",
        points: 150,
    },
    {
        title: "Pompeii",
        slug: "pompeii-italy-location",
        question: "Where was the Roman city buried by the eruption of Mount Vesuvius?",
        answer: "Near Naples, Italy",
        coordinates: { latitude: 40.7485, longitude: 14.4840 },
        mapZoom: 6,
        hint: "Look near the Bay of Naples in southern Italy.",
        explanation:
            "Pompeii was buried during the eruption of Mount Vesuvius in 79 CE. Volcanic material preserved buildings, objects and casts of some victims.",
        difficulty: "Medium",
        points: 150,
    },
    {
        title: "The Oracle of Delphi",
        slug: "oracle-delphi-greece-location",
        question: "Where did ancient Greeks consult the famous oracle of Apollo?",
        answer: "Delphi, Greece",
        coordinates: { latitude: 38.4824, longitude: 22.5010 },
        mapZoom: 6,
        hint: "Look on the slopes of Mount Parnassus in central Greece.",
        explanation:
            "Delphi was a major religious sanctuary dedicated to Apollo. The oracle was consulted by individuals and communities seeking divine guidance.",
        difficulty: "Medium",
        points: 150,
    },
    {
        title: "Persepolis",
        slug: "persepolis-iran-location",
        question: "Where are the ruins of the ceremonial capital of the Achaemenid Persian Empire?",
        answer: "Near Shiraz, Iran",
        coordinates: { latitude: 29.9352, longitude: 52.8916 },
        mapZoom: 5,
        hint: "Look in southwestern Iran, in the historic region of Fars.",
        explanation:
            "Persepolis was a ceremonial center of the Achaemenid Empire, expanded by Darius I and his successors. Alexander the Great's forces captured and burned parts of it in 330 BCE.",
        difficulty: "Medium",
        points: 150,
    },
    {
        title: "The Terracotta Army",
        slug: "terracotta-army-xian-location",
        question: "Where was the Terracotta Army discovered?",
        answer: "Near Xi'an, China",
        coordinates: { latitude: 34.3841, longitude: 109.2785 },
        mapZoom: 5,
        hint: "Look in central China, in Shaanxi Province.",
        explanation:
            "The Terracotta Army was created to accompany the burial complex of Qin Shi Huang, the first emperor to unify China. It was discovered by farmers in 1974.",
        difficulty: "Medium",
        points: 150,
    },
    {
        title: "The Alhambra",
        slug: "alhambra-granada-spain-location",
        question: "In which city is the Alhambra palace complex?",
        answer: "Granada, Spain",
        coordinates: { latitude: 37.1761, longitude: -3.5881 },
        mapZoom: 5,
        hint: "Look in Andalusia, in southern Spain.",
        explanation:
            "The Alhambra is a palace and fortress complex associated especially with the Nasrid rulers of Granada. Its architecture reflects the history of Islamic rule in Iberia.",
        difficulty: "Medium",
        points: 150,
    },

    // 21–30: Hard
    {
        title: "The Ancient City of Hattusa",
        slug: "hattusa-turkey-location",
        question: "Where was the capital of the Hittite Empire?",
        answer: "Near Boğazkale, Turkey",
        coordinates: { latitude: 40.0194, longitude: 34.6156 },
        mapZoom: 6,
        hint: "Look in central Anatolia, east of Ankara.",
        explanation:
            "Hattusa was the capital of the Hittite Empire during the Late Bronze Age. Its ruins include monumental gates, temples and fortifications.",
        difficulty: "Hard",
        points: 200,
    },
    {
        title: "The Battle of Gaugamela",
        slug: "battle-gaugamela-iraq-location",
        question: "Where did Alexander the Great defeat Darius III in 331 BCE?",
        answer: "Near modern-day Mosul, Iraq",
        coordinates: { latitude: 36.3600, longitude: 43.2500 },
        mapZoom: 5,
        hint: "Look in northern Mesopotamia, near the Tigris River.",
        explanation:
            "At Gaugamela, Alexander's army defeated the Persian forces of Darius III. The battle was decisive in Alexander's conquest of the Achaemenid Empire.",
        difficulty: "Hard",
        points: 200,
    },
    {
        title: "The Battle of Cannae",
        slug: "battle-cannae-italy-location",
        question: "Where did Hannibal win his famous victory over Rome in 216 BCE?",
        answer: "Near Cannae, Apulia, Italy",
        coordinates: { latitude: 41.3060, longitude: 16.1320 },
        mapZoom: 6,
        hint: "Look in southeastern Italy, in the region of Apulia.",
        explanation:
            "During the Second Punic War, Hannibal's army surrounded and devastated a much larger Roman force at Cannae. The battle is still studied for its double-envelopment tactic.",
        difficulty: "Hard",
        points: 200,
    },
    {
        title: "The Battle of Hastings",
        slug: "battle-hastings-england-location",
        question: "Where did William of Normandy defeat Harold Godwinson in 1066?",
        answer: "Near Battle, East Sussex, England",
        coordinates: { latitude: 50.9117, longitude: 0.4875 },
        mapZoom: 6,
        hint: "Look in southeastern England, near the English Channel.",
        explanation:
            "The Battle of Hastings in 1066 led to the Norman conquest of England. William's victory transformed English political and cultural history.",
        difficulty: "Hard",
        points: 200,
    },
    {
        title: "The First Olympic Games of Antiquity",
        slug: "ancient-olympia-greece-location",
        question: "Where were the ancient Olympic Games held?",
        answer: "Olympia, Greece",
        coordinates: { latitude: 37.6383, longitude: 21.6300 },
        mapZoom: 6,
        hint: "Look in the western Peloponnese.",
        explanation:
            "Olympia was a sanctuary of Zeus and the site of the ancient Olympic Games. The games were part of a major religious festival in the Greek world.",
        difficulty: "Hard",
        points: 200,
    },
    {
        title: "The City of Tikal",
        slug: "tikal-guatemala-location",
        question: "Where is the ancient Maya city of Tikal?",
        answer: "Petén, Guatemala",
        coordinates: { latitude: 17.2220, longitude: -89.6237 },
        mapZoom: 5,
        hint: "Look in Central America, near the borders of Mexico and Belize.",
        explanation:
            "Tikal was one of the great cities of the ancient Maya civilization. Its temples and plazas formed part of a major political center in the Maya lowlands.",
        difficulty: "Hard",
        points: 200,
    },
    {
        title: "The City of Great Zimbabwe",
        slug: "great-zimbabwe-location",
        question: "Where are the monumental stone ruins of Great Zimbabwe?",
        answer: "Masvingo Province, Zimbabwe",
        coordinates: { latitude: -20.2670, longitude: 30.9330 },
        mapZoom: 5,
        hint: "Look in southern Africa, north of South Africa.",
        explanation:
            "Great Zimbabwe was a major stone-built settlement and political center that flourished during the second millennium CE. It is closely associated with regional trade networks.",
        difficulty: "Hard",
        points: 200,
    },
    {
        title: "The Rock-Hewn Churches of Lalibela",
        slug: "lalibela-ethiopia-location",
        question: "Where are the famous medieval churches carved into rock?",
        answer: "Lalibela, Ethiopia",
        coordinates: { latitude: 12.0319, longitude: 39.0476 },
        mapZoom: 5,
        hint: "Look in the Ethiopian Highlands in the Horn of Africa.",
        explanation:
            "Lalibela is famous for its medieval rock-hewn churches, carved from solid rock. The site remains an important center of Ethiopian Orthodox Christian pilgrimage.",
        difficulty: "Hard",
        points: 200,
    },
    {
        title: "The Ancient City of Mohenjo-daro",
        slug: "mohenjo-daro-pakistan-location",
        question: "Where is the major archaeological site of the Indus Valley Civilization?",
        answer: "Sindh, Pakistan",
        coordinates: { latitude: 27.3290, longitude: 68.1380 },
        mapZoom: 5,
        hint: "Look in the lower Indus Valley, in present-day Pakistan.",
        explanation:
            "Mohenjo-daro was one of the largest cities of the Indus Valley Civilization, flourishing in the third millennium BCE. Its planned streets and drainage systems reveal sophisticated urban design.",
        difficulty: "Hard",
        points: 200,
    },
    {
        title: "The Library of Celsus",
        slug: "library-celsus-ephesus-turkey-location",
        question: "Where can the remains of the Library of Celsus be found?",
        answer: "Ephesus, near Selçuk, Turkey",
        coordinates: { latitude: 37.9390, longitude: 27.3408 },
        mapZoom: 6,
        hint: "Look on the western coast of Turkey, near the Aegean Sea.",
        explanation:
            "The Library of Celsus was built in Ephesus in the second century CE. It served as a monumental tomb and library and is one of the best-known surviving structures of the ancient city.",
        difficulty: "Hard",
        points: 200,
    },
];

const seedLocationChallenges = async () => {
    try {
        let created = 0;
        let updated = 0;
        let unchanged = 0;

        for (const challenge of locationChallengesData) {
            const dataToSave = {
                ...challenge,
                status: "published",
            };

            const result = await LocationChallenge.updateOne(
                { slug: dataToSave.slug },
                { $set: dataToSave },
                {
                    upsert: true,
                    runValidators: true,
                }
            );

            if (result.upsertedCount > 0) {
                created++;
            } else if (result.modifiedCount > 0) {
                updated++;
            } else {
                unchanged++;
            }
        }

        console.log("Location Challenges seed completed.");
        console.log(`Created: ${created}`);
        console.log(`Updated: ${updated}`);
        console.log(`Unchanged: ${unchanged}`);
        console.log(`Total: ${locationChallengesData.length}`);
    } catch (error) {
        console.error("Error seeding Location Challenges:", error);
        throw error;
    }
};

export default seedLocationChallenges;
