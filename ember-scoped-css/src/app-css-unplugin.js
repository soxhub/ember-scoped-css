import { createUnplugin } from 'unplugin';
import replaceGlimmerAst from './replaceGlimmerAst.js';
import path from 'path';
import getPostfix from './getPostfix.js';
import getClassesTagsFromCss from './getClassesTagsFromCss.js';
import { readFile } from 'fs/promises';
import fsExists from './fsExists.js';

export default createUnplugin(() => {
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
