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
var child_process_1 = require("child_process");
var util_1 = require("util");
var logger_1 = require("../utils/logger");
var execAsync = (0, util_1.promisify)(child_process_1.exec);
// Verifies if the user has pushed the local code which he is going to publish on github or not
var verifyGitState = function () { return __awaiter(void 0, void 0, void 0, function () {
    var runGit, status, commitHash, currentBranch, remoteHeadLine, parts, remoteHash;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                runGit = function (command, errorMessage) { return __awaiter(void 0, void 0, void 0, function () {
                    var stdout, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, execAsync(command, { encoding: 'utf8', cwd: process.cwd() })];
                            case 1:
                                stdout = (_a.sent()).stdout;
                                return [2 /*return*/, stdout.trim()];
                            case 2:
                                error_1 = _a.sent();
                                if (error_1 instanceof Error) {
                                    error_1.message = "".concat(errorMessage, ": ").concat(error_1.message);
                                }
                                throw error_1;
                            case 3: return [2 /*return*/];
                        }
                    });
                }); };
                // Checks if the current folder is a git repository or not
                return [4 /*yield*/, runGit('git rev-parse --is-inside-work-tree', 'The current directory is not a git repository or git is not installed.')];
            case 1:
                // Checks if the current folder is a git repository or not
                _a.sent();
                return [4 /*yield*/, runGit('git status --porcelain', 'Failed to check git status. Ensure git is installed and configured.')];
            case 2:
                status = _a.sent();
                if (status !== '') {
                    throw new Error('You have uncommitted changes. Please commit or stash them before publishing.');
                }
                logger_1.default.success('Working tree is clean.');
                return [4 /*yield*/, runGit('git rev-parse HEAD', 'Could not get commit hash. Ensure you are in a valid Git repository with at least one commit.')];
            case 3:
                commitHash = _a.sent();
                if (commitHash.length !== 40) {
                    throw new Error('Failed to extract a valid commit hash. Ensure that git is properly initialized and you have made at least one local commit (git commit) before publishing.');
                }
                logger_1.default.success("Commit hash extracted: ".concat(commitHash));
                // check if the local project is linked to github
                return [4 /*yield*/, runGit('git remote get-url origin', 'No remote named \'origin\' found. Make sure your plugin repository is hosted on GitHub.')];
            case 4:
                // check if the local project is linked to github
                _a.sent();
                return [4 /*yield*/, runGit('git rev-parse --abbrev-ref HEAD', 'Failed to retrieve current branch name. Ensure git is configured correctly.')];
            case 5:
                currentBranch = _a.sent();
                if (currentBranch === 'HEAD') {
                    throw new Error('You are in a detached HEAD state. Checkout a branch (e.g. git checkout main) and push before publishing.');
                }
                return [4 /*yield*/, runGit("git ls-remote origin ".concat(currentBranch), 'Could not retrieve remote HEAD. Make sure you have pushed your changes and have an internet connection.')];
            case 6:
                remoteHeadLine = _a.sent();
                if (!remoteHeadLine) {
                    throw new Error('Remote HEAD is empty. Make sure you have pushed your changes.');
                }
                parts = remoteHeadLine.split('\n')[0].split(/\s+/);
                if (parts.length < 2) {
                    throw new Error("Unexpected git ls-remote output: \"".concat(remoteHeadLine, "\". Make sure your git remote and branch are configured correctly."));
                }
                remoteHash = parts[0];
                if (remoteHash.length !== 40) {
                    throw new Error('Failed to extract a valid remote commit hash.');
                }
                if (remoteHash !== commitHash) {
                    throw new Error('Your local commit has not been pushed to GitHub. Run git push then try publishing again.');
                }
                logger_1.default.success('Local commit is synced with remote.');
                return [2 /*return*/, commitHash];
        }
    });
}); };
exports.default = verifyGitState;
