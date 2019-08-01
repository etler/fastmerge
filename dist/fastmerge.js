"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isArray = Array.isArray;
const isObject = function (object) {
    return object != null && typeof object == 'object' && !isArray(object);
};
const isFlat = function (object) {
    for (let key in object) {
        const item = object[key];
        if (isObject(item) || isArray(item)) {
            return false;
        }
    }
    return true;
};
exports.merge = function (base, ...objects) {
    let result = base;
    for (const object of objects) {
        if (isArray(result) && isArray(object)) {
            result = result.slice(0, object.length);
        }
        const stack = [{ result, object }];
        while (stack.length) {
            const slice = stack.pop() || { result: {}, object: {} };
            for (const key in slice.object) {
                const itemObject = slice.object[key];
                const itemResult = slice.result[key];
                if (isFlat(itemObject)) {
                    if (isObject(itemObject) && isObject(itemResult)) {
                        slice.result[key] = Object.assign({}, itemResult, itemObject);
                    }
                    else {
                        slice.result[key] = itemObject;
                    }
                }
                else {
                    if (isArray(itemObject) && isArray(itemResult)) {
                        slice.result[key] = itemResult.slice(0, itemObject.length);
                    }
                    else if (isArray(itemObject) && !isArray(itemResult)) {
                        slice.result[key] = [];
                    }
                    else if (isObject(itemObject) && !isObject(itemResult)) {
                        slice.result[key] = {};
                    }
                    stack.push({
                        result: slice.result[key],
                        object: slice.object[key],
                    });
                }
            }
        }
    }
    return result;
};
function jsonClone(object) {
    return JSON.parse(JSON.stringify(object));
}
exports.mergeImmutable = function (...objects) {
    const objectsClone = jsonClone(objects);
    return exports.merge(objectsClone[0], ...objectsClone.slice(1));
};
//# sourceMappingURL=fastmerge.js.map