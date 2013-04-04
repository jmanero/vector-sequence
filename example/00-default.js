var Sequencer = require('../');
var Util = require('util');

var sequence1 = require('./sequence-01');
var sequence2 = require('./sequence-02');

var s1 = new Sequencer(sequence1);
s1.handler = function(task, callback) {
	Util.log("Starting task " + task.id);

	setTimeout(function() {
		Util.log("Completed task " + task.id);
		callback(null, {});
	}, 1000);
};

var s2 = new Sequencer(sequence2);
s2.handler = function(task, callback) {
	Util.log("Starting task " + task.id);

	setTimeout(function() {
		Util.log("Completed task " + task.id);
		callback(null, {});
	}, 1000);
};

s1.run(function() {
	Util.log("sequence-01 ended");
	s2.run(function() {
		Util.log("sequence-02 ended");
	});
});