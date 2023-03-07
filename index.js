const core = require('@actions/core');
const {parse, applyDefaultType, toValidRef} = require('./lib');

const ref = core.getInput('ref', {trimWhitespace: true});
const defaultRefType = core.getInput('default-ref-type', {trimWhitespace: true});

try {
    let {refType, refName} = parse(ref);
    refType = applyDefaultType(refType, refName, defaultRefType);
    core.setOutput("ref-type", refType || '');
    core.setOutput("ref-name", refName || '');

    const fullRef = toValidRef(refType, refName);
    core.setOutput("ref", fullRef || '');
} catch (e) {
    // There are no known error cases.
    core.setFailed(e.message);
}
