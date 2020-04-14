const fs = require('fs');
const path = require('path');

const log = (action, data) => {
  const filePath = path.join(__dirname, 'logs.txt');
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err || content === undefined) {
      console.error(err);
    } else {
      const contentToAdd = `${action}\t\t${data.path}\t\t${data.status}\t\t${data.timetaken}ms\n`;
      const newContent = content + contentToAdd;
      fs.writeFile(filePath, newContent, (writeErr) => {
        if (writeErr) {
          console.log('Error while trying to save log:', writeErr);
        } else {
          console.log('log saved');
        }
      });
    }
  });
};

module.exports = log;
