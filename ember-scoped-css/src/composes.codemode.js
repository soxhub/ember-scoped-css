const fs = require('fs').promises;
const path = require('path');

const files = process.argv.slice(2);
let processedFilesCount = 0;

function logProgress(file) {
  console.log(`${processedFilesCount}/${files.length} -> ${file}`);
}

// function will load css file and return content of specific class
function getClassContent(css, className) {
  const reg = new RegExp(`\\.${className} *{([^}]+)}`, 'g');
  const match = reg.exec(css);
  if (match) {
    return match[1];
  }
  return '';
}

async function transformCssFile(filePath) {
  try {
    let css = await fs.readFile(filePath, 'utf-8');
    if (css.includes('composes')) {
      // get all matches of composes regex
      const reg = /composes: *([^ ]+) +from +"([^"]+)" *;/g;
      // match css with exec and get groups
      while ((match = reg.exec(css)) !== null) {
        const [m, composesClass, composesFilePath] = match;

        let pathToComposesFile;
        if (composesFilePath.match(/^[a-zA-Z]/)) {
          // path to node modules
          pathToComposesFile = path.resolve(
            path.join(
              'node_modules',
              composesFilePath.replace('luna/', 'luna/addon/')
            )
          );
        } else {
          // relative path
          pathToComposesFile = path.resolve(
            path.dirname(filePath),
            composesFilePath
          );
        }

        let composesCss;
        try {
          composesCss = await fs.readFile(pathToComposesFile, 'utf-8');
        } catch (e) {
          console.error(e);
          continue;
        }
        const composesClassContent = getClassContent(
          composesCss,
          composesClass
        );

        // replace css with new css
        css = css.replace(m, composesClassContent);
      }

      const reg2 = /composes: *([^ ;]+) *;/g;
      // match css with exec and get groups
      while ((match = reg2.exec(css)) !== null) {
        const [m, composesClass] = match;

        const composesClassContent = getClassContent(css, composesClass);

        // replace css with new css
        css = css.replace(m, composesClassContent);
      }
    }
    await fs.writeFile(filePath, css);
    processedFilesCount++;
    logProgress(filePath);
  } catch (e) {
    console.log(e);
  }
}

async function transformAllFiles(files) {
  const promises = files.map((f) => transformCssFile(f));
  await Promise.all(promises);
}

// get arguments from command line

transformAllFiles(files);
