import fs from "fs"
import path from "path"
import compiler from "./compiler"
import assert from "assert"

describe("loader", () => {
    function testPart(name, should) {
        it(should, () => {
            return compiler("loader-tests/" + name + "/code.js").then(stats => {
                const output = stats.toJson().modules[0].source;
                assert.equal(output, fs.readFileSync(path.join(__dirname, "loader-tests/" + name + "/expected.js")).toString());
            });
        });
    }
    testPart("api-property", "should replace 'browser' to 'chrome'");
    testPart("browser-to-chrome", "should replace 'browser' to 'chrome'");
    testPart("wrap-promise", "should replace 'browser' to 'chrome', wrap a Promise, and add a callback");

    it("should emitError if an API is unknown", () => {
        return compiler("loader-tests/unknown-api/code.js").then(() => {
            assert.fail("should not have succeeded");
        }).catch(err => {
            assert.equal(err.length, 1);
            assert.equal(err[0].message, `Module Error (from ../src/loader.js):\nUnknown API 'dummy_api'`);
        });
    });

    it("should emitError if an API function is unknown", () => {
        return compiler("loader-tests/unknown-api-function/code.js").then(() => {
            assert.fail("should not have succeeded");
        }).catch(err => {
            assert.equal(err.length, 1);
            assert.equal(err[0].message, `Module Error (from ../src/loader.js):\nUnknown sub-API 'tabs.dummy_api'`);
        });
    });

    it("should emitError if an API is unavailable on Chrome", () => {
        return compiler("loader-tests/unavailable-api/code.js").then(() => {
            assert.fail("should not have succeeded");
        }).catch(err => {
            assert.equal(err.length, 1);
            assert.equal(err[0].message, `Module Error (from ../src/loader.js):\nAPI 'tabs.captureTab' is not available in Chrome`);
        });
    });
});
