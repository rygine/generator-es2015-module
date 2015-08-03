import tape from 'tape';
import * as <%= module %> from '../src/<%= module %>';

tape('test', (t) => {

  t.test('true is truthy', (t) => {
    t.plan(1);
    t.ok(true);
  });

});
