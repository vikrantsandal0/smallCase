const tradesController = require("../controllers/trades.controller");
const express = require("express");
const router = express.Router();

// GET - get all trades for a particular security or for all
router.get("/trades", tradesController.get_trades);

// POST - make a new trade
router.post("/trades", tradesController.make_trades);

// PUT - updates an existing trade
router.put("/trades", tradesController.update_trades);

// DELETE - Delete trade
router.delete("/trades", tradesController.delete_trade);

// GET - finds trade returns
router.get("/tradesReturns", tradesController.trades_returns);

// GET - finds portfolioDetails 
router.get("/portfolioDetails", tradesController.portfolio_details);


module.exports = router;