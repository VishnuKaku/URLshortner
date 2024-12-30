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
exports.GeoCollector = void 0;
// Geo collector logic 
// src/analytics/collectors/GeoCollector.ts
const geoip_lite_1 = __importDefault(require("geoip-lite"));
class GeoCollector {
    collect(ip) {
        return __awaiter(this, void 0, void 0, function* () {
            const geo = geoip_lite_1.default.lookup(ip);
            if (!geo) {
                return {
                    country: 'unknown',
                    region: 'unknown',
                    city: 'unknown',
                    timezone: 'unknown'
                };
            }
            return {
                country: geo.country,
                region: geo.region,
                city: geo.city,
                timezone: geo.timezone
            };
        });
    }
}
exports.GeoCollector = GeoCollector;
