var RequestQ = require("express-request-queue");
var express = require("express");
var router = express.Router();
const wa = require("./utils/scrape");
const uuidv1 = require("uuid/v1");

const JOBS = {};
const q = new RequestQ();

router.get("/", function(req, res) {
  res.json({ message: "Author: Aizuddin Badry" });
});

router.get("/:channel/getqr", function(req, res) {
  new Promise((resolve, reject) => {
    wa.getQR(req.params.channel)
      .then(data => {
        resolve(data);
        res.redirect("/images/qrcode.png");
      })
      .catch(err => reject("scrape failed"));
  });
});

router.get("/:channel/verify", function(req, res) {
  new Promise((resolve, reject) => {
    wa.verify(req.params.channel)
      .then(data => {
        resolve(data);
        res.redirect("/images/session.png");
      })
      .catch(err => reject("scrape failed"));
  });
});

router.post(
  "/chat/:channel/:number",
  q.run(async (req, res, next) => {
    let promises = [];
    promises.push(
      new Promise((resolve, reject) => {
        setTimeout(
          resolve,
          30000,
          wa
            .chat(req.params.number, req.body.message, req.params.channel)
            .then(data => {
              resolve(data);
            })
            .catch(err => reject("scrape failed"))
        );
      })
    );
    let uuid = uuidv1();
    await Promise.all(promises).then(values => {
      JOBS[uuid] = values;
    });
    res.json({ message: "Message will be send in 15sec" });
  })
);

router.post(
  "/media/:channel/:number/",
  q.run(async (req, res, next) => {
    let promises = [];
    promises.push(
      new Promise(async (resolve, reject) => {
        setTimeout(
          resolve,
          10000,
          wa
            .media(
              req.params.number,
              req.body.url,
              req.body.caption,
              req.params.channel
            )
            .then(data => {
              resolve(data);
              res.json({ message: 200 });
            })
            .catch(err => reject("scrape failed"))
        );
      })
    );
    let uuid = uuidv1();
    await Promise.all(promises).then(values => {
      JOBS[uuid] = values;
    });
  })
);

module.exports = router;
