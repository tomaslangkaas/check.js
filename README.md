# check.js
Small JavaScript testing library for ES3 runtimes

```javascript
// create new test suite instance

var tests = check.suite('Test suite #1');

// add test(s)

tests('Test 1: add 3 to 4', function(done, eq){
  // call done() to resolve test, 
  // use eq() to check that expressions are equivalent
  done(eq(3 + 4, 7));
});

// run tests

tests.run(function(completed, total, successes){
  console.log(
    completed + 'tests completed of ' + total + 
    ', ' + successes + 'successes.'
  )
});
```

## Reference documentation

### `check.suite(suiteName [, onProgress])`

Creates a new test suite with the name `suiteName`, overwrites any existing test suite with the same name. Returns a tests suite instance (see below). Provide an optional `onProgress` function (see `check.run()` below) to autorun the test suite after page load.

### `check.add(suiteName, testDescription, testFunction)`

Add a test to the suite `suiteName`. If the suite does not exist yet, it will be created. Provide a descriptive string, `testDescription`, and a function, `testFunction`, that executes the test. The test function is provided with two arguments, the function `done()` and the function `eq()`. The function `eq()` is a reference to `check.eq()`, for convenience. The function `done()` is a callback to resolve the test (see below).

### `check.run(suiteName, onProgress)`

Run all tests in the suite `suiteName`, call `onProgress()` (see below) after each test is resolved.

### `check.eq(expression1, expression2)`

Utility function for comparing expressions for equivalence, returns `true` if equivalent, `false` otherwise. Accepts objects, nested objects, arrays, nested arrays, dates, JavaScript primitive values and literal values.

```javascript
check.eq({a:1, b:2},
         {b:2, a:1});     // true
check.eq(['a'], {0:'a'})  // false, array is not equivalent to object
check.eq(+Infinity, 1/0); // true, both are positive Infinity
check.eq(null, {});       // false
check.eq(null, null);     // true
check.eq(0, '0');         // false, different types
check.eq(Number.isNaN, 
         Number.isNaN);   // true, identifies NaN values
check.eq(function(){a+b},
         function(){a+b}) // true, compares functions as strings
```

### Test suite instance functionality

#### `TestSuiteInstance(testDescription, testFunction)`

Shorthand for `check.add(suiteName, testDescription, testFunction)`.

```javascript
// this code

check.add('Test suite #1', 'Test 1: add 3 to 4', function(done, eq){
  done(eq(3 + 4, 7));
});

// is equivalent to this code

var tests = check.suite('Test suite #1');
tests('Test 1: add 3 to 4', function(done, eq){
  done(eq(3 + 4, 7));
});
```

#### `TestSuiteInstance.run(onProgress)`

Shorthand for `check.run(suiteName, onProgress)`.

### The `done()` function

Each test function is provided with a callback function, `done()`, to resolve the test. If `done()` is called without any argument or with an argument of `true` or `undefined`, the test is considered a success. If called with a falsy value, the test is considered failed. If called with a string or another truthy value, the test is considered a fail, with the provided argument converted to a string to be used as a failure message in the failure array. 

### The `onProgress()` function

Each time a test is resolved (completes or fails), the `onProgress` function is called with 6 arguments:

```javascript
onProgress(
  completed, // integer of completed/resolved tests
  total,     // integer of total tests in suite
  successes, // integer of successful tests
  failures,  // array of failed tests
  pending,   // array of pending/unresolved tests
  testsArray // array of tests, each index is an array of [testDescription, testFunction]
)
```

### Running asynchronuous tests

Each test function is provided with the callback function `done()` to resolve the test. This allows for asynchronuous test functions, e.g.

```javascript
check.add('Async test suite', 'Async test #1', function(done, eq){
  setTimeout(done, 1234); // calls done() about 1234 msecs after the test is run
});
```

Note that errors thrown in async functions will not be captured by the `check` testrunner.

### Capturing errors

For synchronuous tests, the `check` testrunner captures errors and resolves the test. For asynchronuous tests, errors must be captured manually.

```javascript
check.add('Error test suite', 'Error test #1: Throw error' function(done, eq){
  throw Error('This message will show in the failure array').
});

check.add('Error test suite', 'Error test #2: Create error', function(done, eq){
  callUnexistingFunction(); // this does not exist, throws an error which will be captured
  done();
});

check.add('Error test suite', 'Error test #3: Async error', function(done, eq){
  setTimeout(function(){
    try{ // errors are not automatically captured in async tests
      callUnexistingFunction();
      done();
    }catch(err){ // catch errors manually
      done(err.message);
    }
  }, 2000);
});
```
