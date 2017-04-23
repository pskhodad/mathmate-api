'use strict';

const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const Vue = require('vue');
const renderer = require('vue-server-renderer').createRenderer()
const Chance = require('chance');

exports.genques = functions.https.onRequest((req, res) => {
  if (req.method === 'PUT') {
    res.status(403).send('Forbidden!');
  }
  cors(req, res, () => {
    const chance = new Chance();
    const app = new Vue({
      template: `<div id='app'>
            <p>Q. {{ qtxt }}</p>
          <p>Ans: {{ cans }}</p>
                    </div>`,
      computed: {
        wordlen: function() {
          return ((chance.natural({
            min: 2,
            max: 4
          }) * 2) + 1)
        },
        baseword: function() {
          return chance.word({length: this.wordlen})
                                    .toUpperCase()
        },
        word1: function() {
          return this.baseword
            .split("")
            .map((letter) => {
              if (['a', 'e', 'i', 'o', 'u'].indexOf(letter.toLowerCase()) !== -1) {
                return String.fromCharCode(letter.charCodeAt(0) + 1)
              } else {
                return String.fromCharCode(letter.charCodeAt(0) - 1)
              }
            })
            .join("")
            .toUpperCase()
        },
        qtxt: function() {
          return `The letters in the word ${this.baseword} are changed in such a way, that the consonants are replaced by the previous letter in the English alphabet and the vowels are replaced by the next letter in the English alphabet. What is the third letter from the left end of the new set of letters?`
        },
        cans: function() {
          return this.word1[2]
        }
      }
    })
    
    renderer.renderToString(app, (error, html) => {
        if (error) throw error;
        console.log(html);
        res.status(200).send(html);
    });
  });
});
// [END all]
