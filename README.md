Vector Sequence
==========
Execute a complex structure of tasks in the correct sequence.

VS consumes an array of tasks to be executed in serial. Tasks in second-order
arrays (nested in the base array) are executed in parallel, as if they were a single
task in the sequence. Tasks in third-order arrays (nested in second order arrays)
are execute in serial, and the pattern continues indefinitely (until your process
runs out of memory...)

For example, this sequence

    [
        { id : "1" },
        [ { id : "2.1" }, { id : "2.2" } ],
        { id : "3" },
        [ { id : "4.1" }, [
              { id : "4.2.1" },
              { id : "4.2.2" },
              [ { id : "4.2.3.1" }, { id : "4.2.3.2" } ]
            ], { id : "4.3" } ],
        { id : "5" }
    ]

would yield the following execution graph

    1
    |------+
     |     |
     2.1   2.2
     |_____|
        |
        3
        |--------------------------+
         |     |                   |
         4.1   4.2.1               4.3
         |     |                   |
         |     4.2.2               |
         |     |----------+        |
         |      |         |        |
         |      4.2.3.1   4.2.3.2  |
         |      |_________|        |
         |           |             |
         |___________|_____________|
                      |
                      5

This interleaving allows any non-circular directed dependency graph to be traversed
and minimized into a compatible sequence. 

### Tests
`TODO`

### License
Copyright (c) 2013 John Manero, Dynamic Network Services Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
