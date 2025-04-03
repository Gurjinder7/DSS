import  minify  from '@node-minify/core';
import htmlMinifier from '@node-minify/html-minifier';
import minifyCleanCSS from '@node-minify/clean-css';
import minifyTerser from '@node-minify/terser';

minify({
    compressor: minifyTerser,
    input: '../public/js/register.js',
    output: '../public/js/minified/register.js',
    callback: (err, min) => {},
    // option: {
    //   // beautify: 'beautify',
    //   ecma: "2016",
    //   compress: false,
    //   format: true,
    // }
  });


  minify({
    compressor: htmlMinifier,
    input: "./views/register.html",
    output: "./views/register.html",
    callback: (err, min) =>{}
  })

  minify({
    compressor: minifyCleanCSS,
    input: '../public/css/style.css',
    output: '../public/css/style.min.css',
    callback: (err, min) => {}
  });