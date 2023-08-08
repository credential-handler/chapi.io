---
layout: subpage
title: "Developer Docs for VC Verifiers"
permalink: /developers/verifiers/
---
## CHAPI for VC Verifiers
CHAPI integrates easily into verifier websites, allowing your site to request Verifiable Credentials presentations from a user's digital wallet.

* [Verifying Multiple Credentials](multicredentials)

## Resources
- **Example Code**: the [chapi-demo-verifier](https://github.com/credential-handler/chapi-demo-verifier) contains a full example implementation and is referenced throughout this guide. 
- **Polyfill Library**: The [credential-handler-polyfill](https://github.com/credential-handler/credential-handler-polyfill) library provides the needed functionality in the browser.

## Import the CHAPI Polyfill into your Verifier Site
If you're working in vanilla JavaScript, you can add the `navigator.credentials` and `credentialHandlerPolyfill` globals to your code and then load the polyfill library:

```html
<script src="https://unpkg.com/credential-handler-polyfill@3.0.1/dist/credential-handler-polyfill.min.js"></script>

<script>
await credentialHandlerPolyfill.loadOnce();
</script>
```
<p class="code-annotation">
  <a href="https://github.com/credential-handler/chapi-demo-verifier/blob/master/index.html"
  target="_blank" rel="noopener noreferrer"> chapi-demo-verifier/index.html </a>
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
## Construct a Web Credential Query
#### 1. Make a Verifiable Presentation Request
A verifier can request credentials over CHAPI by forming a *[Verifiable Presentation Request](https://w3c-ccg.github.io/vp-request-spec/)*.  The example below illustrates a `QueryByExample`, which specifies the type of Verifiable Credential being requested and an optional reason for the request.

```javascript
const testVpr = {
  query: [{
    type: "QueryByExample",
    credentialQuery: {
      reason: "Please present your University Degree to continue the teacher application process.",
      example: {
        "@context": [
          "https://w3id.org/credentials/v1",
          "https://www.w3.org/2018/credentials/examples/v1"
        ],
        type: ["UniversityDegreeCredential"],
        credentialSubject: {
          "id": "did:example:ebfeb1f712ebc6f1c276e12ec21"
        }
      }
    }
  }]
};
```
<p class="code-annotation">
  <a href="https://github.com/credential-handler/chapi-demo-verifier/blob/master/index.html"
  target="_blank" rel="noopener noreferrer"> chapi-demo-verifier/index.html </a>
</p>

#### 2. Wrap the Request in a Web Credential Query
Next, construct a generalized *[Credential Interface Query](https://www.w3.org/TR/credential-management-1/)* of type `web`.  This will be passed through the browser to a CHAPI Credential Handler, which recognizes generalized *Web Credentials*. The example below illustrates a Web Credential request for a `VerifiablePresentation` which uses the specific query parameters defined above.  The `recommendedHandlerOrigins` parameter allows verifiers to suggest Credential Handlers (e.g. digital wallets) for the user to present the requested data. 

```javascript
const credentialInterfaceQuery = {
  web: {
    VerifiablePresentation: testVpr,
    recommendedHandlerOrigins: [
      "https://wallet.example.chapi.io/"
    ]
  }
};
```
<p class="code-annotation">
  <a href="https://github.com/credential-handler/chapi-demo-verifier/blob/master/index.html"
  target="_blank" rel="noopener noreferrer"> chapi-demo-verifier/index.html </a>
</p>

## Request a Web Credential
An verifier can get() and store() credentials without knowing anything about the user's wallet. This is intentional; for privacy reasons, the verifier must not be able to query any information (without user consent) about which wallets or credential handlers a user may have installed (otherwise, fingerprinting and other attacks would be possible).

A credential verifier can ask to store a Verifiable Credential during a user gesture event, for example when the user pushes a button to receive a credential.
```javascript
const result = await navigator.credentials.get(credentialQuery);
console.log('Result of get() request:', JSON.stringify(result, null, 2));
```
<p class="code-annotation">
  <a href="https://github.com/credential-handler/chapi-demo-verifier/blob/master/index.html"
  target="_blank" rel="noopener noreferrer"> chapi-demo-verifier/index.html </a>
</p>


## Handle Null Results
If the get() or store() operation resolves to a null value, this means one of two things:

- The user has denied or canceled the request
- The user does not have a wallet (credential handler service) installed

As mentioned previously, there is (intentionally) no way for the client to know which of these is the case.

As a developer, the recommended way to handle this situation depends on your specific use case. This dilemma is familiar to mobile app developers asking for specific phone permissions (to access the camera or location, for example). It is up to you to decide whether your app has fallback mechanisms, or whether the operation is required and things come to a halt without it.

Typical ways of handling empty results may include:

- Invite the user to install a wallet if they haven't already (and provide a link/recommendation)
- (In case the user denied the request) Invite the user to retry the operation, after explaining why you're asking to get or store the credential
- (If possible/applicable) Provide an alternate path to the user (the conceptual equivalent of allowing "Guest Checkout" if the user has refused to register for an ecommerce account).
