const sass = require('sass');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const eleventyMermaidPlugin = require('@kevingimbel/eleventy-plugin-mermaid');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = function(eleventyConfig) {
  /* Markdown Overrides */
  const markdownLibrary = markdownIt({
    html: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: false
  });
  eleventyConfig.setLibrary('md', markdownLibrary);

  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(eleventyMermaidPlugin);
  // add custom JS for loading SVG pan/zoom features
  eleventyConfig.addShortcode('mermaid_with_callback_js', () => {
    const src = 'https://unpkg.com/mermaid@10/dist/mermaid.esm.min.mjs';
    return `<script type="module" async>
      import mermaid from '${src}';
      mermaid.run({
        querySelector: '.mermaid',
        postRenderCallback: (id) => {
          const selector = '#'.concat(id);
          const chart = document.getElementById(id);
          chart.setAttribute('height', chart.getBoundingClientRect().height);
          const zoomable = svgPanZoom(selector, {
            zoomEnabled: true,
            controlIconsEnabled: true,
            fit: true,
            center: true
          });
        }
      });
    </script>`;
  });

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
