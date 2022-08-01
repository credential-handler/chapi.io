---
layout: subpage
title: "Developer Docs for Digital Wallets"
permalink: /developers/wallets
---
# CHAPI for Digital Wallets
CHAPI integrates easily into digital wallet software, allowing your wallet to receive and present Verifiable Credentials to/from third party sites:

## for Web Wallets
### Resources
- **Example Code**: the [chapi-demo-wallet](https://github.com/credential-handler/chapi-demo-wallet) contains a full example implementation and is referenced throughout this guide. 
- **Polyfill Library**: The [credential-handler-polyfill](https://github.com/credential-handler/credential-handler-polyfill) library provides the needed functionality in the browser.
- **Helper Library**: The [web-credential-handler](https://github.com/credential-handler/web-credential-handler) library provides helper functions for CHAPI integration in your code.

### First, set up your wallet to register itself with the browser as a Credential Handler.  
#### 1. Import the CHAPI Polyfill into your wallet app
If you're developing on Node.js, add the credential-handler-polyfill library to your project.  You can also install the web-credential-handler helper library to simplify your code.

```
npm i credential-handler-polyfill@3.0.0
npm i web-credential-handler@2.0.0 
``` 

In your code, you can import and load the polyfill library as follows:

```
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

```
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

```
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

```
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

```
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

```
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

## for Native Mobile Apps

### Resources
- WebShare Specification: [this W3C draft](https://w3c.github.io/web-share/) describes the Web Share API.
- WebShare Documentation: [web.dev](https://web.dev/web-share/) hosts developer docs and examples fot the WebShare API

To enable a native wallet to receive VCs via CHAPI, you’ll need to register the wallet as a share target with the mobile OS that is capable of receiving text files.  See appropriate share target documentation for [Android](https://developer.android.com/training/sharing/receive) or [iOS](https://developer.apple.com/library/archive/documentation/General/Conceptual/ExtensibilityPG/ExtensionScenarios.html#//apple_ref/doc/uid/TP40014214-CH21-SW1).
