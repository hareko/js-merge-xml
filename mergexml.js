/**
 * XML merging class
 * Merge multiple XML sources
 * 
 * @package     MergeXML
 * @author      Vallo Reima
 * @copyright   (C)2014
 */

/**
 * AMD/CommonJS wrapper
 * @param {object} root
 * @param {function} factory
 */
(function(root, factory) {
  "use strict";
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define([], factory);
  } else if (typeof exports === 'object') {
    // Does not work with strict CommonJS, 
    // but only CommonJS-like environments 
    // that support module.exports, like Node
    module.exports = factory();
  } else {
    // Direct call, root is the owner (window)
    root.MergeXML = factory();
  }
}(this, function() {
  /**
   * Return a function as the exported value
   * @param {object} opts -- stay, join, updn (see readme)
   */
  return function(opts) {

    var mde;        /* access mode 0,1,2 */
    var msv;        /* MS DOM version */
    var psr;        /* DOM parser object */
    var nse;        /* parsererror namespace */
    var xpe;        /* xPath evaluator */
    var nsr;        /* namespace resolver */
    var nsd = '_';  /* default namespace prefix */
    var stay;       /* overwrite protection */
    var join;       /* joining root name and status*/
    var updn;       /* update nodes sequentially by name */
    var XML_ELEMENT_NODE = 1;
    var XML_TEXT_NODE = 3;
    var XML_COMMENT_NODE = 8;
    var XML_PI_NODE = 7;
    var that = this;

    that.Init = function() {
      that.dom = null; /* result DOM object */
      that.nsp = {};   /* namespaces */
      that.count = 0; /* adding counter */
      join[1] = false;
      if (mde > 0) {
        that.error = {code: '', text: ''};
      }
      return (mde > 0);
    };

    /**
     * add XML file
     * @param {object} file -- FileList element
     * @return {object|false}
     */
    that.AddFile = function(file) {
      var rlt;
      if (!file || !file.target) {
        rlt = Error('nof');
      } else if (!file.target.result) {
        rlt = Error('emf');
      } else {
        rlt = that.AddSource(file.target.result);
      }
      return rlt;
    };

    /**
     * add XML string
     * @param {string|oobject} xml
     * @return mixed -- false - bad content
     *                  object - result
     */
    that.AddSource = function(xml) {
      var rlt, doc;
      if (typeof xml === 'object') {
        doc = that.Get(1, xml) ? xml : false;
        if (doc && ((mde === 1 && !window.DOMParser) || (mde === 2 && !doc.selectSingleNode('/')))) {
          doc = null; /* not compatible */
        }
      } else {
        try {
          doc = Load(xml);
        } catch (e) {
          doc = false;
        }
      }
      if (doc === null) {
        rlt = Error('nos');
      } else if (doc === false) {
        rlt = Error('inv');
      } else if (doc === true) {
        that.nsp = NameSpaces(that.dom.documentElement);
        that.count = 1;
        rlt = that.dom;
      } else if (CheckSource(doc)) {
        Merge(doc, '/');  /* add to existing */
        if (join[1] === true) {
          var tmp = that.dom.createTextNode("\r\n");
          that.dom.documentElement.appendChild(tmp);
        }
        that.count++;
        rlt = that.dom;
      } else {
        rlt = false;
      }
      return rlt;
    };

    /**
     * load the source into dom object
     * @param {object|string} src -- the source
     * @return {mixed} -- false - error
     *                    true - 1st load
     *                    object - loaded doc
     */
    var Load = function(src) {
      var rlt, doc;
      if (mde === 1) {
        if (that.dom) {
          doc = psr.parseFromString(src, 'text/xml');
          rlt = ParseError(doc) ? doc : false;
        } else {
          that.dom = psr.parseFromString(src, 'text/xml');
          rlt = ParseError(that.dom) ? true : false;
        }
      } else if (that.dom) {
        doc = new ActiveXObject(msv);
        doc.async = false;
        rlt = doc.loadXML(src) ? doc : false;
      } else {
        that.dom = new ActiveXObject(msv);
        that.dom.async = false;
        that.dom.setProperty('SelectionLanguage', 'XPath');
        rlt = that.dom.loadXML(src) ? true : false;
      }
      return rlt;
    };

    /**
     * check for xml syntax (mode 1)
     * @param {object} doc
     * @return {bool} -- true - ok
     */
    var ParseError = function(doc) {
      return doc.getElementsByTagNameNS(nse, 'parsererror').length === 0;
    };

    /**
     * 
     * @param {object} doc
     * @return {bool} -- true - ok
     */
    var CheckSource = function(doc) {
      var rlt = true;
      if (doc.inputEncoding !== that.dom.inputEncoding || doc.xmlEncoding !== that.dom.xmlEncoding) {
        rlt = Error('enc');
      } else if (doc.documentElement.namespaceURI !== that.dom.documentElement.namespaceURI) { /* $dom->documentElement->lookupnamespaceURI(NULL) */
        rlt = Error('nse');
      } else if (doc.documentElement.nodeName !== that.dom.documentElement.nodeName) {
        if (!join[0]) {
          rlt = Error('dif');
        } else if (!join[1]) {
          var enc = that.dom.inputEncoding ? that.dom.inputEncoding : (that.dom.xmlEncoding ? that.dom.xmlEncoding : 'utf-8'),
                  ver = that.dom.xmlVersion ? that.dom.xmlVersion : '1.0';
          var xml = '<?xml version="' + ver + '" encoding="' + enc + "\"?>\r\n<" + join[0] + ">\r\n</" + join[0] + '>';
          var d = Load(xml);
          if (d) {
            var tmp = that.dom.documentElement.cloneNode(true);
            d.documentElement.appendChild(tmp);
            tmp = d.createTextNode("\r\n");
            d.documentElement.appendChild(tmp);
            that.dom = d;
            join[1] = true;
          } else {
            rlt = Error('jne');
            join[1] = null;
          }
        }
      }
      if (rlt) {
        var a = NameSpaces(doc.documentElement);
        for (var c in a) {
          if (!that.nsp[c]) {
            that.dom.documentElement.setAttribute('xmlns:' + c, a[c]);
            that.nsp[c] = a[c];
          }
        }
        if (!updn) {
          nsr = null;
        } else if (mde === 1) {
          nsr = Resolver;
        } else {
          ResolverIE();
        }
      }
      return rlt;
    };
    /**
     * join 2 dom objects recursively
     * @param {object} src -- current source node
     * @param {string} pth -- current source path
     */
    var Merge = function(src, pth) {
      for (var i = 0; i < src.childNodes.length; i++) {
        var tmp;
        var node = src.childNodes[i]; //$node->getNodePath()
        var path = GetNodePath(src.childNodes, node, pth, i);
        var obj = that.Query(path);
        if (node.nodeType === XML_ELEMENT_NODE) {
          var flg = true;  /* replace existing node by default */
          if (obj === null || obj.namespaceURI !== node.namespaceURI) {
            tmp = node.cloneNode(true); /* take existing node */
            obj = that.Query(pth); /* destination parent */
            obj.appendChild(tmp); /* add a node */
          } else {
            if (ArraySearch(obj.getAttribute('stay'), stay) !== false) {
              flg = false; /* don't replace */
            }
            if (flg) {
              try {
                for (var j = 0; j < node.attributes.length; j++) { /* add/replace attributes */
                  obj.setAttribute(node.attributes[j].nodeName, node.attributes[j].nodeValue);
                }
              } catch (e) {
                /* read-only node */
              }
            }
          }
          if (node.hasChildNodes() && flg) {
            Merge(node, path); /* go to subnodes */
          }
        } else if (node.nodeType === XML_TEXT_NODE || node.nodeType === XML_COMMENT_NODE) { /* leaf node */
          if (obj === null || obj.nodeType !== node.nodeType) {
            obj = that.Query(pth);    /* destination parent node */
            if (node.nodeType === XML_TEXT_NODE) {
              tmp = that.dom.createTextNode(node.nodeValue); /* add text */
            } else {
              tmp = that.dom.createComment(node.nodeValue);  /* add comment */
            }
            obj.appendChild(tmp); /* add leaf */
          } else {
            obj.nodeValue = node.nodeValue; /* replace leaf */
          }
        }
      }
    };

    /**
     * form the node xPath
     * @param {object} nodes -- child nodes
     * @param {object} node -- current child
     * @param {string} pth -- parent path
     * @param {int} eln -- element sequence number
     * @return {string} query path
     */
    var GetNodePath = function(nodes, node, pth, eln) {
      var p, i;
      var j = 0;
      if (node.nodeType === XML_ELEMENT_NODE) {
        for (i = 0; i <= eln; i++) {
          if ((updn && nodes[i].nodeType === node.nodeType && nodes[i].nodeName === node.nodeName) ||
                  (!updn && nodes[i].nodeType !== XML_PI_NODE)) {
            j++;
          }
        }
        if (updn) {
          var f = false;
          var a = NameSpaces(node);
          for (var c in a) {
            if (c !== nsd) {
              that.nsp[c] = a[c];
              f = (mde === 2);
            }
          }
          if (f) {
            ResolverIE();
          }
          if (node.prefix) {
            p = node.prefix + ':';
          } else if (that.nsp[nsd]) {
            p = nsd + ':';
          } else {
            p = '';
          }
          p += (node.localName ? node.localName : node.baseName);
        } else {
          p = 'node()';
        }
      } else if (node.nodeType === XML_TEXT_NODE || node.nodeType === XML_COMMENT_NODE) {
        for (i = 0; i <= eln; i++) {
          if (nodes[i].nodeType === node.nodeType) {
            j++;
          }
        }
        p = node.nodeType === XML_TEXT_NODE ? 'text()' : 'comment()';
      } else {
        p = pth;
      }
      if (j) {
        p = pth + (pth.slice(-1) === '/' ? '' : '/') + p + '[' + j + ']';
      }
      return p;
    };

    /**
     * get node's namespaces
     * @param {object} node
     * @return {array} 
     */
    var NameSpaces = function(node) {
      var rlt = {};
      var attrs = node.attributes;
      for (var i = 0; i < attrs.length; ++i) {
        var a = attrs[i].name.split(':');
        if (a[0] === 'xmlns') {
          var c = a[1] ? a[1] : nsd;
          rlt[c] = attrs[i].value;
        }
      }
      return rlt;
    };

    /**
     * xPath query
     * @param {string} qry -- query statement
     * @return {object}
     */
    that.Query = function(qry) {
      var rlt;
      if (join[1]) {
        qry = '/' + that.dom.documentElement.nodeName + (qry === '/' ? '' : qry);
      }
      try {
        if (mde === 1) {
          rlt = xpe.evaluate(qry, that.dom, nsr, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          rlt = rlt.singleNodeValue;
        } else {
          rlt = that.dom.selectSingleNode(qry);
        }
      }
      catch (e) {
        rlt = null; /* no such path */
      }
      return rlt;
    };

    /**
     * XPathNSResolver 
     * @param {string} pfx node prefix
     * @return {string} namespace URI
     */
    var Resolver = function(pfx) {
      return that.nsp[pfx] || null;
    };

    /**
     * XPath IE Resolver 
     */
    var ResolverIE = function() {
      var p = '';
      for (var c in that.nsp) {
        p += ' xmlns:' + c + '=' + "'" + that.nsp[c] + "'";
      }
      if (p) {
        that.dom.setProperty('SelectionNamespaces', p.substr(1));
      }
    };

    /**
     * find array memeber by value
     * @param {array} arr
     * @param {mixed} val
     * @returns {mixed}
     */
    var ArraySearch = function(arr, val) {
      var rlt = false;
      for (var key in arr) {
        if (arr[key] === val) {
          rlt = key;
          break;
        }
      }
      return rlt;
    };

    /**
     * get result
     * @param {int} flg -- 0 - object
     *                     1 - xml
     *                     2 - html
     * @param {object} doc
     * @return {mixed}
     */
    that.Get = function(flg, doc) {
      var rlt;
      if (flg && !doc) {
        doc = that.dom;
      }
      if (!flg) {
        rlt = that.dom;
      } else if (!doc) {
        rlt = '';
      } else if (doc.xml) {
        rlt = doc.xml;
      } else {
        try {
          rlt = (new XMLSerializer()).serializeToString(doc);
        } catch (e) {
          rlt = null;
        }
      }
      if (rlt && flg === 2) { /* make html view */
        if (join[1]) {
          var k = rlt.indexOf('<' + join[0]);
          rlt = rlt.substr(0, k) + "\r\n" + rlt.substr(k);
        }
        rlt = rlt.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ |\t/g, '&nbsp;'); /* tags and spaces */
        rlt = rlt.replace(/(\r\n|\n|\r)/g, '<br>');  /* line breaks */
      }
      return rlt;
    };

    /**
     * set error message
     * @param {string} err -- token
     * @return {false}
     */
    var Error = function(err) {
      var errs = {
        nod: 'XML DOM is not supported in this browser',
        nox: 'xPath is not supported in this browser',
        nos: 'Incompatible source object',
        nof: 'File not found',
        emf: 'File is empty', /* possible delivery fault */
        inv: 'Invalid XML source',
        enc: 'Different encoding',
        dif: 'Different root nodes',
        jne: 'Invalid join parameter',
        nse: 'Namespace incompatibility',
        und: 'Undefined error'
      };
      that.error.code = errs[err] ? err : 'und';
      that.error.text = errs[that.error.code];
      return false;
    };

    /**
     * identify browser functionality
     * @return {int|string} mode number or error code
     */
    var GetMode = function() {
      var m;
      var f = false;
      var vers = [
        'MSXML2.DOMDocument.6.0',
        'MSXML2.DOMDocument.3.0',
        'MSXML2.DOMDocument',
        'Microsoft.XmlDom'
      ];
      var n = vers.length;
      for (var i = 0; i < n; i++) {
        try {
          var d = new ActiveXObject(vers[i]);
          d.async = false;
          f = true;   /* DOM supported */
          if (d.loadXML('<x></x>') && d.selectSingleNode('/')) {
            break;    /* xPath supported */
          }
        } catch (e) {
          /* skip */
        }
      }
      if (f) {
        if (i < n) {
          msv = vers[i];
          m = 2;  /* IE mode */
        } else {
          m = 'nox';  /* no xPath */
        }
      } else if (!window.DOMParser) {
        m = 'nod';  /* no DOM */
      } else if (!window.XPathEvaluator) {
        m = 'nox';  /* no xPath */
      } else {
        psr = new DOMParser();
        var e = psr.parseFromString('Invalid', 'text/xml'); /* to detect source error */
        nse = e.getElementsByTagName('parsererror')[0].namespaceURI;
        xpe = new XPathEvaluator();
        m = 1;  /*  Firefox, Safari, Chrome, Opera */
      }
      return m;
    };

    if (typeof opts !== 'object') {
      opts = {};
    }
    /* set stay attribute value to check */
    if (typeof opts.stay === 'undefined') {
      stay = ['all'];
    } else if (!opts.stay) {
      stay = [];
    } else if (typeof opts.stay === 'object' && opts.stay instanceof Array) {
      stay = opts.stay;
    } else {
      stay = [opts.stay];
    }
    /* set join condtion for different roots */
    if (typeof opts.join === 'undefined') {
      join = ['root'];
    } else {
      join = [opts.join ? String(opts.join) : false];
    }
    /* set update sequence manner */
    if (typeof opts.updn === 'undefined') {
      updn = true;
    } else {
      updn = opts.updn;
    }
    /* detect browser features: 2 - IE, 1 - rest, 0 - N/A */
    mde = GetMode();
    if (typeof mde === 'string') {
      that.error = {};
      Error(mde);
      mde = 0;
    }
    that.Init();
  };
}));
