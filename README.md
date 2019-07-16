JS MergeXML [![npm version](https://badge.fury.io/js/mergexml.svg)](https://badge.fury.io/js/mergexml)
==================

MergeXML merges the XML sources (files, strings, objects) into single DOM XML object.
The merging is performed recursively on the node level adding new elements and replacing existing ones.
The nodes with the same path/name are replaced/added sequentially and the modification can be controlled by the options.

MergeXML could be useful in cases where it is necessary to gather XML data from multiple sources.
For example, to join the configuration files of different subsystems depending on the system operation. 

Supports main browsers (IE, Edge, Chrome, Firefox, Safari, Opera) and NodeJS (see below).

The usage
-----

**`<script src="mergexml.js"></script>`**

**`const MergeXML = require('mergexml');`**

MergeXML can be included as a global script or with `npm install mergexml --save` and loaded as shown above.

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

NodeJS
------
The browser window objects' *DOMParser, XPathEvaluator, XMLSerializer* functionality is implemented by the *xpath, xmldom* modules. The sample requires also *formidable* module.

Install the modules by starting **NPM** from the directory where you have downloaded the package files.

>npm i -D xpath xmldom formidable

Start the NodeJS service with the sample:

>node examplen.js

Run the sample in your browser:

>http://localhost:3000

The package
------

The examples require **HTML5**. The following files are included:

1. *mergexml.js* - the MergeXML class supporting the browser and NodeJS environments;
2. *example.html* - multi-selects the xml files and displays result (browser);
3. *example.js* - passes the xml data and returns result (browser);
4. *examplen.htm* - client-side template to multi-select the xml files and display result (NodeJS);
5. *examplen.js* - server-side module to receive requests and response results (NodeJS);
6. *test1.xml, test2.xml* - test data for the examples;
7. *package.json, bower.json* - package details;

The MergeXML is realized also in PHP (see [github.com]).

ChangeLog
---------

June 2015

- *mergexml.js*
  - the wrapper is added for a compatibility with the AMD/CommonJS-like environments
 
October 2016 (Martijn van de Rijdt)

- *mergexml.js*
  - cloning the namespaced attributes correctly
  - mixing sources of undeclared encoding

July 2019

- *mergexml.js*
  - NodeJS environment support
- *examplen.js, examplen.htm*
  - NodeJS usage sample
 
  [github.com]: http://www.github.com/hareko/php-merge-xml
