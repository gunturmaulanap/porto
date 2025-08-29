/**
 * Lightweight text splitting utility (replaces paid GSAP SplitText)
 * Splits text into words or characters wrapped in spans
 */

export class SplitText {
  constructor(element, options = {}) {
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
    this.options = {
      type: 'words', // 'words', 'chars', 'lines'
      wordsClass: 'split-word',
      charsClass: 'split-char',
      linesClass: 'split-line',
      ...options
    };
    
    this.words = [];
    this.chars = [];
    this.lines = [];
    
    if (this.element) {
      this.split();
    }
  }
  
  split() {
    const text = this.element.textContent;
    const { type, wordsClass, charsClass } = this.options;
    
    if (type === 'words' || type === 'chars') {
      this.splitWords(text, wordsClass, charsClass, type === 'chars');
    }
  }
  
  splitWords(text, wordsClass, charsClass, splitChars = false) {
    const words = text.split(/(\s+)/);
    let html = '';
    
    words.forEach((word, wordIndex) => {
      if (word.match(/^\s+$/)) {
        html += word;
        return;
      }
      
      if (splitChars) {
        const chars = word.split('');
        let wordHtml = `<span class="${wordsClass}" data-word="${wordIndex}">`;
        
        chars.forEach((char, charIndex) => {
          const span = `<span class="${charsClass}" data-char="${this.chars.length}">${char}</span>`;
          wordHtml += span;
          this.chars.push({ element: null, char, wordIndex, charIndex });
        });
        
        wordHtml += '</span>';
        html += wordHtml;
      } else {
        const span = `<span class="${wordsClass}" data-word="${wordIndex}">${word}</span>`;
        html += span;
      }
      
      this.words.push({ element: null, word, index: wordIndex });
    });
    
    this.element.innerHTML = html;
    
    // Cache DOM references
    this.words = Array.from(this.element.querySelectorAll(`.${wordsClass}`));
    if (splitChars) {
      this.chars = Array.from(this.element.querySelectorAll(`.${charsClass}`));
    }
  }
  
  revert() {
    if (this.element && this.element.dataset.originalText) {
      this.element.textContent = this.element.dataset.originalText;
    }
  }
}

// Utility function for quick word splitting
export const splitIntoWords = (element, className = 'split-word') => {
  const splitter = new SplitText(element, { type: 'words', wordsClass: className });
  return splitter.words;
};

// Utility function for quick character splitting
export const splitIntoChars = (element, className = 'split-char') => {
  const splitter = new SplitText(element, { type: 'chars', charsClass: className });
  return splitter.chars;
};