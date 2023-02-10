"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.warn = void 0;
const base_1 = require("./base");
const isDev = process.env.NODE_ENV !== 'production';
function warn(msg, location, e) {
    var _a;
    const condition = (_a = global.__mpx) === null || _a === void 0 ? void 0 : _a.config.ignoreWarning;
    let ignore = false;
    if (typeof condition === 'boolean') {
        ignore = condition;
    }
    else if (typeof condition === 'string') {
        ignore = msg.indexOf(condition) !== -1;
    }
    else if (typeof condition === 'function') {
        ignore = condition(msg, location, e);
    }
    else if (condition instanceof RegExp) {
        ignore = condition.test(msg);
    }
    if (!ignore)
        return log('warn', msg, location, e);
}
exports.warn = warn;
function error(msg, location, e) {
    var _a;
    const errorHandler = (_a = global.__mpx) === null || _a === void 0 ? void 0 : _a.config.errorHandler;
    if ((0, base_1.isFunction)(errorHandler)) {
        errorHandler(msg, location, e);
    }
    return log('error', msg, location, e);
}
exports.error = error;
function log(type, msg, location, e) {
    if (isDev) {
        let header = `[Mpx runtime ${type}]: `;
        if (location) {
            header = `[Mpx runtime ${type} at ${location}]: `;
        }
        console[type](header + msg);
        if (e)
            console[type](e);
    }
}
//# sourceMappingURL=log.js.map
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)