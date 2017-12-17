(function(global) {
  var suites = {},
    checkObj = {
      version: '0.1',
      suite: function(suiteName, onProgress) {
        suites[suiteName] = {
          tests: []
        };

        function suite(name, fun) {
          checkObj.add(suiteName, name, fun);
        }
        suite.run = function(onProgress) {
          checkObj.run(suiteName, onProgress);
        };
        if (onProgress) {
          setTimeout(function() {
            suite.run(onProgress);
          });
        }
        return suite;
      },
      add: function(suite, desc, fun) {
        if (!suites[suite]) checkObj.suite(suite);
        suites[suite].tests.push([desc, fun]);
      },
      run: function(suite, onProgress) {
        if (suites[suite]) {
          //onprogress(completed, total, successes, failureReport, pendingReport, tests)
          //test = [name, function]
          //test[1](done) => done(TrueOrFailureString)
          var i,
            tests = suites[suite].tests,
            total = tests.length,
            completed = 0,
            passed = 0,
            failures = [],
            pending = [],
            pendingReport;

          function update(index) {
            completed++;
            pending[index] = "";
            pendingReport = pending
              .join("\x1f")
              .replace(/\x1f+/g, "\x1f")
              .replace(/^\x1f/, "")
              .replace(/\x1f$/, "");
            onProgress(
              completed,
              total,
              passed,
              failures,
              pendingReport ? pendingReport
              .split("\x1f") : [],
              tests
            );
          }
          for (i = 0; i < total; i++) {
            //pending[i] = "" + i;
            pending[i] = "[" + i + "] " + tests[i]
              [0];
          }
          for (i = 0; i < total; i++) {
            try {
              tests[i][1](
                (function(index) {
                  return function(
                    result) {
                    if (
                      result === true ||
                      result === void 0
                    ) {
                      passed++;
                    } else {
                      failures
                        .push(
                          "[" +
                          index +
                          "] " +
                          tests[
                            index
                          ]
                          [
                            0
                          ] +
                          ": " +
                          (
                            result ||
                            "Failed"
                          )
                        );
                    }
                    update(
                      index
                    );
                  };
                })(i),
                checkObj.eq
              );
            } catch (err) {
              failures.push("[" + i + "] " +
                tests[i][0] + ": " + err.message
              );
              update(i);
            }
          }
        }
      },
      eq: function(a, b, priorA, priorB) {
        var i = ""; // temp variable
        // false if different types => falsy, 0 === [0], '' === []
        if (typeof a !== typeof b) return false;
        // primitive values are compared as strings
        if (typeof a !== "object") return a + i ===
          b + i;
        // false if string representations of objects differ, [] === {}, {} === null
        if (a + i !== b + i) return false;
        //check prior objects for circularity
        if (!priorA) {
          priorA = [];
          priorB = [];
        } else {
          for (i = 0; i < priorA.length; i++) {
            if (priorA[i] === a) return priorB[i] === b;
            if (priorB[i] === b) return false; //priorA[i] !== a;
          }
        }
        priorA.push(a);
        priorB.push(b);
        for (i in a) {
          // check if a and b has same properties with same values, recursively
          if (
            a.hasOwnProperty(i) &&
            (!b.hasOwnProperty(i) || !checkObj.eq(
              a[i], b[i], priorA, priorB))
          )
            return false;
        }
        for (i in b) {
          // check if b has additional properties
          if (b.hasOwnProperty(i) && !a.hasOwnProperty(
              i)) return false;
        }
        return true;
      }
    };
  global["check"] = checkObj;
})(window);
