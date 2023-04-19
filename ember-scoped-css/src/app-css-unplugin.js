import { createUnplugin } from 'unplugin';

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
