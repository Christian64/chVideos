const fs = require("fs");
const ytdl = require("ytdl-core");
const puppeteer = require("puppeteer");
const crypto = require("crypto");

const getUrl = (ctx) => ctx.message.text.split(" ")[1];

const downloadInstagramReel = async (url) => {
  const browser = await puppeteer.launch();
  const [page] = await browser.pages();
  await page.goto(url);

  await page.waitForSelector("video");
  const videoUrl = await page.$eval("video", (video) => video.src);
  await browser.close();

  return videoUrl;
};

const downloadYoutubeVideo = (url) => {
  return new Promise((resolve) => {
    const video = ytdl(url, { quality: "highestaudio" });
    const source = `./temp/${crypto.randomUUID()}.mp4`;
    video.pipe(fs.createWriteStream(source));
    video.on("end", () => resolve(source));
  });
};

module.exports = {
  getUrl,
  downloadInstagramReel,
  downloadYoutubeVideo,
};
