# dimas-parallel
Executes JS function in parallel on another process (returns promise)
```
var dimas = require('dimas-parallel);
var dimas_promise = dimas.execute(functionToEvaluate, [arguments)
dimas_promise.then(function([returnValue] { ... });
```


#### Example 1 - Execute function on another process

```
var dimas = require('dimas-parallel);

dimas.execute(function() {
  // do some stuff on another process
});
```

#### Example 2 - Execute function with arguments and get result

```
function Sum (value1, value2) {
  return value1 + value2;
}

var dimas = require('dimas-parallel');

dimas.execute(Sum, [1, 2]).then(function (result) {
    console.log(result);
});
```




