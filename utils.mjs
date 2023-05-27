import fs from "fs";
import ytdl from "ytdl-core";
import puppeteer from "puppeteer";
import crypto from "crypto";

export const getUrl = (ctx) => ctx.message.text.split(" ")[1];

export const downloadInstagramReel = async (url) => {
  const browser = await puppeteer.launch();
  const [page] = await browser.pages();
  await page.goto(url);

  await page.waitForSelector("video");
  const videoUrl = await page.$eval("video", (video) => video.src);
  await browser.close();

  return videoUrl;
};

export const downloadYoutubeVideo = (url) => {
  return new Promise((resolve) => {
    const video = ytdl(url, { quality: "highestaudio" });
    const source = `./temp/${crypto.randomUUID()}.mp4`;
    video.pipe(fs.createWriteStream(source));
    video.on("end", () => resolve(source));
  });
};

export const downloadPinterest = async (url) => {
  const browser = await puppeteer.launch();
  const [page] = await browser.pages();
  await page.goto(url);

  await page.waitForSelector("video");
  const videoUrl = await page.$eval("video", (video) => video.src);
  await browser.close();

  return videoUrl;
};
