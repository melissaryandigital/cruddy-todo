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

  // [{ id: '00001', text: todo1text }, { id: '00002', text: todo2text }]

  return new Promise((resolve, reject) => {
    fs.readdir(exports.dataDir, (err, files) => {
      if (err) {
        reject('error reading files in readAll', err);
      } else {
        resolve(files);
      }
    });
  })
    .then((filesArray) => {
      var todos = _.map(filesArray, (file) => {
        return new Promise((resolve, reject) => {
          fs.readFile(path.join(exports.dataDir, file), 'utf8', (err, data) => {
            if (err) {
              reject(err);
            } else {
              var id = path.basename(file, '.txt');
              var thing = { id: id, text: data };
              resolve(thing);
            }
          });
        });
      });

      Promise.all(todos)
        .then((values) => {
          callback(null, values);
        })
        .catch((err) => {
          console.log('Promise all error: ' + err);
        });
    });

  //   var filenames = _.map(files, (text) => {
  //     var filename = path.basename(text, '.txt');
  //     return { id: filename, text: filename };
  //   });
  //   callback(null, filenames);
  // }

  // Promise.all(promises)
};

exports.readOne = (id, callback) => {

  // use readfile based on the message's id
  var file = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(file, 'utf8', (err, todo) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, { id, text: todo });
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

  var file = path.join(exports.dataDir, `${id}.txt`);

  fs.readFile(file, 'utf8', (err, todo) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(file, text, (err) => {
        if (err) {
          callback(new Error(`Error writing to file: ${id}`));
        } else {
          callback(null, { id, text });
        }
      });
    }
  });

  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {


  var file = path.join(exports.dataDir, `${id}.txt`);

  fs.unlink(file, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });


  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
