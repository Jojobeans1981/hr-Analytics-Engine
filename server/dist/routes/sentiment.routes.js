"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sentiment_controller_1 = require("../controllers/sentiment.controller");
const router = (0, express_1.Router)();
router.post('/analyze', sentiment_controller_1.SentimentController.analyzeText);
router.get('/teams/:teamId', sentiment_controller_1.SentimentController.analyzeTeamSentiment);
exports.default = router;
