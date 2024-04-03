var express = require("express");
var getCats = require("../data/cats");
var router = express.Router();

/* GET cat listing. */
router.get("/free", function (req, res, next) {
  const catList = getCats();

  const freeCats = catList.filter((cat) => cat.subscription === "free");

  return res.status(200).json(freeCats);
});

router.get("/premium", function (req, res, next) {
  const catList = getCats();

  const premiumCats = catList.filter((cat) => cat.subscription === "premium");

  return res.status(200).json(premiumCats);
});

router.get("/super-premium", function (req, res, next) {
  const catList = getCats();

  const superPremiumCats = catList.filter(
    (cat) => cat.subscription === "super-premium"
  );

  return res.status(200).json(superPremiumCats);
});

module.exports = router;






