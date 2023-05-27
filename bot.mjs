import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import { Telegraf, Input } from "telegraf";
import fs from "fs";
import {
  getUrl,
  downloadInstagramReel,
  downloadYoutubeVideo,
  downloadPinterest,
} from "./utils.mjs";

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start(async (ctx) => {
  const name = ctx.message.from.first_name;
  const messageReply = `Hola ${name}, este es un Bot creado por Christian Abreu para descargar videos de diferentes plataformas (Instagram, Facebook, Youtube), por el momento solo se descargan Instagram reels. \n\n Escribe /reel y el link para descargar el video. \n\n ejemplo: /reel https://www.instagram.com/miVideo`;
  ctx.reply(messageReply);
});

bot.command("yt", async (ctx) => {
  try {
    ctx.reply("Descargando Video...");
    const url = getUrl(ctx);
    console.log(url);
    const fileSource = await downloadYoutubeVideo(url);
    ctx
      .replyWithVideo(Input.fromReadableStream(fileSource))
      .then((response) => {
        fs.unlinkSync(fileSource);
      });
  } catch (error) {
    errorHandler(error, ctx);
  }
});

bot.command(["reel", "Reel"], async (ctx) => {
  try {
    const name = ctx.message.from.first_name;
    ctx.reply("Descargando Video ...");
    const url = getUrl(ctx);
    const videoUrl = await downloadInstagramReel(url);
    ctx.replyWithVideo(Input.fromURLStream(videoUrl)).then((response) => {
      console.log(`${name} descargo un video`);
    });
  } catch (error) {
    errorHandler(error, ctx);
  }
});

bot.command(["pinterest", "Pinterest"], async (ctx) => {
  try {
    const url = getUrl(ctx);
    const videoUrl = await downloadPinterest(url);
    ctx.reply(videoUrl);
    ctx.replyWithVideo(Input.fromURLStream(videoUrl)).then((response) => {
      console.log(`Video descargado`);
    });
  } catch (error) {
    console.error(error);
  }
});

const errorHandler = (error, ctx) => {
  console.error(error);
  ctx.reply(
    "Ha Ocurrido un error al momento de descargar tu video, intenta de nuevo y verifica que estes poniendo todo bien."
  );
};

bot.launch();