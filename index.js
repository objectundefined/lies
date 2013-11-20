var when = require('when') ;
var EventEmitter = require('events').EventEmitter ;

var Promise = exports.promise = function ( resolver ) {
	
	var prom = createPromise() ;
	var fakePromise = Object.create( {} , {
		then : {
			configurable: false,
			get : function () {
				return prom.then.bind(prom) ;
			}
		}
	});
	
	function  recant () {
		prom = createPromise() ;
	}
	
	function createPromise () {
		return when.promise(function( resolve , reject , notify ){
			resolver( resolve , reject , notify , _once(recant) );
		})
	}
	
	return fakePromise ;
}

var Deferred = exports.defer = function(){
	
	var emitter = new EventEmitter() ;
	var promise = Promise(function( resolve , reject , notify , recant ){
		emitter.removeAllListeners();
		emitter.once('resolve',resolve) ;
		emitter.once('reject',reject) ;
		emitter.once('recant',recant) ;
	});
	var proto = { 
		recant : emitter.emit.bind(emitter,'recant') , 
		resolve : emitter.emit.bind(emitter,'resolve') , 
		reject :  emitter.emit.bind(emitter,'reject')
	}
	var fakeDeferred = Object.create(proto,{
		promise : {
			configurable : false ,
			writable : false ,
			value : promise
		}
	})
	
	return fakeDeferred ;
}

function _once (func) {
  var ran = false, memo;
  return function() {
    if (ran) return memo;
    ran = true;
    memo = func.apply(this, arguments);
    func = null;
    return memo;
  };
};