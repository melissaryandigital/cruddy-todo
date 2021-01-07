const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // create a file in the specified path and write a unique name 'id.txt'
  // path.join(__dirName + `${data}.txt`
  // write to this specific file
  // fs.writeFile(filename, text, callback)

  counter.getNextUniqueId((err, id) => {
    if (err) {
      console.log('getNextUniqueId error : ' + err);
    } else {

      var file = path.join(exports.dataDir, `${id}.txt`);

      fs.writeFile(file, text, (err) => {
        if (err) {
          throw ('error writing todo data');
        } else {
          callback(null, { id, text });
        }
      });
    }
  });


  // items[id] = text;
  // callback(null, { id, text });
};

exports.readAll = (callback) => {

  // return array of todos
  // serialization
  // [{"id": "00001", "text": "00001"}]

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error reading files in readAll');
    } else {
      // ["00001.txt" "00002.txt"]
      // get rid of the extension
      var filenames = _.map(files, (text) => {
        var filename = path.basename(text, '.txt');
        return { id: filename, text: filename };
      });
      callback(null, filenames);
    }
  });

  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
};

exports.readOne = (id, callback) => {

  // use readfile based on the message's id
  var file = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(file, 'utf8', (err, todo) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, {id, text: todo});
    }
  });

  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
