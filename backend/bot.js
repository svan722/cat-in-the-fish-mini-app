require('dotenv').config({ path: '../.env' });
const { Bot, session, InlineKeyboard } = require("grammy");
const fs = require('fs');
const download = require('download');

// database
const connectDB = require('./db/connect');
const logger = require('./helper/logger');
const userLogin = require('./utils/login');

const User = require('./models/User');
const BoostItem = require('./models/BoostItem');
const BoostPurchaseHistory = require('./models/BoostPurchaseHistory');

const botStart = async () => {
    await connectDB(process.env.MONGO_URL);
    const gameBot = new Bot(process.env.BOT_TOKEN);
    const initial = () => {
        return {};
    };
    gameBot.use(session({ initial }));

    gameBot.catch((err) => {
        logger.error(err, "Error in bot:");
        if (err.message.includes("Cannot read properties of null (reading 'items')")) {
            console.log("Detected critical error. Restarting server...");
            // restartServer();
        }
    });

    gameBot.command('start', async (ctx) => {
        const username = ctx.from.username;
        const userid = ctx.from.id;
        const firstname = ctx.from.first_name ? ctx.from.first_name : '';
        const lastname = ctx.from.last_name ? ctx.from.last_name : '';

        const userProfilePhotos = await ctx.api.getUserProfilePhotos(userid, { limit: 1 });
        if (userProfilePhotos.total_count > 0) {
            const fileId = userProfilePhotos.photos[0][0].file_id;
            const file = await ctx.api.getFile(fileId);
            const downloadUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
            await download(downloadUrl).pipe(fs.createWriteStream(`uploads/avatars/${ctx.from.id}.jpg`));
            logger.info(`avatar download url=${downloadUrl}`);
        }

        const isPremium = ctx.from.is_premium || false;
        const inviter = ctx.match;

        const loginRes = await userLogin(userid, username, firstname, lastname, isPremium, inviter);
        if (!loginRes.success) {
            await ctx.reply("Sorry, seems like you don't have any telegram id, set your telegram id and try again.");
            return;
        }

        play_url = process.env.APP_URL;
        const link = `${process.env.BOT_LINK}?startapp=${userid}`;
        const shareText = 'Join our telegram mini app.';
        const invite_fullUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(shareText)}`;

        const keyboard = new InlineKeyboard()
            .webApp('😺 Play Now 😺', play_url)
            .row()
            .url('🚀 ✖ 🚀', 'https://x.com/CatInTheFish?t=p9OEN2s6HczzGOlhMc2xyw&s=09')
            .url('👬 Join 👬', 'https://t.me/Catinthefish')
            .row()
            .url('🙈 Invite 🙉', invite_fullUrl)

        await ctx.replyWithPhoto(
            process.env.BOT_LOGO,
            {
                caption: '🐾 Cat in the Fish – Dive into an Underwater Adventure with Your Cat! 🐟\n\rYour mission is simple: catch as many fish as possible to collect points and convert them into coins! But it\'s not that easy. 🐾 The more fish you catch, the bigger the rewards! 🎣\n\r\n\r🌟 How to Play\n\r\n\rTap to catch the fish!\n\rEach fish gives you points.\n\rCollected points can be converted into coins that will be issued! 💰\n\rWays to Make the Game Even More Fun!\n\r🎯 Play with friends! – Invite your friends and enjoy fishing together while earning more points.\n\r🎁 Follow us on Twitter for extra rewards! – Just follow us on Twitter to unlock special bonuses!\n\r🚀 Share the game to get even bigger rewards! – Spread the word and watch your rewards grow as more people join!\n\r\n\rJoin "Cat in the Fish" now, catch fish, and claim the best rewards! 🏆',
                reply_markup: keyboard,
            }
        );
        logger.info(`${ctx.from.first_name}#${ctx.from.id} command 'start'`);
    });

    // gameBot.command("pay", (ctx) => {
    //     return ctx.replyWithInvoice("Test Product", "Test description", "{}", "XTR", [
    //         { amount: 1, label: "Test Product" },
    //     ]);
    // });

    gameBot.on("pre_checkout_query", (ctx) => {
        return ctx.answerPreCheckoutQuery(true).catch(() => {
            console.error("answerPreCheckoutQuery failed");
        });
    });

    gameBot.on("message:successful_payment", async (ctx) => {

        if (!ctx.message || !ctx.message.successful_payment || !ctx.from) {
            return;
        }

        const payment = ctx.message.successful_payment;
        const payload = JSON.parse(payment.invoice_payload);

        await BoostPurchaseHistory.create({
            user: payload.userid,
            boostItem: payload.boostid,
            telegramPaymentChargeId: payment.telegram_payment_charge_id,
            providerPaymentChargeId: payment.provider_payment_charge_id,
            payment: JSON.stringify(payment),
        });

        // Update user boosts
        var user = await User.findById(payload.userid);
        var boost = await BoostItem.findById(payload.boostid);
        if(!user || !boost) {
            console.log(`there is no boost(${payload.boostid}) or user(${payload.userid})`);
            return;
        }
        const boostIndex = user.boosts.findIndex(b => b.item.equals(boost._id));
        if (boostIndex !== -1) {
            user.boosts[boostIndex].usesRemaining += boost.maxUses;
        } else {
            user.boosts.push({
                item: boost._id,
                usesRemaining: boost.maxUses,
            });
        }
        await user.save();

        console.log("successful_payment success=", ctx.message.successful_payment);
    });

    gameBot.command("refund", (ctx) => {
        const userId = ctx.from.id;
        ctx.api
            .refundStarPayment(userId, 'stxcsVdegh_V9QU471o1mmMeSZHRxYXQRJqRrVFiO0HMHtLxuwi9208sA3Pj4AnsevtdSrZU4aXiOgpyryfaU3swHT4zGhahMTTDVBYyjWAKqr0OWMN227wix9ite7qmRYd')
            .then(() => {
                return ctx.reply("Refund successful");
            })
            .catch(() => ctx.reply("Refund failed"));
    });

    (async () => {
        await gameBot.api.deleteWebhook();
        gameBot.start();
        logger.info('Game Command Bot started!');
    })();
}

botStart();