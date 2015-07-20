
# dmas-parallel
Executes JS function in parallel on another process (returns promise)
```
var parallel = require('dimas-parallel');
var parallel_promise = parallel.execute(functionToEvaluate, [arguments]);
parallel_promise.then(function([returnValue]) { ... });
```

You can set the maximum number of concurrent processes by (The default is number of CPUs minus one):
```
parallel.setMaxNumberOfProcesses([Some_Value]);
```

#### Example 1 - Execute function on another process

```
var parallel = require('parallel-parallel');

parallel.execute(function() {
  // do some stuff on another process
});
```

#### Example 2 - Execute function with arguments and get result

```
function Sum (value1, value2) {
  return value1 + value2;
}

var parallel = require('parallel-parallel');

parallel.execute(Sum, [1, 2]).then(function (result) {
    console.log(result);
});
```




