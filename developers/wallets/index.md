---
layout: subpage
title: "Developer Docs for Digital Wallets"
permalink: /developers/wallets/
---
# CHAPI for Digital Wallets
CHAPI integrates easily into digital wallet software, allowing your wallet to receive and present Verifiable Credentials to/from third party sites.

* [for Web Wallets](#for-web-wallets)
* [for Native Mobile Wallets](#for-native-mobile-apps)

* [Working with `QueryByExample` format requests](querybyexample)

## for Web Wallets
### Resources
- **Example Code**: the [chapi-demo-wallet](https://github.com/credential-handler/chapi-demo-wallet) contains a full example implementation and is referenced throughout this guide. 
- **Polyfill Library**: The [credential-handler-polyfill](https://github.com/credential-handler/credential-handler-polyfill) library provides the needed functionality in the browser.
- **Helper Library**: The [web-credential-handler](https://github.com/credential-handler/web-credential-handler) library provides helper functions for CHAPI integration in your code.

### First, set up your wallet to register itself with the browser as a Credential Handler.  
#### 1. Import the CHAPI Polyfill into your wallet app
If you're developing on Node.js, add the credential-handler-polyfill library to your project.  You can also install the web-credential-handler helper library to simplify your code.

```sh
npm i credential-handler-polyfill@3.0.1
npm i web-credential-handler@2.0.1
```

In your code, you can import and load the polyfill library as follows:

```javascript
import * as CredentialHandlerPolyfill from 'credential-handler-polyfill';
import * as WebCredentialHandler from 'web-credential-handler';

await CredentialHandlerPolyfill.loadOnce();
console.log('Ready to work with credentials!');
```
<p class="code-annotation">
  <a href="https://github.com/credential-handler/chapi-demo-wallet/blob/master/install-wallet.js"
  target="_blank" rel="noopener noreferrer"> chapi-demo-wallet/install-wallet.js </a>
</p>

#### 2. Add a `credential_handler` to your app's manifest.json
In order to register a credential handler, your web app must serve a "manifest.json" file from its root path ("/manifest.json"). This file must also be CORS-enabled.  At a minimum, add the following `credential_handler` object:

```json
{
  "credential_handler": {
    "url": "/wallet-worker.html",
    "enabledTypes": ["VerifiablePresentation"]
  }
}
```
<p class="code-annotation">
  <a href="https://github.com/credential-handler/chapi-demo-wallet/blob/master/manifest.json"
  target="_blank" rel="noopener noreferrer"> chapi-demo-wallet/manifest.json </a>
</p>

#### 3. Allow your users to register their wallet's credential handler with the browser polyfill

You can register a Credential Handler by calling the `CredentialManager.requestPermission()` API. This call will ensure that the individual using the browser explicitly confirms that they want to use the website as a credential handler. The example below uses the `installHandler()` helper method to perform this action:

```javascript
  await WebCredentialHandler.installHandler();
  console.log('Wallet installed.');
```
<p class="code-annotation">
  <a href="https://github.com/credential-handler/chapi-demo-wallet/blob/master/install-wallet.js"
  target="_blank" rel="noopener noreferrer"> chapi-demo-wallet/install-wallet.js </a>
</p>

### Then, configure your wallet to respond to Credential Handler events.
Your wallet app's existing functionality can be configured to respond to CHAPI events.

#### 4. Setup Listeners for CHAPI Events
The `activateHandler()` function is a helper that sets up listeners for CHAPI `get()` and `store()` events.

```javascript
WebCredentialHandler.activateHandler({
    async get(event) {
        console.log('WCH: Received get() event:', event);
        return { type: 'redirect', url: '/wallet-ui-get.html' };
    },
    async store(event) {
        console.log('WCH: Received store() event:', event);
        return { type: 'redirect', url: '/wallet-ui-store.html' };
    }
})
```
<p class="code-annotation">
  <a href="https://github.com/credential-handler/chapi-demo-wallet/blob/master/wallet-worker.html"
  target="_blank" rel="noopener noreferrer"> chapi-demo-wallet/wallet-worker.html </a>
</p>

#### 5. Get Credentials Events
CHAPI supports the presentation of credentials via the `navigator.credentials.get()` API. CHAPI is agnostic to the presentation request query language and passes the query directly through to the credential handler. If you've configured an event listener, you can follow the example below to call the relevant code in your wallet whenever it receives a CHAPI `get()` request from a third-party website.

```javascript
  async function handleGetEvent() {
    const event = await WebCredentialHandler.receiveCredentialEvent();

    console.log('Wallet processing get() event:', event);

    //Your wallet's code for responding to a request for a Verifiable Credential
  }

```
<p class="code-annotation">
  <a href="https://github.com/credential-handler/chapi-demo-wallet/blob/master/wallet-ui-get.html"
  target="_blank" rel="noopener noreferrer"> chapi-demo-wallet/wallet-ui-get.html </a>
</p>

When presenting credentials, the user is shown what they will be sharing and must provide explicit consent before the credentials are shared with the requesting party. 

#### 6. Store Credentials Events
CHAPI supports storing credentials via the `navigator.credentials.store()` API. If you've configured an event listener, you can follow the example below to call the relevant code in your wallet whenever it receives a CHAPI `store()` request from a third-party website.  

```javascript
async function handleStoreEvent() {
    const event = await WebCredentialHandler.receiveCredentialEvent();
    console.log('Store Credential Event:', event.type, event);

    //Your wallet's code for storing a Verifiable Credential
}
```
<p class="code-annotation">
  <a href="https://github.com/credential-handler/chapi-demo-wallet/blob/master/wallet-ui-store.html"
  target="_blank" rel="noopener noreferrer"> chapi-demo-wallet/wallet-ui-store.html </a>
</p>

Storage of credentials prompts the individual using the browser to confirm that they want to store the credential in their digital wallet.

## DID Authentication with CHAPI
This section is written from the perspective of web wallets.  CHAPI provides a simple method for a 3rd party website to request an individual present their Decentralized Identifier (DID) and prove their identity.  The individual selects a digital wallet to respond to this DID Authentication request.

### Resources
- [Verifiable Presentation Request](https://w3c-ccg.github.io/vp-request-spec/#did-authentication)
- [Verifiable Credentials Data Model](https://www.w3.org/TR/vc-data-model/#presentations)
- [DID Core Specification](https://www.w3.org/TR/did-core/#authentication)

#### 1. The 3rd Party Site sends a DID Authentication Request
The individual interacts with a 3rd party website, triggering a request for _DID Authentication_.  The site sends a _Verifiable Presentation Request_ (VPR) using the CHAPI `get()` event.  

An example VPR is shown below.  Like the other CHAPI examples on this site, the VPR is wrapped in a `web` credential object - this ensures that it is passed to a _Credential Handler_ in the individual's browser.
```
"web": {
  "VerifiablePresentation": {
      "query": {
        "type": "DIDAuthentication"
      },
      "challenge": "IME0WNG2MIOsYsPgezxAM", //randomly-generated challenge string (e.g.,a UUID, nanoid, or bnid)
      "domain": "https://playground.chapi.io" //URL of your web app (where the wallet will respond to the DID Auth request
  },
  "recommendedHandlerOrigins": [
      "https://demo.vereswallet.dev/"
  ]
}
```

#### 2. The Digital Wallet responds with a Verifiable Presentation
The individual selects a digital wallet, which responds to the CHAPI `get()` event.  The example code below shows two functions, plus a third function that your wallet will need to create

- `handleGetEvent()` responds to the CHAPI `get()` event and calls `formDIDAuthResponse()` if it sees a request for DID Authentication.
- `formDIDAuthResponse()` creates a "web" credential containing a signed Verifiable Presentation meeting the VPR Spec for DID Authentication
- `signDidAuthPresentation()` is the lower-level function in your wallet that creates a signed Verifiable Presentation with the user's DID.

```javascript
async function formDidAuthResponse({challenge, domain}) {
    const dataType = 'VerifiablePresentation';

    //Add your code for signing a verifiable presentation
    didAuthPresentation = await signDidAuthPresentation({challenge, domain});

    //wrap the DID Auth presentation in a web credential
    const credentialType = 'VerifiablePresentation';
    const didAuthResponse = new WebCredential(
      credentialType, didAuthPresentation, {
      recommendedHandlerOrigins: []
    });

    return didAuthResponse;
}

async function handleGetEvent() {
    const event = await WebCredentialHandler.receiveCredentialEvent();
    console.log('Get Credential Event:', event.type, event);

    const vp = event.credentialRequestOptions.web.VerifiablePresentation;
    const query = Array.isArray(vp.query) ? vp.query[0] : vp.query;

    const {type} = query.value;
    if(type ==='DIDAuthentication') {
      event.respondWith(formDidAuthResponse({challenge: vp.challenge, domain: vp.domain}))
    }
}
```

Your wallet's version of `signDidAuthPresentation()` should create a signed Verifiable Presentation with the `holder` equal to the user's DID.  The example below shows what this looks like with the Ed25519Signature2020 and 2018 signature suites, respectively.

```javascript
const didAuthPresentation = {
    '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/security/suites/ed25519-2020/v1'
    ],
    type: ['VerifiablePresentation'],
    holder: 'did:key:z6MkeprvBw4RFHJPQEmtioq4xRrN6Tk8EBSJ37eBCBQNHRjZ',
    proof: {
        type: 'Ed25519Signature2020',
        created: '2022-11-09T22:04:18Z',
        verificationMethod: 'did:key:z6MkeprvBw4RFHJPQEmtioq4xRrN6Tk8EBSJ37eBCBQNHRjZ#z6MkeprvBw4RFHJPQEmtioq4xRrN6Tk8EBSJ37eBCBQNHRjZ',
        proofPurpose: 'authentication',
        challenge: 'qd4_rg4FvyYDUIuy-DmN9',
        domain: 'https://localhost:51443',
        proofValue: 'zinUxNo4eLvMRU7QaYwSKTKRkvYud7cDeh3B8zm3G1FLZGiSKjCXFgZiQTLKJmpLuatgpcqCTpRZBj4ETAsddcfe'
    }
};

```

```javascript
const didAuthPresentation = {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
    ],
    "type": "VerifiablePresentation",
    "holder": "did:v1:test:nym:z6MkjsQSCqdN4CGE6R9tKhETAEoPYdXci5v4tK2USAhWptpr",
    "proof": {
        "type": "Ed25519Signature2018",
        "created": "2022-10-28T20:24:27Z",
        "verificationMethod": "did:v1:test:nym:z6MkjsQSCqdN4CGE6R9tKhETAEoPYdXci5v4tK2USAhWptpr#z6MkjsQSCqdN4CGE6R9tKhETAEoPYdXci5v4tK2USAhWptpr",
        "proofPurpose": "authentication",
        "challenge": "IME0WNG2MIOsYsPgezxAM",
        "domain": "https://playground.chapi.io",
        "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..n7f3DZ4yNuH2ApE0dZy1gaLBTKEuGYHGsmycgWwKptZaNeKz2FKRAjzPeat3GQnJg1n_5Q6GU9bAql602m2tCg"
    }
};
```

## for Native Mobile Apps

### Resources
- WebShare Specification: [this W3C draft](https://w3c.github.io/web-share/) describes the Web Share API.
- WebShare Documentation: [web.dev](https://web.dev/web-share/) hosts developer docs and examples for the WebShare API

To enable a native wallet to receive VCs via CHAPI, you’ll need to register the wallet as a share target with the mobile OS that is capable of receiving text files.  See appropriate share target documentation for [Android](https://developer.android.com/training/sharing/receive) or [iOS](https://developer.apple.com/library/archive/documentation/General/Conceptual/ExtensibilityPG/ExtensionScenarios.html#//apple_ref/doc/uid/TP40014214-CH21-SW1).
