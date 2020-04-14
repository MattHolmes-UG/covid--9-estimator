const fs = require('fs');
const path = require('path');

const log = (req, res) => {
  const filePath = path.join(__dirname, 'logs.txt');
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err || content === undefined) {
      console.error(err);
    } else {
      const contentToAdd = `${req.method}\t\t${req.url}\t\t${res.statusCode}\t\t${new Date().getTime() - req.session.startTime}ms\n`;
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
