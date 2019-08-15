/**
 * JS MergeXML NodeJS usage sample
 * server-side component
 *
 * @package     MergeXML
 * @author      Vallo Reima
 * @copyright   (C)2019
 */

const http = require('http');
const fs = require('fs'); //read/remove uploaded files
const formidable = require('formidable'); //to process the uploads

const MergeXML = require('./mergexml.js'); //loading the class
/* const oMX = new (require('./mergexml.js'))(); //load and instantiate */

const hostname = '127.0.0.1';
const port = 3000;
const template = 'examplen.htm';

const server = http.createServer((req, res) => {
  if (req.method === 'POST') { //merge uploaded
    let form = new formidable.IncomingForm();
    form.multiples = true; //multi-selected files
    form.parse(req, (err, fields, files) => { //process form data
      let f = Object.keys(files)[0]; //1st property is files[]
      let dat = Merge(files[f]);
      Respond(res, dat); //display result
    });
  } else if (req.url === '/') {
    fs.readFile(template, (err, data) => {  //get template html
      if (!err && data) { //obtained
        let dat = data.toString().replace('%url%', `http://${hostname}:${port}`); //set action url
        Respond(res, dat, 'html'); //launch the page
      } else {
        Respond(res, `Cannot read '${template}'`);
      }
    });
  }
}).listen(port, hostname, () => {
  console.log(`NodeJS is running at http://${hostname}:${port}`);
});

/**
 * send response
 * @param {object} res
 * @param {string} type plain|html
 * @param {string} data
 */
const Respond = function (res, data, type = 'plain') {
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
  /*  oMX.Init(); //using global instance */
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
    rlt = oMX.Get(1);
  }
  return rlt;
};
