# check.js
Small JavaScript testing library for ES3

```javascript
// create new test suite

var tests = check.suite('Test suite #1');

// add test(s)

tests('Test 1: addition', function(done, eq){
  done(eq(3 + 4, 7))
});

// run tests

tests.run(function(completed, total, successes){
  console.log(
    completed + 'tests completed of ' + total + 
    ', ' + successes + 'successes.'
  )
});
```

## Documentation

### `check.suite(suiteName [, onProgress])`

Creates a new test suite with the name `suiteName`, overwrites any existing test suite with the same name. Return a tests suite instance (see below). Provide an optional `onProgress` function (see `check.run()` below) to autorun the test suite after page load.

### `check.add(suiteName, testDescription, testFunction)`

### `check.run(suiteName, onProgress)`

### `check.eq(expression1, expression2)`

### Test suite instance

#### `TestSuiteInstance(testDescription, testFunction)`

Shorthand for `check.add(suiteName, testDescription, testFunction)`.

#### `TestSuiteInstance.run(onProgress)`

Shorthand for `check.run(suiteName, onProgress)`.

### The `onProgress` function

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
