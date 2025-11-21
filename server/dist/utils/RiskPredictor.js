"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskPredictor = void 0;
const tf = __importStar(require("@tensorflow/tfjs"));
const path_1 = __importDefault(require("path"));
class RiskPredictor {
    constructor() {
        this.model = null;
        this.isReady = false;
    }
    async initialize() {
        try {
            const modelPath = path_1.default.join(__dirname, '../../models/risk-model');
            this.model = await tf.loadLayersModel(`file://${modelPath}/model.json`);
            this.isReady = true;
        }
        catch (error) {
            await this.createAndTrainModel();
        }
    }
    async predict(features) {
        if (!this.isReady)
            throw new Error('Model not ready');
        // Implementation remains the same as your original
        // ...
        return {
            score: 0, // Replace with actual calculation
            level: 'low',
            factors: [],
            confidence: 0
        };
    }
    async createAndTrainModel() {
        // Implementation remains the same
    }
}
exports.RiskPredictor = RiskPredictor;
