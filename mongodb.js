const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const colors = require('./UI/colors/colors');

let db;
let collections = {};
let giveawayCollection;

async function connectToDatabase() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.error("❌ MONGODB_URI is not defined! Set it in Render Environment variables.");
        process.exit(1);
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        db = client.db("discord-bot");

        console.log('\n' + '─'.repeat(40));
        console.log(`${colors.magenta}${colors.bright}🕸️  DATABASE CONNECTION${colors.reset}`);
        console.log('─'.repeat(40));
        console.log('\x1b[36m[ DATABASE ]\x1b[0m', '\x1b[32mConnected to MongoDB ✅\x1b[0m');

        // Connect mongoose as well
        await mongoose.connect(uri);
        console.log('\x1b[36m[ MONGOOSE ]\x1b[0m', '\x1b[32mConnected using Mongoose ✅\x1b[0m');

        // Initialize collections AFTER connection
        collections = {
            voiceChannelCollection: db.collection("voiceChannels"),
            centralizedControlCollection: db.collection("centralizedControl"),
            nqnCollection: db.collection("nqn"),
            welcomeCollection: db.collection("welcomeChannels"),
            autoroleCollection: db.collection("autorolesetups"),
            hentaiCommandCollection: db.collection("hentailove"),
            serverConfigCollection: db.collection("serverconfig"),
            reactionRolesCollection: db.collection("reactionRoles"),
            antisetupCollection: db.collection("antisetup"),
            anticonfigcollection: db.collection("anticonfiglist"),
            afkCollection: db.collection("afk"),
            notificationsCollection: db.collection("notifications"),
            logsCollection: db.collection("logs"),
            nicknameConfigs: db.collection("nicknameConfig"),
            economyCollection: db.collection("economy"),
            usersCollection: db.collection("users"),
            epicDataCollection: db.collection("epicData"),
            customCommandsCollection: db.collection("customCommands"),
            birthdayCollection: db.collection("birthday"),
            applicationCollection: db.collection("applications"),
            serverLevelingLogsCollection: db.collection("serverLevelingLogs"),
            commandLogsCollection: db.collection("commandLogs"),
            reportsCollection: db.collection("reports"),
            stickyMessageCollection: db.collection("stickymessages"),
            serverStatsCollection: db.collection("serverStats"),
            autoResponderCollection: db.collection("autoResponder"),
            playlistCollection: db.collection("lavalinkplaylist"),
            autoplayCollection: db.collection("autoplaylavalink"),
            embedCollection: db.collection("aioembeds"),
            countingCollection: db.collection("countingame"),
            botStatusCollection: db.collection("bot_status"),
            scheduleCollection: db.collection("scheduleCollections"),
            gameAccountsCollection: db.collection("gameAccounts"),
        };

        // Giveaway collection with unique index
        giveawayCollection = db.collection("giveaways");
        await giveawayCollection.createIndex({ messageId: 1 }, { unique: true });
        console.log('\x1b[36m[ COLLECTION ]\x1b[0m', '\x1b[32mGiveaway collection initialized ✅\x1b[0m');

    } catch (err) {
        console.error("❌ Error connecting to MongoDB or Mongoose", err);
    }
}

// Giveaway helpers
async function saveGiveaway(giveaway) {
    if (!giveawayCollection) return console.error("Giveaway collection not initialized!");
    await giveawayCollection.updateOne(
        { messageId: giveaway.messageId },
        { $set: giveaway },
        { upsert: true }
    );
}

async function getGiveaways() {
    return giveawayCollection ? await giveawayCollection.find().toArray() : [];
}

async function getGiveawayById(messageId) {
    return giveawayCollection ? await giveawayCollection.findOne({ messageId }) : null;
}

async function deleteGiveaway(messageId) {
    if (giveawayCollection) await giveawayCollection.deleteOne({ messageId });
}

module.exports = {
    connectToDatabase,
    ...collections,
    saveGiveaway,
    getGiveaways,
    getGiveawayById,
    deleteGiveaway
};
