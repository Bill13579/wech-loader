import fs from "fs"
import path from "path"
import apiDocs from "./data/api-docs.json"

export function getApi(apiCall) {
    apiCall = apiCall.replace(/\s/g, "");
    let apis = Object.keys(apiDocs);
    for (let api of apis) {
        if (apiCall.startsWith(api)) {
            let subApi = apiCall.substring(api.length + 1, apiCall.length);
            let apiDoc = apiDocs[api];
            for (let type in apiDoc.types) {
                if (subApi.startsWith(type)) {
                    return {
                        api: api,
                        subApi: {
                            type: "type",
                            name: type,
                            docs: apiDoc.types[type]
                        }
                    };
                }
            }
            for (let property in apiDoc.properties) {
                if (subApi.startsWith(property)) {
                    return {
                        api: api,
                        subApi: {
                            type: "property",
                            name: property,
                            docs: apiDoc.properties[property]
                        }
                    };
                }
            }
            for (let func in apiDoc.functions) {
                if (subApi.startsWith(func)) {
                    return {
                        api: api,
                        subApi: {
                            type: "function",
                            name: func,
                            docs: apiDoc.functions[func]
                        }
                    };
                }
            }
            for (let event in apiDoc.events) {
                if (subApi.startsWith(event)) {
                    return {
                        api: api,
                        subApi: {
                            type: "event",
                            name: event,
                            docs: apiDoc.events[event]
                        }
                    };
                }
            }
            return {
                api: api,
                subApi: {
                    name: subApi
                }
            };
        }
    }
    return null;
}
