---
layout: subpage
title: "Developer Docs for VC Issuers"
permalink: /developers/issuers
---
# CHAPI for VC Issuers
CHAPI integrates easily into issuer websites, allowing your site to issue Verifiable Credentials and present them for storage in the recipient's digital wallet:

## Resources
- **Example Code**: the [chapi-demo-issuer](https://github.com/credential-handler/chapi-demo-issuer) contains a full example implementation and is referenced throughout this guide. 
- **Polyfill Library**: The [credential-handler-polyfill](https://github.com/credential-handler/credential-handler-polyfill) library provides the needed functionality in the browser.

## Import the CHAPI Polyfill into your Issuer Site
If you're working in vanilla JavaScript, you can add the `navigator.credentials` and `credentialHandlerPolyfill` globals to your code and then load the polyfill library:

```html
<script src="https://unpkg.com/credential-handler-polyfill@3.0.1/dist/credential-handler-polyfill.min.js"></script>

<script>
await credentialHandlerPolyfill.loadOnce();
</script>
```
<p class="code-annotation">
  <a href="https://github.com/credential-handler/chapi-demo-issuer/blob/master/index.html"
  target="_blank" rel="noopener noreferrer"> chapi-demo-issuer/index.html </a>
</p>


Or, if you're developing on Node.js, add the credential-handler-polyfill library to your project...

```sh
npm i credential-handler-polyfill@3.0.1
```

and then import and load the polyfill library as follows:

```javascript
import * as CredentialHandlerPolyfill from 'credential-handler-polyfill';

await CredentialHandlerPolyfill.loadOnce();
console.log('Ready to work with credentials!');
```

## Create a WebCredential Object
To communicate a Verifiable Credential over CHAPI, it must be wrapped in a `WebCredential` object, which is constructed as follows:

#### 1. Make a Verifiable Presentation
Incorporate the Verifiable Credential(s) into a *[Verifiable Presentation](https://www.w3.org/TR/vc-data-model/#presentations-0)*.  A Verifiable Presentation contains an array of one or more Verifiable Credentials. For CHAPI, the Verifiable Presentation object does not need to be separately signed.

```javascript
const testPresentation = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.w3.org/2018/credentials/examples/v1"
    ],
    "type": "VerifiablePresentation",
    verifiableCredential: [
        //your Verifiable Credential,
        //other VCs, if you want to include multiple
    ],
    //A proof is not required on the Verifiable Presentation (only on the VCs themselves)
};
```
<p class="code-annotation">
  <a href="https://github.com/credential-handler/chapi-demo-issuer/blob/master/index.html"
  target="_blank" rel="noopener noreferrer"> chapi-demo-issuer/index.html </a>
</p>

#### 2. Make a Web Credential
Add wrapper data to the Verifiable Presentation to construct a *WebCredential* object.  The `recommendedHandlerOrigins` parameter allows issuers to suggest Credential Handlers (e.g. digital wallets) for the user to receive the data. 

```javascript
const credentialType = 'VerifiablePresentation';
const webCredentialWrapper = new WebCredential(
    credentialType, testPresentation, {
    recommendedHandlerOrigins: [
        'https://wallet.example.chapi.io/'
    ]
});
```
<p class="code-annotation">
  <a href="https://github.com/credential-handler/chapi-demo-issuer/blob/master/index.html"
  target="_blank" rel="noopener noreferrer"> chapi-demo-issuer/index.html </a>
</p>

## Issue and Store Credentials
An issuer can get() and store() credentials without knowing anything about the user's wallet. This is intentional; for privacy reasons, the issuer must not be able to query any information (without user consent) about which wallets or credential handlers a user may have installed (otherwise, fingerprinting and other attacks would be possible).

A credential issuer can ask to store a Verifiable Credential during a user gesture event, for example when the user pushes a button to receive a credential.
```javascript
const result = await navigator.credentials.store(webCredentialWrapper);
if(!result) {
  console.log('store credential operation did not succeed');
}
```
<p class="code-annotation">
  <a href="https://github.com/credential-handler/chapi-demo-issuer/blob/master/index.html"
  target="_blank" rel="noopener noreferrer"> chapi-demo-issuer/index.html </a>
</p>

## Handle Empty Results
If the get() or store() operation resolves to a null value, this means one of two things:

- The user has denied or canceled the request
- The user does not have a wallet (credential handler service) installed

As mentioned previously, there is (intentionally) no way for the client to know which of these is the case.

As a developer, the recommended way to handle this situation depends on your specific use case. This dilemma is familiar to mobile app developers asking for specific phone permissions (to access the camera or location, for example). It is up to you to decide whether your app has fallback mechanisms, or whether the operation is required and things come to a halt without it.

Typical ways of handling empty results may include:

- Invite the user to install a wallet if they haven't already (and provide a link/recommendation)
- (In case the user denied the request) Invite the user to retry the operation, after explaining why you're asking to get or store the credential
- (If possible/applicable) Provide an alternate path to the user (the conceptual equivalent of allowing "Guest Checkout" if the user has refused to register for an ecommerce account).
