# Lies

A promise library that violates everything you know about promises.

## Things You Can Do

 *Create promises where the resolver can reset the promise to resolve/reject again.
 *Create deferreds that can be reset to resolve/reject again. Again


## Why on earth would you do this?

  *Create a promise that always resolves with an open connection (reset the promise on conn.close or conn.err)
  *Pipeline dynamic dependencies through normal promise symantics

## Usage

Install via NPM

    $ npm install lies

## Example- Promise

```javascript
var lies = require('lies') ;
var promise = lies.promise(function(resolve,reject,notify,reset){
	
	var connPromise = connection.open() ;
	connPromise.then(function(conn){	
		resolve(conn) ;
		conn.on('close',reset) ;
	}).then(null,function(err){
		reject(err) ;
	})
	
})
```
## Example- Deferred

```javascript
var lies = require('lies') ;
var deferred = lies.defer() ;
var promise = deferred.promise ;

deferred.resolve(val); // as of now, all promise.then calls will resolve with a value
deferred.reset() ; // now, all promise.then calls ( against the same promise ) will be pending until resolved or rejected again
deferred.reject(err) ; // now, all promise.then calls will be rejected as the state has changed
```
