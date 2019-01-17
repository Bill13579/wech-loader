import { LOWER_CASE_LETTERS, UPPER_CASE_LETTERS, NUMBER_DIGITS } from "./constants"
import { getApi } from "./apiDocs"

class ScanError extends Error {}
class APIError extends Error {}

function checkWord(i, chars, word) {
    return chars.slice(i, i + word.length).join("") === word;
}

function isWhitespace(char) {
    return char === "\r" || char === "\n" || char === "\t" || char === "\f" || char === "\v" || char === " ";
}

function skipWhitespace(i, chars) {
    for (;;) {
        if (i >= chars.length) return -1;
        if (isWhitespace(chars[i])) {
            i++;
        } else {
            return i;
        }
    }
}

function getApiName(i, chars) {
    let apiName = "";
    while (chars[i] === "$" || chars[i] === "_" || LOWER_CASE_LETTERS.includes(chars[i]) || UPPER_CASE_LETTERS.includes(chars[i]) || NUMBER_DIGITS.includes(chars[i]) || chars[i] === "." || (isWhitespace(chars[i]) && chars[skipWhitespace(i, chars)] === ".")) {
        if (isWhitespace(chars[i])) i = skipWhitespace(i, chars);
        apiName += chars[i];
        i++;
    }
    return {
        apiName: apiName,
        i: i
    };
}

function getParams(i, chars) {
    let parameters = [];
    let level = 0;
    let tmp = "";
    i++;
    for (;;) {
        if (chars[i] === "(") {
            level++;
            tmp += chars[i];
        } else if (chars[i] === ")") {
            level--;
            if (level < 0) {
                parameters.push(tmp);
                break;
            }
            tmp += chars[i];
        } else if (chars[i] === ",") {
            if (level === 0) {
                parameters.push(tmp);
                tmp = "";
            }
        } else {
            tmp += chars[i];
        }
        i++;
    }
    return {
        parameters: parameters,
        i: i
    };
}

export class ApiCall {
    constructor(startPos, stopPos, api, functionCallInfo) {
        this.startPos = startPos;
        this.stopPos = stopPos;
        this.api = api;
        this.functionCallInfo = functionCallInfo;
    }
}

export default function scan(chars) {
    let apiCalls = [];
    for (let i = 0; i < chars.length; i++) {
        if (chars[i] === "b" && checkWord(i + 1, chars, "rowser")) {
            let startPos = i;
            i += 7;
            i = skipWhitespace(i, chars);
            if (chars[i] === ".") {
                i++;
                let apiName = getApiName(i, chars); i = apiName.i; apiName = apiName.apiName;
                let api = getApi(apiName);
                if (api === null) {
                    this.emitError(new ScanError(`Unknown API '${apiName}'`));
                    continue;
                }
                if (!api.subApi.type) {
                    this.emitError(new ScanError(`Unknown sub-API '${api.api}.${api.subApi.name}'`));
                    continue;
                }
                if (!api.subApi.docs.availableInChrome) {
                    this.emitError(new APIError(`API '${api.api}.${api.subApi.name}' is not available in Chrome`));
                    continue;
                }
                let beforeSkippingIndex = i;
                i = skipWhitespace(i, chars);
                if (api.subApi.type === "function" && i !== -1 && chars[i] === "(") {
                    let paramStartPos = i + 1;
                    let params = getParams(i, chars); i = params.i; params = params.parameters;
                    let nestedApiCalls = new Array(params.length);
                    let stopPos = ++i;
                    apiCalls.push(new ApiCall(startPos, stopPos, api, { paramPos: paramStartPos, params: params, nestedApiCalls: nestedApiCalls }));
                    for (let j = 0; j < params.length; j++) {
                        let param = params[j];
                        nestedApiCalls[j] = scan(param);
                    }
                } else {
                    apiCalls.push(new ApiCall(startPos, i === -1 ? beforeSkippingIndex : i, api));
                    i++;
                }
            }
        }
    }
    return apiCalls;
}
