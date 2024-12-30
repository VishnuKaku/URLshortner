"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicAggregator = void 0;
const Analytics_1 = __importDefault(require("../../models/Analytics"));
const Url_1 = require("@/models/Url");
class TopicAggregator {
    static aggregate(topic, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const urls = yield Url_1.Url.find({ topics: topic });
            const urlIds = urls.map(url => url._id);
            const analytics = (yield Analytics_1.default.find({
                urlId: { $in: urlIds },
                accessTime: { $gte: startDate, $lte: endDate }
            }).populate('userId'));
            const clicks = analytics.map(record => {
                var _a;
                return ({
                    timestamp: record.accessTime,
                    ipAddress: record.ipAddress,
                    deviceInfo: {
                        deviceName: ((_a = record.device) === null || _a === void 0 ? void 0 : _a.deviceName) || 'unknown',
                    }
                });
            });
            const totalClicks = clicks.length;
            const uniqueVisitors = new Set(clicks.map(click => click.ipAddress)).size;
            const deviceStats = clicks.reduce((acc, click) => {
                const deviceName = click.deviceInfo.deviceName;
                acc[deviceName] = (acc[deviceName] || 0) + 1;
                return acc;
            }, {});
            const osStats = clicks.reduce((acc, click) => {
                const osName = click.deviceInfo.deviceName;
                acc[osName] = (acc[osName] || 0) + 1;
                return acc;
            }, {});
            return {
                topicName: topic,
                timeframe: {
                    start: startDate,
                    end: endDate
                },
                totalClicks,
                uniqueVisitors,
                deviceStats,
                osStats,
                clicks
            };
        });
    }
}
exports.TopicAggregator = TopicAggregator;
