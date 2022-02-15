const https = require("https");
const fs = require("fs");
const puppeteer = require("puppeteer-core");
var url = require("url");
var path = require("path");
const sleep = milliseconds =>
  new Promise(resolve => setTimeout(resolve, milliseconds));

const getQR = async channel => {
  const launch = {
    headless: false,
    //executablePath: "/usr/bin/google-chrome",
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    ignoreHTTPSErrors: true,
    userDataDir: "./" + channel,
    args: [
      "--log-level=3", // fatal only
      //'--start-maximized',
      "--no-default-browser-check",
      "--disable-infobars",
      "--disable-web-security",
      "--disable-site-isolation-trials",
      "--no-experiments",
      "--ignore-gpu-blacklist",
      "--ignore-certificate-errors",
      "--ignore-certificate-errors-spki-list",
      "--disable-gpu",
      "--disable-extensions",
      "--disable-default-apps",
      "--enable-features=NetworkService",
      "--disable-setuid-sandbox",
      "--no-sandbox"
    ]
  };
  const browser = await puppeteer.launch(launch);
  const page = await browser.newPage();

  // Open First Page
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36"
  );
  await page.goto("https://web.whatsapp.com", {
    waitUntil: "networkidle0",
    timeout: 0
  });
  console.log("visited web.whatsapp");
  await page.waitFor(15000);
  let session = await page.evaluate(() => {
    let nodes = document.querySelectorAll("#side");
    let el = nodes[nodes.length - 1];

    return el ? el.innerHTML : false;
  });
  console.log("Evaluate page");
  if (session) {
    console.log("session exists");
    await page.screenshot({ path: "./public/images/qrcode.png" });
    await browser.close();
  } else {
    console.log("session not exists");
    await page.screenshot({ path: "./public/images/qrcode.png" });
    console.log("captured qr code");
    console.log("waiting for qr scan...");
    await page.waitForNavigation();
    console.log("Successful scanned!");
    await browser.close();
  }
};
module.exports.getQR = getQR;

const verify = async channel => {
  const launch = {
    headless: true,
    //executablePath: "/usr/bin/google-chrome",
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    ignoreHTTPSErrors: true,
    userDataDir: "./" + channel,
    args: [
      "--log-level=3", // fatal only
      //'--start-maximized',
      "--no-default-browser-check",
      "--disable-infobars",
      "--disable-web-security",
      "--disable-site-isolation-trials",
      "--no-experiments",
      "--ignore-gpu-blacklist",
      "--ignore-certificate-errors",
      "--ignore-certificate-errors-spki-list",
      "--disable-gpu",
      "--disable-extensions",
      "--disable-default-apps",
      "--enable-features=NetworkService",
      "--disable-setuid-sandbox",
      "--no-sandbox"
    ]
  };
  const browser = await await puppeteer.launch(launch);
  const page = (await browser.pages())[0];

  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36"
  );

  await page.goto("https://web.whatsapp.com", {
    waitUntil: "networkidle0",
    timeout: 0
  });
  console.log("visited web.whatsapp");
  let session = await page.evaluate(() => {
    let nodes = document.querySelectorAll("#side");
    let el = nodes[nodes.length - 1];

    return el ? true : false;
  });
  if (!session) {
    await sleep(15000);
    await page.screenshot({ path: "./public/images/session.png" });
    console.log("captured session");
    await sleep(5000);
    await browser.close();
  }
};
module.exports.verify = verify;

const chat = async (number, message, channel) => {
  const launch = {
    headless: false,
    //executablePath: "/usr/bin/google-chrome",
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    ignoreHTTPSErrors: true,
    userDataDir: "./" + channel,
    args: [
      "--log-level=3", // fatal only
      //'--start-maximized',
      "--no-default-browser-check",
      "--disable-infobars",
      "--disable-web-security",
      "--disable-site-isolation-trials",
      "--no-experiments",
      "--ignore-gpu-blacklist",
      "--ignore-certificate-errors",
      "--ignore-certificate-errors-spki-list",
      "--disable-gpu",
      "--disable-extensions",
      "--disable-default-apps",
      "--enable-features=NetworkService",
      "--disable-setuid-sandbox",
      "--no-sandbox"
    ]
  };
  const browser = await puppeteer.launch(launch);
  const page = await browser.newPage();
  await page.goto(
    "https://web.whatsapp.com/send?phone=" + number + "&text=" + message,
    {
      waitUntil: "networkidle",
      timeout: 0
    }
  );
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36"
  );
  await page.keyboard.press("Enter");
  await page.screenshot({ path: "./public/images/session.png" });
  console.log("captured session");
  await sleep(5000);
  await browser.close();
};
module.exports.chat = chat;

const media = async (number, imageUrl, caption, channel) => {
  const launch = {
    headless: false,
    //executablePath: "/usr/bin/google-chrome",
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    ignoreHTTPSErrors: true,
    userDataDir: "./" + channel,
    args: [
      "--log-level=3", // fatal only
      //'--start-maximized',
      "--no-default-browser-check",
      "--disable-infobars",
      "--disable-web-security",
      "--disable-site-isolation-trials",
      "--no-experiments",
      "--ignore-gpu-blacklist",
      "--ignore-certificate-errors",
      "--ignore-certificate-errors-spki-list",
      "--disable-gpu",
      "--disable-extensions",
      "--disable-default-apps",
      "--enable-features=NetworkService",
      "--disable-setuid-sandbox",
      "--no-sandbox"
    ]
  };
  const browser = await puppeteer.launch(launch);
  const page = await browser.newPage();
  await page.goto("https://web.whatsapp.com/send?phone=" + number, {
    waitUntil: "networkidle0",
    timeout: 0
  });

  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36"
  );

  var parsed = url.parse(imageUrl);
  const file = await fs.createWriteStream(
    "./" + path.basename(parsed.pathname)
  );
  const request = https.get(imageUrl, async function(response) {
    response.pipe(file);
    await file.on("finish", async function() {
      console.log("successful downloaded");
      await page.waitForSelector("._3u328.copyable-text.selectable-text");
      const handles = await page.$$('[title="Attach"]');
      for (const handle of handles) await handle.click({ delay: 250 });
      const upload = await page.$('input[type="file"]');
      await upload.uploadFile("./" + path.basename(parsed.pathname));
      await page.waitFor(10000);
      await page.screenshot({ path: "./public/images/uploaded.png" });
      console.log("Take screenshot.");
      if (caption) {
        var arr = caption;
        arr.split(" ");
        await page.waitForSelector("._3FeAD._2YgjU._1pSqv");
        var arrayLength = arr.length;
        for (var i = 0; i < arrayLength; i++) {
          if (arr[i] == "/n") {
            await page.keyboard.down("Shift");
            await page.keyboard.press("Enter");
          } else {
            await page.type("._3u328.copyable-text.selectable-text", arr[i], {
              delay: 20
            });
          }
        }
        await page.keyboard.up("Shift");
      }
      await page.keyboard.press("Enter");
      await page.waitFor(10000);
      fs.unlinkSync("./" + path.basename(parsed.pathname));
      console.log("Successful send image");
      await browser.close();
    });
  });
};
module.exports.media = media;
