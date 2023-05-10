const { Telegraf, Input } = require("telegraf");
const fs = require("fs");
const ytdl = require("ytdl-core");
const puppeteer = require("puppeteer");

module.exports = () => {
  const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

  bot.start(async (ctx) => {
    const name = ctx.message.from.first_name;
    const messageReply = `Hola ${name}, este es un Bot creado por Christian Abreu para descargar videos de diferentes plataformas (Instagram, Facebook, Youtube), por el momento solo se descargan Instagram reels. \n\n Escribe /reel y el link para descargar el video. \n\n ejemplo: /reel https://www.instagram.com/miVideo`;
    ctx.reply(messageReply);
  });

  bot.command("yt", (ctx) => {
    try {
      ctx.reply("Descargando Video...");
      const ytUrl = getUrl(ctx);
      const video = ytdl(ytUrl, { quality: "highestaudio" });
      console.log(video)
      // video.pipe(fs.createWriteStream("./audio.mp4"));
      // video.on("end", () => {
      //   ctx.replyWithVideo(Input.fromReadableStream("./audio.mp4"));
      // });
    } catch (error) {
      errorHandler(error);
    }
  });

  bot.command(["reel", "Reel"], async (ctx) => {
    try {
      const name = ctx.message.from.first_name;
      ctx.reply("Descargando Video ...");
      const browser = await puppeteer.launch({ headless: true });
      const [page] = await browser.pages();
      const IGReel = getUrl(ctx);

      await page.goto(IGReel);
      await page.waitForSelector("video");
      const videoUrl = await page.$eval("video", (video) => video.src);

      ctx.replyWithVideo(Input.fromURLStream(videoUrl));
      console.log(`${name} descargo un video`);
      await browser.close();
    } catch (error) {
      errorHandler(error, ctx);
    }
  });

  const getUrl = (ctx) => ctx.message.text.split(" ")[1];

  const errorHandler = (error, ctx) => {
    console.error(error);
    ctx.reply(
      "Ha Ocurrido un error al momento de descargar tu video, intenta de nuevo y verifica que estes poniendo todo bien."
    );
  };

  bot.launch();
};
