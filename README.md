MergeXML [![npm version](https://badge.fury.io/js/mergexml.svg)](https://badge.fury.io/js/mergexml)
==================

MergeXML merges the XML sources (files, strings, objects) into single DOM XML object.
The merging is performed recursively on the node level adding new elements and replacing existing ones.
The nodes with the same path/name are replaced/added sequentially and the modification can be controlled by the options.

MergeXML could be useful in cases where it is necessary to gather XML data from multiple sources.
For example, to join the configuration files of different subsystems depending on the system operation. 


The usage
-----

**var MergeXML = require('mergexml');**

MergeXML can included as a global script or with `npm install mergexml --save` and loaded as shown above.

**var oMX = new MergeXML([opts]);**

opts - the options object:

- join - common root name if any source has different root name (default is *root*, specifying *false* denies different names)
- updn - traverse the nodes by name sequence (*true*, default) or overall sequence (*false*)
- stay - the *stay* attribute value to deny overwriting of specific node (default is *all*, can be array of values or empty)

**oMX.AddFile(elem)**;

> elem - FileList element of the XML file

**oMX.AddSource(source)**;

> source - XML string or DOM object

The methods merge a sequent source and return the final object or *false* if failed (see *error* property below).

You can search in the result object:

**oMX.Query(expr)**;

> expr - XPath query expression

You can get the XML result tree:

**oMX.Get([0|1|2])**;

- 0 - object (default)
- 1 - text
- 2 - html

The result object can be accessed also via *oMX.dom* property. The properties available:

- **dom** - result XML DOM object - **Note that in older IE browsers this is an ActiveX Object and not a standard XML Document!**
- **nsp** - namespaces object (prefix:URI)
- **count** - number of sources merged
- **error** - error information
 - error.code ('' is ok)
 - error.text

The sources must have the same default namespace (if have at all).
Prefix '_' is reserved to handle default namespace.
IE doesn't allow replacement of the root node attributes.

The package
------

The following files are included:

1. *mergexml.js* - the MergeXML class; supports IE, Firefox, Safari, Chrome, Opera;
2. *example.html* - multi-selects the xml files and displays result;
3. *example.js* - passes the xml data and returns result; **requires HTML5**;
4. *test1.xml, test2.xml* - test data for the example;
5. *package.json, bower.json* - package details;
6. *test* - tests framework.

The MergeXML is realized also in PHP (see [github.com]).

The tests
--------

To run the tests:

1. install dependencies with `npm install`
2. run tests with `npm test`


ChangeLog
---------

June 2015

- *mergexml.js*
 - the wrapper is added for a compatibility with the AMD/CommonJS
 
October 2016 (Martijn van de Rijdt)

- *mergexml.js*
 - cloning the namespaced attributes correctly
 - mixing sources of undeclared encoding
 
  [github.com]: http://www.github.com/hareko/php-merge-xml
