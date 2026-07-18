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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var promises_1 = require("fs/promises");
var path_1 = require("path");
var os_1 = require("os");
var util_1 = require("util");
var child_process_1 = require("child_process");
var logger_1 = require("../utils/logger");
// replace with joplin's official o-auth client app id
var githubClientId = 'Ov23li3KnDjw1qXitrlW';
var execAsync = (0, util_1.promisify)(child_process_1.exec);
// ~/.config/joplin-plugin -> For saving the token received after authentication
var configDir = (0, path_1.join)((0, os_1.homedir)(), '.config', 'joplin-plugin');
var credentialPath = (0, path_1.join)(configDir, 'credentials.json');
var authenticate = function () { return __awaiter(void 0, void 0, void 0, function () {
    var cachedToken, deviceCodeResponse, device_code, user_code, verification_uri, interval, accessToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getCachedToken()];
            case 1:
                cachedToken = _a.sent();
                if (cachedToken) {
                    logger_1.default.success('Using cached GitHub credentials..');
                    return [2 /*return*/, cachedToken];
                }
                return [4 /*yield*/, initiateDeviceFlow(githubClientId)];
            case 2:
                deviceCodeResponse = _a.sent();
                device_code = deviceCodeResponse.device_code, user_code = deviceCodeResponse.user_code, verification_uri = deviceCodeResponse.verification_uri, interval = deviceCodeResponse.interval;
                logger_1.default.info("\n  ------ GitHub Authentication Required ------\n  1. Your browser will open: ".concat(verification_uri, "\n  2. Enter this code when prompted: ").concat(user_code, "\n\n  Waiting for authorization...\n  "));
                openBrowser(verification_uri);
                return [4 /*yield*/, pollForToken(device_code, interval, githubClientId)];
            case 3:
                accessToken = _a.sent();
                saveToken(accessToken);
                logger_1.default.success('Authenticated successfully!!');
                return [2 /*return*/, accessToken];
        }
    });
}); };
// Opens browser for the given URL based on the OS the user is using
var openBrowser = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var platform, cmd, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                platform = process.platform;
                if (platform === 'win32') {
                    cmd = "start \"\" \"".concat(url, "\"");
                }
                else if (platform === 'darwin') {
                    cmd = "open \"".concat(url, "\"");
                }
                else {
                    cmd = "xdg-open \"".concat(url, "\"");
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, execAsync(cmd)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                logger_1.default.warn("Could not open browser automatically. Please visit: ".concat(url));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var fileExists = function (path) { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, promises_1.access)(path)];
            case 1:
                _b.sent();
                return [2 /*return*/, true];
            case 2:
                _a = _b.sent();
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getCachedToken = function () { return __awaiter(void 0, void 0, void 0, function () {
    var hasCachedToken, creds, _a, _b, expiresAt, thirtyMinFromNow, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, fileExists(credentialPath)];
            case 1:
                hasCachedToken = _d.sent();
                if (!hasCachedToken) return [3 /*break*/, 5];
                _d.label = 2;
            case 2:
                _d.trys.push([2, 4, , 5]);
                _b = (_a = JSON).parse;
                return [4 /*yield*/, (0, promises_1.readFile)(credentialPath, 'utf8')];
            case 3:
                creds = _b.apply(_a, [_d.sent()]);
                expiresAt = new Date(creds.expires_at);
                thirtyMinFromNow = new Date();
                thirtyMinFromNow.setMinutes(thirtyMinFromNow.getMinutes() + 30);
                if (expiresAt > thirtyMinFromNow) {
                    return [2 /*return*/, creds.token];
                }
                return [3 /*break*/, 5];
            case 4:
                _c = _d.sent();
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/, null];
        }
    });
}); };
var initiateDeviceFlow = function (clientId) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch('https://github.com/login/device/code', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        client_id: clientId,
                        scope: 'public_repo',
                    }),
                })];
            case 1:
                response = _a.sent();
                if (!response.ok) {
                    throw new Error("Failed to initiate device flow: ".concat(response.statusText));
                }
                return [4 /*yield*/, response.json()];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
// Checks if the user is authenticated or not every few seconds 
// and returns the access_token if authenticated
var pollForToken = function (deviceCode, initialInterval, clientId) { return __awaiter(void 0, void 0, void 0, function () {
    var interval, response, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                interval = initialInterval;
                _a.label = 1;
            case 1:
                if (!true) return [3 /*break*/, 5];
                // few second pause between each request
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, interval * 1000); })];
            case 2:
                // few second pause between each request
                _a.sent();
                // shows a dot for each try in the terminal
                process.stdout.write('.');
                return [4 /*yield*/, fetch('https://github.com/login/oauth/access_token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify({
                            client_id: clientId,
                            device_code: deviceCode,
                            grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
                        }),
                    })];
            case 3:
                response = _a.sent();
                if (!response.ok) {
                    throw new Error("Polling failed: ".concat(response.statusText));
                }
                return [4 /*yield*/, response.json()];
            case 4:
                data = _a.sent();
                if (data.access_token) {
                    process.stdout.write('\n');
                    return [2 /*return*/, data.access_token];
                }
                if (!data.access_token && !data.error) {
                    throw new Error('Unexpected response from GitHub. Try again.');
                }
                // Continue the loop if authorization is pending or we hit rate limit
                if (data.error) {
                    switch (data.error) {
                        case 'authorization_pending':
                            return [3 /*break*/, 1];
                        case 'slow_down':
                            interval += 5;
                            return [3 /*break*/, 1];
                        case 'expired_token':
                            throw new Error('\n Authentication timed out. Run the command again.');
                        case 'access_denied':
                            throw new Error('\n Authentication was denied.');
                        default:
                            throw new Error("\n Authentication error: ".concat(data.error_description || data.error));
                    }
                }
                return [3 /*break*/, 1];
            case 5: return [2 /*return*/];
        }
    });
}); };
var saveToken = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var expiresAt, creds;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdir)(configDir, { recursive: true })];
            case 1:
                _a.sent();
                expiresAt = new Date();
                expiresAt.setHours(expiresAt.getHours() + 8);
                creds = {
                    token: token,
                    expires_at: expiresAt.toISOString(),
                };
                return [4 /*yield*/, (0, promises_1.writeFile)(credentialPath, JSON.stringify(creds, null, 2), {
                        mode: 384,
                        encoding: 'utf8',
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.default = authenticate;
