import { isValidBase64String } from '../utils.js';

import { 
  jws,
  KEYUTIL,
  b64utoutf8,
  b64utohex,
  utf8tohex 
} from 'jsrsasign';

import log from 'loglevel';

export function sign(header, 
                     payload,
                     secretOrPrivateKeyString,
                     base64Secret = false) {
  if(!header.alg) {
    throw new Error('Missing "alg" claim in header');
  }

  if(header.alg.indexOf('HS') === 0) {
    return jws.JWS.sign(null, header, payload, 
      base64Secret ? 
        b64utohex(secretOrPrivateKeyString) : 
        utf8tohex(secretOrPrivateKeyString));
  } else {
    return jws.JWS.sign(null, header, payload, secretOrPrivateKeyString);
  }
}

export function verify(jwt, secretOrPublicKeyString, base64Secret = false) {
  if(!isToken(jwt)) {
    return false;
  }

  const decoded = decode(jwt);
  
  if(!decoded.header.alg) {
    return false;
  }

  try {
    if(decoded.header.alg.indexOf('HS') === 0) {
      return jws.JWS.verify(jwt, 
        base64Secret ? 
          b64utohex(secretOrPublicKeyString) : 
          utf8tohex(secretOrPublicKeyString));
    } else {
      return jws.JWS.verify(jwt, secretOrPublicKeyString);
    }
  } catch(e) {
    log.warn('Could not verify token, ' +
                  'probably due to bad data in it or the keys: ', e);
    return false;
  }
}

export function decode(jwt) {
  const result = {
    header: {},
    payload: {},
    errors: false
  };

  if(!jwt) {
    result.errors = true;
    return result;
  }
  
  const split = jwt.split('.');
  
  try {
    result.header = JSON.parse(b64utoutf8(split[0]));
  } catch(e) {
    result.header = {};
    result.errors = true;
  }

  try {
    result.payload = JSON.parse(b64utoutf8(split[1]));
  } catch(e) {
    result.payload = {};
    result.errors = true;
  }

  return result;
}

export function isToken(jwt, checkTypClaim = false) {
  const decoded = decode(jwt);

  if(decoded.errors) {
    return false;
  }

  if(checkTypClaim && decoded.header.typ !== 'JWT') {
    return false;
  }

  const split = jwt.split('.');
  let valid = true;
  split.forEach(s => valid = valid && isValidBase64String(s, true));

  return valid;
}
