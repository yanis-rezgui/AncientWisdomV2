import mongoose from "mongoose";
import HistoricalEra from "../models/historicalEra.model.js";

const seedEras = async () => {
    try {

        const eras = [

           {
    name: "Anglo-Saxon England",
    startYear: 410,
    endYear: 1066,

    description:
        "Anglo-Saxon England was the period of English history that followed the end of Roman rule in Britain and lasted until the Norman Conquest in 1066. During this period, Germanic peoples including the Angles, Saxons, and Jutes settled in Britain and established several competing kingdoms. Over time, these kingdoms developed political institutions, Christian traditions, distinctive art and literature, and eventually a more unified English kingdom.",

    sections: [
        {
            title: "The End of Roman Britain",
            content:
                "Roman rule in Britain gradually came to an end during the early fifth century. As Roman military and administrative structures disappeared, local kingdoms emerged across Britain. Groups from continental Europe, particularly the Angles, Saxons, and Jutes, settled in different parts of the island. The political landscape became increasingly fragmented, with numerous British and Anglo-Saxon kingdoms competing for territory and influence."
        },

        {
            title: "The Anglo-Saxon Kingdoms",
            content:
                "Anglo-Saxon England was initially divided among several kingdoms. Among the most important were Wessex, Mercia, Northumbria, East Anglia, Kent, Sussex, and Essex. These kingdoms frequently competed through warfare, alliances, marriages, and political rivalries. Over the centuries, some kingdoms became more powerful than others, with Mercia and later Wessex playing particularly important roles in the political development of England."
        },

        {
            title: "Christianization of England",
            content:
                "Christianity gradually spread throughout Anglo-Saxon England beginning in the late sixth century. The mission associated with Augustine of Canterbury, sent by Pope Gregory the Great in 597, played an important role in the conversion of Kent and the development of organized Christianity in southern England. Monasteries became important centers of education, manuscript production, religion, and intellectual life. Christian traditions gradually became deeply integrated into Anglo-Saxon society."
        },

        {
            title: "Viking Invasions and the Danelaw",
            content:
                "From the late eighth century onward, Viking raids increasingly affected England. Scandinavian armies eventually conquered large areas of northern and eastern England. Much of this territory became known as the Danelaw, where Scandinavian political and cultural influence became particularly strong. Alfred the Great of Wessex resisted Viking expansion and established a stronger political base from which later English kings could expand their authority."
        },

        {
            title: "The Rise of a Unified England",
            content:
                "During the tenth century, rulers from Wessex gradually expanded their control over the various Anglo-Saxon kingdoms. Kings such as Edward the Elder, Æthelstan, and Edgar contributed to the political unification of England. Æthelstan is often regarded as the first king to exercise authority over a kingdom resembling a unified England. However, Scandinavian invasions and political struggles continued to shape the country during the eleventh century."
        },

        {
            title: "The Norman Conquest",
            content:
                "The Anglo-Saxon period ended dramatically in 1066. Following the death of Edward the Confessor, competing claims to the English throne led to a succession crisis. Harold Godwinson became king but faced invasions from Harald Hardrada of Norway and William, Duke of Normandy. Harold defeated the Norwegian invasion at the Battle of Stamford Bridge but was then defeated and killed by William at the Battle of Hastings. William's victory began the Norman Conquest and transformed England's political, social, and cultural structure."
        }
    ]
}

        ];

        for (const era of eras) {

            const result = await HistoricalEra.findOneAndUpdate(
                { name: era.name },
                era,
                {
                    new: true,
                    upsert: true,
                    runValidators: true
                }
            );

            console.log(`Era seeded: ${result.name}`);
        }

        console.log("✅ Eras seeded successfully");

    } catch (error) {
        console.error("❌ Error while seeding eras:", error);
    }
};

export default seedEras;