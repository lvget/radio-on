// version file
//
// {"ver":"0.1.86","time":"2020-3-26 13:32:35"}
//

/* use:

const version_increment = require('./version-increment.js');
version_increment('src/version.ts');

*/

const fs = require('fs');
const path = require('path');

module.exports = function (out /* = 'public/version.json'*/) {
  const file = path.resolve(__dirname, 'version.json');
  
  console.log('');
  console.log('version increment', file);


  var version;

  if (fs.existsSync(file)){
    version = JSON.parse(fs.readFileSync(file, 'utf8'));
  } 
  else
    version = {
      ver: '0.0.1',
      time: '',
    };

  console.log(version);

  var d = new Date();
  version.time = d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  var v = version.ver.split('.');
  v[2] = parseInt(v[2]) + 1;
  version.ver = v.join('.');
  let ver = JSON.stringify(version);
  fs.writeFileSync(file, ver, 'utf8');

  if (out) {
    let ext = out.split('.')[1];
    if (ext == 'ts') {
      ver = 'export default ' + ver;
    }

    fs.writeFileSync(out, ver, 'utf8');
  }

  console.log(version);
  console.log(out);
};
