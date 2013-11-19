var lies = require('../index') ;

describe('deferred', function(){
  describe('#initialResolve', function(){
    it('should resolve when calling deferred.promise.then', function(done){
      var deferred = lies.defer() ;
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
    it('should reject when calling deferred.promise.then after being reset', function(done){
      var deferred = lies.defer() ;
			var promise = deferred.promise ;
			deferred.resolve('foo') ;
			deferred.reset() ;
			promise.then(function(){
				done(new Error('promise was resolved after being reset'));
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
			var promise = lies.promise(function(resolve,reject,notify,reset){
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
    it('should reject when calling promise.then after being reset', function(done){
			var ct = 0 ;
			var promise = lies.promise(function(resolve,reject,notify,reset){
				if (++ct==1) resolve(true);
				else reject('RejectionError');
				setTimeout(reset,10) ;
			});
			setTimeout(function(){
				promise.then(function(){
					done(new Error('promise was resolved after being reset'));
				}).then(null,function(err){
					done();
				})				
			},20);
    })
  })
})