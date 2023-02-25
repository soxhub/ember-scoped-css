const { createUnplugin } = require('unplugin');
const replaceGlimmerAst = require('./replaceGlimmerAst');
const path = require('path');
const getPostfix = require('./getPostfix');
const getClassesTagsFromCss = require('./getClassesTagsFromCss');
const { readFile } = require('fs').promises;
const fsExists = require('./fsExists');


module.exports = createUnplugin(() => {
  return {
    name: 'app-css-unplugin',

    // loadInclude(id){
    //   if(id.endsWith('.css')){
    //     return true;
    //   }
    // },

    // load(id){
    //   // this.addWatchFile(id);
    //   return 'console.log(' + JSON.stringify(id) + ');';
    // },

    // transformInclude(id) {
    //   if(id.endsWith('.css')){
    //     return true;
    //   }
    // },

    // async transform(code, id) {
    //   return code;
    // },
  };
});
