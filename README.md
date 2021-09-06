JS MergeXML [![npm version](https://badge.fury.io/js/mergexml.svg)](https://badge.fury.io/js/mergexml)
==================

MergeXML merges the XML sources (files, strings, objects) into single DOM XML object.
The merging is performed recursively on the node level adding new elements and replacing existing ones.
The nodes with the same path/name are replaced/added sequentially and the modification can be controlled by the options.

MergeXML could be useful in cases where it is necessary to gather XML data from multiple sources.
For example, to combine configuration files of different subsystems depending on the application logic. 

Main browsers (Chrome, Edge, IE, Firefox, Safari, Opera) and NodeJS (see below) are supported. The MergeXML is realized also in PHP (see [php-merge-xml]).

The usage
-----
MergeXML class can be included:

1. loading as a CommonJS module:

**`const MergeXML = require('./mergexml');`**

2. as a global script:

**`<script src="mergexml.js"></script>`**

The class instantiation:

>var oMX = new MergeXML([opts]);

or loading and instantiating at once:

>const oMX = new (require('./mergexml.js'))([opts]);

**opts** - the options object:

- join - common root name if any source has different root name (default is *root*, specifying *false* denies different names)
- updn - traverse the nodes by name sequence (*true*, default) or overall sequence (*false*)
- stay - the *stay* attribute value to deny overwriting of specific node (default is *all*, can be array of values or empty)
- path - require path to NodeJS modules (default is looking from *node_modules*, N/A for browsers)

**oMX.AddSource(source)**;

> source - XML string or DOM object

**oMX.AddFile(elem)**;

> elem - FileList element of the XML file (browsers only)

The methods merge a sequent source and return the final object or *false* if failed (see *error* property below).

**oMX.Init([opts])**;

Clear existing result to restart.
> opts - the options object as above (except *path*)

You can search in the result object:

**oMX.Query(expr)**;

> expr - XPath query expression

You can get the XML result tree:

**oMX.Get([0|1|2])**;

- 0 - object (default)
- 1 - text
- 2 - html


The result object can be accessed also via *oMX.dom* property. The properties available:

- **dom** - result XML DOM object (in older IE browsers this is an ActiveX Object, not a standard XML Document)
- **nsp** - namespaces list object (prefix:URI)
- **count** - number of sources merged
- **error** - error information
  - error.code ('' is ok)
  - error.text

The sources must have the same default namespace (if have at all).
Prefix '_' is reserved to handle the default namespace.
IE doesn't allow replacement of the root node attributes.

Installation
------------

Run from the appropriate directory:
>npm install mergexml

Or manually download the [js-merge-xml] package from Github and unzip the files into installation directory. 

Run the sample in your browser (**HTML5** compatible):

1. open *example.html*
2. choose the *xml* files to be merged (*test* folder)
3. click *Merge* button
4. the merged *xml* is displayed...

The tests
--------
To run the browsers' tests from the CLI:

1. go to installation directory 
2. install framework: `npm install --dev`
3. run the tests: `npm test`
4. the results are displayed...
5. to remove the test modules: `npm prune --prod`

NodeJS
------
The browser window objects' (*DOMParser, XPathEvaluator, XMLSerializer*) functionality is implemented by the *xpath, xmldom* modules as node global objects. The sample requires also the *formidable* module. 

Install the dependent modules:

>npm install --prod

Start NodeJS with the sample script:

>node examplen.js

Run the sample in your browser:

>http://localhost:3000

The package
------

The following files are included:

1. *mergexml.js* - MergeXML class supporting the browser and NodeJS environments;
2. *example.html* - multi-selects the xml files and displays result (browser);
3. *example.js* - passes the xml data and returns result (browser);
4. *examplen.htm* - client-side template to multi-select the xml files and display result (NodeJS);
5. *examplen.js* - server-side module to receive requests and response results (NodeJS);
6. *package.json, bower.json* - package details;
7. *test* - a folder with the (browser) testing files.

ChangeLog
---------

June/July 2015 (Martijn van de Rijdt)

- *mergexml.js*
  - the wrapper is added for a compatibility with the AMD/CommonJS-like environments
- *test*
  - automated browser tests
 
October 2016 (Martijn van de Rijdt)

- *mergexml.js*
  - cloning the namespaced attributes correctly
  - mixing sources of undeclared encoding

August 2019 (Vallo Reima)

- *mergexml.js*
  - NodeJS environment support
- *examplen.js, examplen.htm*
  - NodeJS usage sample

September 2021 (eyelidlessness)

- *mergexml.js*
  - Upgrade xmldom to @xmldom/xmldom
 
[php-merge-xml]: http://www.github.com/hareko/php-merge-xml
[js-merge-xml]: http://www.github.com/hareko/js-merge-xml
