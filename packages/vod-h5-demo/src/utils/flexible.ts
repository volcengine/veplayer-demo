import { os } from './index';
function flexible(window: Window, document: Document) {
  const docEl = document.documentElement;
  const dpr = window.devicePixelRatio || 1;
  window.flexible = flexible;
  // adjust body font size
  function setBodyFontSize() {
    if (document.body) {
      document.body.style.fontSize = 12 * dpr + 'px';
    } else {
      document.addEventListener('DOMContentLoaded', setBodyFontSize);
    }
  }
  setBodyFontSize();

  // set 1rem = viewWidth / 10
  function setRemUnit() {
    if (os.isPc) {
      // PC设置为100
      docEl.style.fontSize = '100px';
      return;
    }
    const width = docEl.getBoundingClientRect().width || docEl.clientWidth;
    const height = docEl.getBoundingClientRect().height || docEl.clientHeight;
    const realWidth = Math.min(width, height); // 兼容手机横屏case
    const rem = (realWidth * 100) / 375;
    docEl.style.fontSize = rem + 'px';
  }

  function setVh() {
    // 使用0.01倍的innerHeight 作为vh css变量
    // 避免h5端浏览器底部有工具栏时，css本身的vh单位不能响应工具栏的存在，会造成底部内容被遮挡的问题
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  setRemUnit();
  setVh();

  // reset rem unit on page resize
  window.addEventListener('resize', () => {
    setRemUnit();
    setVh();
  });
  window.addEventListener('pageshow', e => {
    if (e.persisted) {
      setRemUnit();
    }
  });

  // detect 0.5px supports
  if (dpr >= 2) {
    const fakeBody = document.createElement('body');
    const testElement = document.createElement('div');
    testElement.style.border = '.5px solid transparent';
    fakeBody.appendChild(testElement);
    docEl.appendChild(fakeBody);
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines');
    }
    docEl.removeChild(fakeBody);
  }
}

export default flexible;
