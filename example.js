/**
 * JS MergeXML usage sample
 * merge multi-selected local xml files
 *
 * @package     MergeXML
 * @author      Vallo Reima
 * @copyright   (C)2014
 */
function Example() {

  var oMX = new MergeXML(); /* instantiate the class */
  var fls = [];             /* output files info */

  /**
   * get element object
   * @param {string} id
   */
  var $ = function(id) {
    return document.getElementById(id);
  };

  /**
   * add event handler
   * @param {string} evt
   * @param {string} id
   * @param {function} fnc
   */
  var AddEvent = function(evt, id, fnc) {
    var elem = $(id);
    if (elem.addEventListener)  // W3C DOM
      elem.addEventListener(evt, fnc, false);
    else if (elem.attachEvent) { // IE DOM
      elem.attachEvent('on' + evt, fnc);
    }
    else { // No much to do
      elem[evt] = fnc;
    }
  };

  /**
   * FileList objects handler
   * @param {object} evt
   */
  var FileSelect = function(evt) {
    $('output').innerHTML = '';
    $('result').innerHTML = '';
    oMX.Init(); /* begin with new objects */
    fls = [];
    var cnt = 0;
    var files = evt.target.files; /* FileList object */
    for (var i = 0; i < files.length; i++) { /* loop the selected files */
      var reader = new FileReader();
      reader.onload = function(file) {
        fls[cnt + 1] = oMX.AddFile(file) ? true : false;  /* get a file */
        var c = $('result').innerHTML;
        if (c !== '') {
          c += ', ';
        }
        $('result').innerHTML = c + fls[cnt];
        cnt += 2;
      };
      fls.push(files[i].name, null);
      reader.readAsText(files[i]);
    }
  };

  /**
   * Check results
   * @return {mixed} array -- files list
   *                 string -- error
   *                 null -- loading yet
   */
  var FileCheck = function() {
    var r = [];
    for (var i = 0; i < fls.length; i += 2) {
      if (fls[i + 1]) {
        r.push(fls[i]);
      } else {
        r = fls[i + 1] === false ? fls[i] : null;
        break;
      }
    }
    return r;
  };

  /**
   * Show results
   */
  var FileMerge = function() {
    var err = '';
    var r = FileCheck();
    if (typeof r === 'string') {
      err = oMX.error.text + ': ' + r;
    } else if (r === null) {
      err = 'Files are not loaded yet';
    } else if (oMX.count < 2) {
      err = 'Minimum 2 files are required';
    }
    $('output').innerHTML = err ? err : oMX.Get(2);
  };

  if (oMX.error.code !== '') {
    $('output').innerHTML = oMX.error.text; /* no DOM support */
  } else if (!window.File || !window.FileList || !window.FileReader) {
    $('output').innerHTML = 'Sorry, the demo needs a browser supporting FileReader API';
  } else {
    AddEvent('change', 'files', FileSelect);
    AddEvent('click', 'merge', FileMerge);
  }

}
