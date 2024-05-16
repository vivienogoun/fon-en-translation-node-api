import { launch } from "puppeteer";
import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with the origin you want to allow
  })
);

app.get("/", (req, res) => {
  fetch(
    "https://translate.glosbe.com/fon-en/vi%20we%20%C9%96o%20ayihun%20%C9%96u%20w%CE%B5%20%C9%96o%20ji%20%C9%94%20gbe",
    {
      mode: "no-cors",
      headers: {
        "Content-Type": "text/html",
      },
    }
  )
    .then((response) => response.text())
    .then((html) => console.log(html));
  res.send("Hello World!");
});

app.get("/translate", async (req, res) => {
  const browser = await launch({
    headless: true,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.goto("https://glosbe.com/fon/en", {
    waitUntil: "domcontentloaded",
  });

  await page.type("#dictionary-search", req.query.text);

  await page.keyboard.press("Enter");

  await page.waitForNavigation();

  const result = await page.evaluate(() => {
    return document
      .getElementById("glosbeTranslate_container")
      .innerHTML.toString()
      .match(/<a[^>]*>(.*?)<\/a>/)[1];
  });
  res.json({ result });
  await browser.close();
});

app.listen(4000);
