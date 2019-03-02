import { getOptions } from "loader-utils"
import validateOptions from "schema-utils"
import scan from "./scanner"
import transpile from "./transpiler";

const schema = {
    type: "object",
    properties: {
    }
};

export default function loader(source) {
    const options = getOptions(this) || {};
    validateOptions(schema, options, "WebExtension Chrome Port Loader");
    const chars = source.split("");
    let apiCalls = scan.bind(this)(chars);
    return transpile(chars, apiCalls).join("");
}
