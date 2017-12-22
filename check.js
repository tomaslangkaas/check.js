(function(global) {
  var suites = {},
    defer = setTimeout,
    checkObj = {
      version: "0.2",
      suite: function(suiteName, onProgress) {
        suites[suiteName] = {
          tests: []
        };

        function suite(name, fun) {
          checkObj.add(suiteName, name, fun);
          return suite;
        }
        suite.run = function(onProgress) {
          checkObj.run(suiteName, onProgress);
        };
        if (onProgress) {
          defer(function() {
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
        suite = '' + suite;
        if (suites[suite]) {
          var i,
            tests = suites[suite].tests,
            total = tests.length,
            completed = 0,
            passed = 0,
            failures = [],
            pending = [],
            pendingReport,
            report;
          if (typeof onProgress !== "function") {
            report = document.getElementById("" + onProgress) ||
              console || {};
            onProgress = function(completed, total, successes,
              failureReport, pending) {
              var pendingLength = pending.length,
                str = suite + "\n" + Array(suite.length + 1).join(
                  '=') + '\n' + "Completed: " + completed +
                " of " + total + "\nSuccesses: " + successes +
                " of " + completed + (pendingLength ?
                  "\nPending tests (" + pendingLength + "):\n" +
                  (pendingLength > 3 ? pending.slice(0, 3).concat(
                    '...') : pending).join("\n") : "") + (
                  failureReport ? "\nFailing tests:\n" +
                  failureReport.join("\n") : "");
              if (report.log) {
                report.log(str);
              } else {
                report.innerHTML = str;
              }
            };
          }

          function update(index) {
            if (pending[index]) {
              completed++;
              pending[index] = "";
            }
            pendingReport = pending.join("\x1f").replace(/\x1f+/g,
              "\x1f").replace(/^\x1f/, "").replace(/\x1f$/, "");
            onProgress(completed, total, passed, failures,
              pendingReport ? pendingReport.split("\x1f") : [],
              tests);
          }
          for (i = 0; i < total; i++) {
            pending[i] = "[" + i + "] " + tests[i][0];
          }
          update();
          for (i = 0; i < total; i++) {
            try {
              tests[i][1](
                (function(index) {
                  return function(result) {
                    if (result === true || result === void 0) {
                      passed++;
                    } else {
                      failures.push("[" + index + "] " +
                        tests[index]
                        [0] + ": " + (result || "Failed")
                      );
                    }
                    update(index);
                  };
                })(i), checkObj.eq);
            } catch (err) {
              failures.push("[" + i + "] " + tests[i][0] + ": " +
                err.message);
              update(i);
            }
          }
        }
      },
      eq: function(a, b, priorA, priorB) {
        var i = ""; // temp variable, default to empty string
        if (typeof a !== typeof b) return false;
        if (typeof a !== "object") return a + i === b + i;
        if (a + i !== b + i) return false;
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
          if (a.hasOwnProperty(i) && (!b.hasOwnProperty(i) || !
              checkObj.eq(a[i], b[i], priorA, priorB))) return false;
        }
        for (i in b) {
          // check if b has additional properties
          if (b.hasOwnProperty(i) && !a.hasOwnProperty(i)) return false;
        }
        return true;
      }
    };
  global["check"] = checkObj;
})(window);
