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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getFoodItem = exports.total = exports.progress = void 0;
var takeaway_1 = require("takeaway");
exports.progress = 0;
exports.total = 0;
function getFoodItem(_response) {
    return __awaiter(this, void 0, void 0, function () {
        var takeaway, postalCode, searchTerm, includeOpen, includeClosed, country, restaurants, food, i, _i, restaurants_1, restaurant, _a, _b, category, _c, _d, product, err_1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 7, , 8]);
                    takeaway = new takeaway_1.Takeaway();
                    postalCode = _response.postalCode;
                    searchTerm = _response.searchTerm;
                    includeOpen = _response.openChecked;
                    includeClosed = _response.closeChecked;
                    return [4 /*yield*/, takeaway.getCountryById(_response.country)];
                case 1:
                    country = _e.sent();
                    return [4 /*yield*/, country.getRestaurants(postalCode, '51.254361', '4.282446')];
                case 2:
                    restaurants = _e.sent();
                    food = [];
                    if (!includeOpen && !includeClosed) {
                        return [2 /*return*/, ""];
                    }
                    i = 0;
                    exports.total = restaurants.length;
                    _i = 0, restaurants_1 = restaurants;
                    _e.label = 3;
                case 3:
                    if (!(_i < restaurants_1.length)) return [3 /*break*/, 6];
                    restaurant = restaurants_1[_i];
                    i += 1;
                    exports.progress = i;
                    console.clear();
                    console.log(exports.progress + "/" + exports.total);
                    return [4 /*yield*/, restaurant.getMenu(postalCode)];
                case 4:
                    _e.sent();
                    if (restaurant.categories && restaurant.open === includeOpen || restaurant.open === !includeClosed) {
                        for (_a = 0, _b = restaurant.categories; _a < _b.length; _a++) {
                            category = _b[_a];
                            for (_c = 0, _d = category.products; _c < _d.length; _c++) {
                                product = _d[_c];
                                if (product.name && product.name.toLowerCase().includes(searchTerm)) {
                                    food.push(restaurant.name + " || " + product.name + " || €" + product.deliveryPrice / 100);
                                }
                            }
                        }
                    }
                    console.clear();
                    console.log(i + "/" + restaurants.length);
                    _e.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [2 /*return*/, food.join(";;")];
                case 7:
                    err_1 = _e.sent();
                    console.error(err_1);
                    throw err_1;
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.getFoodItem = getFoodItem;
function throwDebugError() {
    var error = new Error("Debug Test Error");
    error.name = "Test Error";
    throw error;
}
