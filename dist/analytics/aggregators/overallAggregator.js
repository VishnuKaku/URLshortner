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
exports.OverallAggregator = void 0;
const Analytics_1 = __importDefault(require("../../models/Analytics"));
class OverallAggregator {
    aggregate(userId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const analytics = yield Analytics_1.default.find({
                userId,
                accessTime: { $gte: startDate, $lte: endDate }
            }).populate('urlId');
            // Calculate total clicks and unique visitors
            const totalClicks = analytics.length;
            const uniqueClicks = new Set(analytics.map(record => record.ipAddress)).size;
            // Calculate total URLs
            const totalUrls = new Set(analytics.map(record => record.urlId.toString())).size;
            // Calculate clicks by date
            const clicksByDate = analytics.reduce((acc, record) => {
                const date = record.accessTime.toISOString().split('T')[0];
                const existingEntry = acc.find(entry => entry.date === date);
                if (existingEntry) {
                    existingEntry.count += 1;
                }
                else {
                    acc.push({ date, count: 1 });
                }
                return acc;
            }, []);
            // Calculate OS stats
            const osStats = analytics.reduce((acc, record) => {
                var _a;
                const os = ((_a = record.device) === null || _a === void 0 ? void 0 : _a.os) || 'unknown';
                const existingEntry = acc.find(entry => entry.osName === os);
                if (existingEntry) {
                    existingEntry.uniqueClicks += 1;
                    existingEntry.uniqueUsers = new Set([
                        ...Array.from(new Set([record.ipAddress])),
                    ]).size;
                }
                else {
                    acc.push({
                        osName: os,
                        uniqueClicks: 1,
                        uniqueUsers: 1
                    });
                }
                return acc;
            }, []);
            // Calculate device stats
            const deviceStats = analytics.reduce((acc, record) => {
                var _a;
                const deviceType = ((_a = record.device) === null || _a === void 0 ? void 0 : _a.type) || 'unknown';
                const existingEntry = acc.find(entry => entry.deviceName === deviceType);
                if (existingEntry) {
                    existingEntry.uniqueClicks += 1;
                    existingEntry.uniqueUsers = new Set([
                        ...Array.from(new Set([record.ipAddress])),
                    ]).size;
                }
                else {
                    acc.push({
                        deviceName: deviceType,
                        uniqueClicks: 1,
                        uniqueUsers: 1
                    });
                }
                return acc;
            }, []);
            // Calculate URL performance
            const urlPerformance = analytics.reduce((acc, record) => {
                const urlId = record.urlId.toString();
                acc[urlId] = (acc[urlId] || 0) + 1;
                return acc;
            }, {});
            const topUrls = Object.entries(urlPerformance)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10);
            // Calculate geographical distribution using location instead of geoInfo
            const geoDistribution = analytics.reduce((acc, record) => {
                var _a;
                if ((_a = record.location) === null || _a === void 0 ? void 0 : _a.country) {
                    const country = record.location.country;
                    acc[country] = (acc[country] || 0) + 1;
                }
                return acc;
            }, {});
            // Calculate hourly distribution
            const hourlyDistribution = analytics.reduce((acc, record) => {
                const hour = record.accessTime.getHours();
                acc[hour] = (acc[hour] || 0) + 1;
                return acc;
            }, {});
            return {
                timeframe: {
                    start: startDate,
                    end: endDate
                },
                totalUrls,
                totalClicks,
                uniqueClicks,
                clicksByDate,
                osType: osStats,
                deviceType: deviceStats,
                topUrls,
                geoDistribution,
                hourlyDistribution
            };
        });
    }
}
exports.OverallAggregator = OverallAggregator;
