import { setupTokenEditor, getTokenEditorValue } from '../editor';
import { shareJwtLink, shareJwtTextElement } from './dom-elements.js';
import { copyTokenLink } from '../utils.js';
import strings from '../strings.js';

function setupShareJwtButton() {
  shareJwtLink.addEventListener('click', event => {
    event.preventDefault();

    const value = getTokenEditorValue();
    if(value.token) {
      // If the selected algorithm does not use public keys, publicKey will be
      // undefined.
      copyTokenLink(value.token, value.publicKey);
    }

    shareJwtTextElement.firstChild.textContent = 
      strings.extension.jwtIoUrlCopied;
    setTimeout(() => {
      shareJwtTextElement.firstChild.textContent = 
        strings.extension.shareThisJwt;        
    }, 2000);
  });
}

// Initialization
setupTokenEditor();
setupShareJwtButton();
