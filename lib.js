function parse(ref) {
    const refsPrefix = 'refs/';
    if (!ref.startsWith(refsPrefix)) {
        // The ref is a shorthand.
        return {refType: null, refName: ref}
    }
    const typeBeginIdx = refsPrefix.length;
    const typeEndIdx = ref.indexOf('/', typeBeginIdx);
    if (typeEndIdx < 0) {
        // 'ref' matches 'refs/<r>' where '<r>' has no slashes, making it a custom ref.
        // We put the value in "type" for consistency with the result if the value had slashes in it.
        return {refType: ref.substring(typeBeginIdx), refName: null};
    }
    return {refType: ref.substring(typeBeginIdx, typeEndIdx), refName: ref.substring(typeEndIdx + 1)}
}

function applyDefaultType(refType, refName, defaultRefType) {
    if (refType === null && refName) {
        return defaultRefType;
    }
    return refType;
}

function isValidRefName(n) {
    return n && !(n.startsWith('/') || n.endsWith('/') || n.includes('//'));
}

function toValidRef(refType, refName) {
    if (!refType || refName !== null && !isValidRefName(refName)) {
        return null;
    }
    let res = `refs/${refType}`
    if (refName) {
        res += `/${refName}`
    }
    return res;
}

module.exports = {parse, applyDefaultType, toValidRef};
