"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processUndefined = exports.enumerableKeys = exports.spreadProp = exports.proxy = exports.diffAndCloneA = exports.isPlainObject = exports.hasOwn = void 0;
const core_1 = require("@mpxjs/core");
const base_1 = require("./base");
const hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
}
exports.hasOwn = hasOwn;
function isPlainObject(value) {
    var _a;
    if (value === null || typeof value !== 'object' || (0, base_1.type)(value) !== 'Object')
        return false;
    const proto = Object.getPrototypeOf(value);
    if (proto === null)
        return true;
    // 处理支付宝接口返回数据对象的__proto__与js中创建对象的__proto__不一致的问题，判断value.__proto__.__proto__ === null时也认为是plainObject
    const innerProto = Object.getPrototypeOf(proto);
    if (proto === Object.prototype || innerProto === null)
        return true;
    // issue #644
    const observeClassInstance = (_a = global.__mpx) === null || _a === void 0 ? void 0 : _a.config.observeClassInstance;
    if (observeClassInstance) {
        if (Array.isArray(observeClassInstance)) {
            for (let i = 0; i < observeClassInstance.length; i++) {
                if (proto === observeClassInstance[i].prototype)
                    return true;
            }
        }
        else {
            return true;
        }
    }
    return false;
}
exports.isPlainObject = isPlainObject;
function diffAndCloneA(a, b) {
    let diffData = null;
    let curPath = '';
    let diff = false;
    function deepDiffAndCloneA(a, b, currentDiff) {
        const setDiff = (val) => {
            if (val) {
                currentDiff = val;
                if (curPath) {
                    diffData = diffData || {};
                    diffData[curPath] = clone;
                }
            }
        };
        let clone = a;
        if (typeof a !== 'object' || a === null) {
            if (!currentDiff)
                setDiff(a !== b);
        }
        else {
            const toString = Object.prototype.toString;
            const className = toString.call(a);
            const sameClass = className === toString.call(b);
            let length;
            let lastPath;
            if (isPlainObject(a)) {
                const keys = Object.keys(a);
                length = keys.length;
                clone = {};
                if (!currentDiff)
                    setDiff(!sameClass || length < Object.keys(b).length || !Object.keys(b).every((key) => hasOwn(a, key)));
                lastPath = curPath;
                for (let i = 0; i < length; i++) {
                    const key = keys[i];
                    curPath += `.${key}`;
                    clone[key] = deepDiffAndCloneA(a[key], sameClass ? b[key] : undefined, currentDiff);
                    curPath = lastPath;
                }
                // 继承原始对象的freeze/seal/preventExtensions操作
                if (Object.isFrozen(a)) {
                    Object.freeze(clone);
                }
                else if (Object.isSealed(a)) {
                    Object.seal(clone);
                }
                else if (!Object.isExtensible(a)) {
                    Object.preventExtensions(clone);
                }
            }
            else if (Array.isArray(a)) {
                length = a.length;
                clone = [];
                if (!currentDiff)
                    setDiff(!sameClass || length < b.length);
                lastPath = curPath;
                for (let i = 0; i < length; i++) {
                    curPath += `[${i}]`;
                    clone[i] = deepDiffAndCloneA(a[i], sameClass ? b[i] : undefined, currentDiff);
                    curPath = lastPath;
                }
                // 继承原始数组的freeze/seal/preventExtensions操作
                if (Object.isFrozen(a)) {
                    Object.freeze(clone);
                }
                else if (Object.isSealed(a)) {
                    Object.seal(clone);
                }
                else if (!Object.isExtensible(a)) {
                    Object.preventExtensions(clone);
                }
            }
            else if (a instanceof RegExp) {
                if (!currentDiff)
                    setDiff(!sameClass || '' + a !== '' + b);
            }
            else if (a instanceof Date) {
                if (!currentDiff)
                    setDiff(!sameClass || +a !== +b);
            }
            else {
                if (!currentDiff)
                    setDiff(!sameClass || a !== b);
            }
        }
        if (currentDiff) {
            diff = currentDiff;
        }
        return clone;
    }
    return {
        clone: deepDiffAndCloneA(a, b, diff),
        diff,
        diffData
    };
}
exports.diffAndCloneA = diffAndCloneA;
function proxy(target, source, keys, readonly, onConflict) {
    keys = keys || Object.keys(source);
    keys.forEach((key) => {
        const descriptor = {
            get() {
                const val = source[key];
                return !(0, core_1.isReactive)(source) && (0, core_1.isRef)(val) ? val.value : val;
            },
            configurable: true,
            enumerable: true
        };
        descriptor.set = readonly
            ? base_1.noop
            : function (val) {
                // 对reactive对象代理时不需要处理ref解包
                if (!(0, core_1.isReactive)(source)) {
                    const oldVal = source[key];
                    if ((0, core_1.isRef)(oldVal) && !(0, core_1.isRef)(val)) {
                        oldVal.value = val;
                        return;
                    }
                }
                source[key] = val;
            };
        if (onConflict) {
            if (key in target) {
                if (onConflict(key) === false)
                    return;
            }
        }
        Object.defineProperty(target, key, descriptor);
    });
    return target;
}
exports.proxy = proxy;
function spreadProp(obj, key) {
    if (hasOwn(obj, key)) {
        const temp = obj[key];
        delete obj[key];
        Object.assign(obj, temp);
    }
    return obj;
}
exports.spreadProp = spreadProp;
// 包含原型链上属性keys
function enumerableKeys(obj) {
    const keys = [];
    for (const key in obj) {
        keys.push(key);
    }
    return keys;
}
exports.enumerableKeys = enumerableKeys;
function processUndefined(obj) {
    const result = {};
    for (const key in obj) {
        if (hasOwn(obj, key)) {
            if (obj[key] !== undefined) {
                result[key] = obj[key];
            }
            else {
                result[key] = '';
            }
        }
    }
    return result;
}
exports.processUndefined = processUndefined;
//# sourceMappingURL=object.js.map
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)
module.exports.default && (module.exports = module.exports.default)