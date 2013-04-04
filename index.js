var EventEmitter = require('events').EventEmitter;
var Queue = require('qrly');
var UID = require('simple-uid');
var Util = require('util');

var Sequencer = module.exports = function(sequence) {
	this.sequence = sequence;
	this.handler = function(task, complete) {
		complete();
	};

	this.results = {};
};

Sequencer.prototype.run = function(callback) {
	var reaction = reactor.call(this, this.sequence);
	reaction.on('end', function() {
		callback();
	});
};

var Reaction = Sequencer.Reaction = function() {
	EventEmitter.call(this);

	this.id = UID.generate(true);
};
Util.inherits(Reaction, EventEmitter);

Reaction.prototype.pipe = function(parent, end) {
	this.on('error', function(err, f) {
		parent.emit('error', err, f);
	});

	this.on('notify', function(resource) {
		parent.emit('notify', resource);
	});

	if (end) {
		this.on('end', function() {
			parent.emit('end');
		});
	}

	return this;
};

Reaction.prototype.error = function(error, fatal) {
	if (typeof fatal === 'undefined')
		fatal = true;

	this.emit('error', error, fatal);
};

Reaction.prototype.notify = function(resource) {
	this.emit('notify', resource);
};

Reaction.prototype.end = function() {
	this.emit('end');
};

Reaction.prototype.next = function() {
	this.emit('next');
};

function reactor(sequence) {
	var me = new Reaction();

	// End of serial sequence
	if (!sequence.length) {
		process.nextTick(function() {
			me.end();
		});
		return me;
	}

	var task = sequence.shift();

	process.nextTick((function() {
		if (task instanceof Array) {
			
			var self = this;
			var sideways = new Queue({
				concurrency : this.limit || 32,
				flushable : true,
				collect : false
			});
			
			sideways.on('flushed', function() {
				me.next();
			});
			
			sideways.worker = function(t, complete) {
				if(t instanceof Array) {
					reactor.call(self, t).pipe(me, false).on('end', function() {
						complete();
					});
					
				} else {
					self.results[t.id] = {
						id : t.id,
						task : t
					};
					
					self.handler(t, function(err, res) {
						if (err) {
							self.results[t.id].error = err;
							me.error(err);
							return;
						}

						self.results[t.id].result = res;
						
						complete();
					});
				}
			};
			
			sideways.push(task);

		} else { // Run in parallel or serial
			if (!task.id)
				task.id = UID.generate(true);

			this.results[task.id] = {
				id : task.id,
				task : task
			};

			this.handler(task, (function(err, res) {
				if (err) {
					this.results[task.id].error = err;
					me.error(err);
					return;
				}

				this.results[task.id].result = res;

				
				me.next();
			}).bind(this));
		}

	}).bind(this));

	me.on('next', (function() {
		reactor.call(this, sequence).pipe(me, true);
	}).bind(this));

	return me;
}
