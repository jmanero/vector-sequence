module.exports = [ {
	node : "test-01.foo.com",
	recipe : "test::pre",
	id : 1
}, [ {
	node : "test-02.foo.com",
	recipe : "test",
	id : "2.1"
}, {
	node : "test-03.foo.com",
	recipe : "test",
	id : "2.2"
}, {
	node : "test-04.foo.com",
	recipe : "test",
	id : "2.3"
},

[ {
	node : "test-04.foo.com",
	recipe : "test",
	id : "2.4.1"
}, {
	node : "test-04.foo.com",
	recipe : "test",
	id : "2.4.2"
}, {
	node : "test-04.foo.com",
	recipe : "test",
	id : "2.4.3"
} ],

{
	node : "test-05.foo.com",
	recipe : "test",
	id : "2.5"
} ], {
	node : "test-01.foo.com",
	recipe : "test::post",
	id : 3
} ];
