/**
 * JS MergeXML NodeJS usage sample
 * server-side component
 *
 * @package     MergeXML
 * @author      Vallo Reima
 * @copyright   (C)2019
 */

const http = require('http');
const fs = require('fs');
const formidable = require('formidable');
const MergeXML = require('./mergexml.js');

const hostname = '127.0.0.1';
const port = 3000;
const template = 'examplen.htm';

/**
 * send response
 * @param {object} res
 * @param {string} type plain|html
 * @param {string} data
 * @returns {undefined}
 */
const Respond = function (res, type, data) {
  res.writeHead(200, {'Content-Type': `text/${type}`, 'Content-Length': data.length});
  res.write(data);
  res.end();
};

/**
 * merge uploaded files and remove
 * @param {array} files
 * @returns {string}
 */
const Merge = function (files) {
  let oMX = new MergeXML();
  for (let i = 0; i < files.length; i++) {
    let dat = fs.readFileSync(files[i].path).toString(); 
    fs.unlinkSync(files[i].path);
    if (!oMX.AddSource(dat)) {
      break;
    }
  }
  var rlt;
  if (oMX.error.code !== '') {
    rlt = oMX.error.text; /* no DOM support */
  } else if (oMX.count < 2) {
    rlt = 'Minimum 2 files are required';
  } else {
    rlt = oMX.Get(2);
  }
  return rlt;
};

const server = http.createServer((req, res) => {
  if (req.method === 'POST') { //merge uploaded
    var form = new formidable.IncomingForm();
    form.multiples = true;
    form.parse(req, (err, fields, files) => {
      let f = Object.keys(files)[0]; //first property name
      let dat = Merge(files[f]);
      Respond(res, 'html', dat);
    });
  } else if (req.url === '/') { //get html
    fs.readFile(template, (err, data) => {
      if (!err && data) {
        let dat = data.toString().replace('%url%', `http://${hostname}:${port}`);
        Respond(res, 'html', dat);
      } else {
        Respond(res, 'plain', `Cannot load '${template}'`);
      }
    });
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
