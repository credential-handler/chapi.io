const sass = require('sass');

module.exports = function(eleventyConfig) {
  eleventyConfig.addTemplateFormats('scss');
  // Creates the extension for use
  eleventyConfig.addExtension('scss', {
    outputFileExtension: 'css', // optional, default: 'html'

    // `compile` is called once per .scss file in the input directory
    compile: async function(inputContent) {
      let result = sass.compileString(inputContent, { loadPaths: ['_sass/'] });

      // This is the render function, `data` is the full data cascade
      return async (data) => {
        return result.css;
      };
    }
  });

  eleventyConfig.addPassthroughCopy('**/*.jpg');
  eleventyConfig.addPassthroughCopy('**/*.png');

  // Return your Object options:
  return {
    dir: {
      layouts: '_layouts'
    }
  }
};
