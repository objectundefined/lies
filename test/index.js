var recant = require('../index') ;
var assert = require('assert') ;

describe('deferred', function(){
  describe('#initialResolve', function(){
    it('should resolve when calling deferred.promise.then', function(done){
      var deferred = recant.defer() ;
			var promise = deferred.promise ;
			promise.then(function(){
				done();
			}).then(null,function(err){
				done(err);
			});
			deferred.resolve('foo') ;
    })
  })
  describe('#subsequentReject', function(){
    it('should reject when calling deferred.promise.then after being recanted', function(done){
      var deferred = recant.defer() ;
			var promise = deferred.promise ;
			deferred.resolve('foo') ;
			deferred.recant() ;
			promise.then(function(){
				done(new Error('promise was resolved after being recant'));
			}).then(null,function(err){
				done();
			})
			deferred.reject('RejectionError')
    })
  })
})

describe('promise', function(){
  describe('#initialResolve', function(){
    it('should resolve when calling promise.then', function(done){
			var promise = recant.promise(function(resolve,reject,notify,recant){
				resolve(true);
			});
			promise.then(function(){
				done();
			}).then(null,function(err){
				done(err);
			});
    })
  })
  describe('#subsequentReject', function(){
    it('should reject when calling promise.then after being recanted', function(done){
			var ct = 0 ;
			var promise = recant.promise(function(resolve,reject,notify,recant){
				if (++ct==1) resolve(true);
				else reject('RejectionError');
				setTimeout(recant,10) ;
			});
			setTimeout(function(){
				promise.then(function(){
					done(new Error('promise was resolved after being recant'));
				}).then(null,function(err){
					done();
				})				
			},20);
    })
  })
	
	describe('integration', function(){
	  describe('#when.js', function(){
			var when = require('when');
	    it('should resolve promises when returned from a when.js promise resolver', function(done){
				var realPromise = when.promise(function(resolve,reject,notify){
					resolve(1);
				})
				var fakePromise = recant.promise(function(resolve,reject,notify,recant){
					resolve(2);
				});
				realPromise.then(function(){
					return fakePromise ;
				}).then(function(val){
					assert.equal(2,val);
					done();
				}).then(null,function(err){
					done(err);
				})
	    })
						
	    it('should chain a recanted promise when returned from a when.js promise resolver', function(done){
				var ct = 0;
				var realPromise = when.promise(function(resolve,reject,notify){
					resolve(1);
				})
				var fakePromise = recant.promise(function(resolve,reject,notify,recant){
					if (++ct==1) resolve(true);
					else reject('RejectionError');
					setTimeout(recant,10) ;
				});
				realPromise.then(function(){
					return fakePromise ;
				}).then(function(val){
					setTimeout(function(){
						realPromise.then(function(){
							return fakePromise ;
						}).then(null,function(){
							done();
						})
					},20);
					
				}).then(null,function(err){
					done(err);
				})
	    })
	  })
	})	
})