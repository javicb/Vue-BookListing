const fs = require('fs');
const path = require('path');
const assert = require('chai').assert;
const parse5 = require('parse5');
const esquery = require('esquery');
const esprima = require('esprima');

describe('BookForm.vue', () => {
  it('should contain a data function that returns bookTitle and bookAuthor @book-form-contains-data', () => {
    let file;
    try {
      file = fs.readFileSync(path.join(process.cwd(), 'src/components/BookForm.vue'), 'utf8');
    } catch (e) {
      assert(false, 'The BookForm component does not exist');
    }
    const document = parse5.parseFragment(file.replace(/\n/g, ''), { locationInfo: true });
    const nodes = document.childNodes;
    const script = nodes.filter(node => node.nodeName === 'script');

    const ast = esprima.parse(script[0].childNodes[0].value, { sourceType: 'module' });
    const data = esquery(ast, 'Property[key.name=data]');
    assert(data.length > 0, 'data function return is not present');

    let results = esquery(data[0], 'Property[key.name=bookTitle] > .value[value=""]');
    assert(results.length > 0, 'bookTitle property is not defined with a blank string value');

    results = esquery(data[0], 'Property[key.name=bookAuthor] > .value[value=""]');
    assert(results.length > 0, 'bookAuthor property is not defined with a blank string value');
  });
});