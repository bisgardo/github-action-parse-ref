const {parse, applyDefaultType, toValidRef} = require('./lib');

function toValidRefWithDefault(refType, refName, defaultRefType='') {
    return toValidRef(applyDefaultType(refType, refName, defaultRefType), refName);
}

test(`parse empty ref`, () => {
    const {refType, refName} = parse('');
    expect(refType).toEqual(null);
    expect(refName).toEqual('');

    expect(toValidRefWithDefault(refType, refName)).toEqual(null);
    expect(toValidRefWithDefault(refType, refName, 'mydefault')).toEqual(null);
})

test(`parse shorthand ref without slash`, () => {
    const {refType, refName} = parse('myref');
    expect(refType).toEqual(null);
    expect(refName).toEqual('myref');

    expect(toValidRefWithDefault(refType, refName)).toEqual(null);
    expect(toValidRefWithDefault(refType, refName, 'mydefault')).toEqual('refs/mydefault/myref');
});

test(`parse shorthand ref with inner slash`, () => {
    const {refType, refName} = parse('my/ref');
    expect(refType).toEqual(null);
    expect(refName).toEqual('my/ref');

    expect(toValidRefWithDefault(refType, refName)).toEqual(null);
    expect(toValidRefWithDefault(refType, refName, 'mydefault')).toEqual('refs/mydefault/my/ref');
});

test(`parse shorthand ref with double inner slash`, () => {
    const {refType, refName} = parse('my//ref');
    expect(refType).toEqual(null);
    expect(refName).toEqual('my//ref');

    expect(toValidRefWithDefault(refType, refName)).toEqual(null);
    expect(toValidRefWithDefault(refType, refName, 'mydefault')).toEqual(null);
});

test(`parse shorthand ref starting with slash`, () => {
    const {refType, refName} = parse('/myref');
    expect(refType).toEqual(null);
    expect(refName).toEqual('/myref');

    expect(toValidRefWithDefault(refType, refName)).toEqual(null);
    expect(toValidRefWithDefault(refType, refName, 'mydefault')).toEqual(null);
});

test(`parse shorthand ref ending with slash`, () => {
    const {refType, refName} = parse('myref/');
    expect(refType).toEqual(null);
    expect(refName).toEqual('myref/');

    expect(toValidRefWithDefault(refType, refName)).toEqual(null);
    expect(toValidRefWithDefault(refType, refName, 'mydefault')).toEqual(null);
});

test(`parse 'refs' without '/' is treated as shorthand `, () => {
    const {refType, refName} = parse('refs');
    expect(refType).toEqual(null);
    expect(refName).toEqual('refs');

    expect(toValidRefWithDefault(refType, refName)).toEqual(null);
    expect(toValidRefWithDefault(refType, refName, 'mydefault')).toEqual('refs/mydefault/refs');
});

test(`parse "full" empty ref`, () => {
    const {refType, refName} = parse('refs/');
    expect(refType).toEqual('');
    expect(refName).toEqual(null);

    expect(toValidRefWithDefault(refType, refName)).toEqual(null);
    expect(toValidRefWithDefault(refType, refName, 'mydefault')).toEqual(null);
});

test(`parse full ref with type and name`, () => {
    const {refType, refName} = parse('refs/mytype/myname');
    expect(refType).toEqual('mytype');
    expect(refName).toEqual('myname');

    expect(toValidRefWithDefault(refType, refName)).toEqual('refs/mytype/myname');
    expect(toValidRefWithDefault(refType, refName, 'mydefault')).toEqual('refs/mytype/myname');
});

test(`parse full ref without name`, () => {
    const {refType, refName} = parse('refs/mytype');
    expect(refType).toEqual('mytype');
    expect(refName).toEqual(null);

    expect(toValidRefWithDefault(refType, refName)).toEqual('refs/mytype');
    expect(toValidRefWithDefault(refType, refName, 'mydefault')).toEqual('refs/mytype');
});

test(`parse full ref with empty name`, () => {
    const {refType, refName} = parse('refs/mytype/');
    expect(refType).toEqual('mytype');
    expect(refName).toEqual('');

    expect(toValidRefWithDefault(refType, refName)).toEqual(null);
    expect(toValidRefWithDefault(refType, refName, 'mydefault')).toEqual(null);
});

test(`parse full ref with empty type`, () => {
    const {refType, refName} = parse('refs//myname');
    expect(refType).toEqual('');
    expect(refName).toEqual('myname');

    expect(toValidRefWithDefault(refType, refName)).toEqual(null);
    expect(toValidRefWithDefault(refType, refName, 'mydefault')).toEqual(null);
});

test(`default type is applied for missing type and nonempty name`, () => {
    const refType = applyDefaultType(null,'myname', "mydefault")
    expect(refType).toEqual('mydefault');
});

test(`default type is not applied for missing type and empty name`, () => {
    const refType = applyDefaultType(null,'', "mydefault")
    expect(refType).toEqual(null);
});

test(`default type is not applied for empty type`, () => {
    const refType = applyDefaultType('', 'myname', "mydefault")
    expect(refType).toEqual('');
});

test(`default type is not applied for nonempty type`, () => {
    const refType = applyDefaultType('mytype','myname', "mydefault")
    expect(refType).toEqual('mytype');
});
