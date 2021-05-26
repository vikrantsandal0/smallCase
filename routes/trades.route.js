const tradesController = require("../controllers/trades.controller");
const express = require("express");
const router = express.Router();

// GET - get all trades for a particular security or for all
router.get("/trades", tradesController.get_trades);

// GET - make a new trade
router.post("/trades", tradesController.make_trades);

// post - Post upload image
router.put("/trades", tradesController.update_trades);

// delete - Delete upload image
router.delete("/trades", tradesController.delete_trade);

router.get("/tradesReturns", tradesController.trades_returns);

router.get("/portfolioDetails", tradesController.portfolio_details);


module.exports = router;