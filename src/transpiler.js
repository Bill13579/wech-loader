const CHROME_PROMISE_ASYNC_CALLBACK = `(...a) => { if (chrome.runtime.lastError) { reject(chrome.runtime.lastError.message); } else { resolve(...a); } }`;

function apiCallAsChromeApiCode(apiCall) {
    if (apiCall.api.subApi.type === "function") {
        let transpiledParams = "";
        for (let i = 0; i < apiCall.functionCallInfo.params.length; i++) {
            if (i !== 0) transpiledParams += ", ";
            let param = apiCall.functionCallInfo.params[i];
            let nestedApiCalls = apiCall.functionCallInfo.nestedApiCalls[i];
            transpiledParams += transpile(param.split(""), nestedApiCalls).join("");
        }
        if (apiCall.api.subApi.docs.async) {
            return `(new Promise((resolve, reject) => { chrome.${apiCall.api.api}.${apiCall.api.subApi.name}(${transpiledParams}, ${CHROME_PROMISE_ASYNC_CALLBACK}); }))`;
        } else {
            return `chrome.${apiCall.api.api}.${apiCall.api.subApi.name}(${transpiledParams})`;
        }
    } else {
        return `chrome.${apiCall.api.api}.${apiCall.api.subApi.name}`;
    }
}

export default function transpile(chars, apiCalls) {
    while (apiCalls.length > 0) {
        let apiCall = apiCalls.pop();
        let transpiled = apiCallAsChromeApiCode(apiCall);
        chars.splice(apiCall.startPos, apiCall.stopPos - apiCall.startPos, ...transpiled.split(""));
        let diff = (apiCall.startPos + transpiled.length) - apiCall.stopPos;
        for (let i = 0; i < apiCalls.length; i++) {
            apiCalls[i].stopPos += diff;
        }
    }
    return chars;
}
