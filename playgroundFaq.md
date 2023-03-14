---
layout: subpage
title: "CHAPI Playground Integration Guide"
permalink: /developers/playgroundfaq
---
# CHAPI Playground Integration Guide

Have you already integrated CHAPI into your project and now you’re interested in making your Issuer, Wallet, or Verifier available for experimentation? This Integration Guide/FAQ for the CHAPI Playground will help you accomplish this!

## Issuers
### New issuer introduction:
You can integrate your Issuer into our tooling with the [CHAPI Playground Issuer](https://playground.chapi.io/issuer).

If you provide a [VC-API /issue endpoint](https://w3c-ccg.github.io/vc-api/#issue-credential), we can add your issuer to the list of options accessible from the "Gear" icon on the site.  Your endpoint should end in `/credentials/issue`.

We've put together a [simple test utility](https://github.com/credential-handler/chapi-playground-test-suite) that you can run locally against your endpoint (the test runs locally; the endpoint can be running anywhere).  Once your issuer endpoint can pass the test conditions, we'll be ready to add it to the list of options in the CHAPI Playground.

Once integrated into the Playground, your issuer will be able to work with any CHAPI-enabled wallet, including the Veres Wallet. (Note that you can also add CHAPI support directly to your issuer so that it can communicate directly with digital wallets).

### Adding contexts to issuers so that they can support the example credentials hosted on the CHAPI Playground.
Many VC issuers keep a list of supported JSON-LD contexts.  To ensure interoperability, make sure your issuer supports the [following contexts](https://docs.google.com/document/d/1L3GnHtvrH51MJ7W2ZAL-PIfzR2dxLyFoDrUAHZ1KBU4/edit) used in the example credentials hosted on the CHAPI Playground.

NOTE: Example credentials can be added or updated in
[@credential-handler/vc-examples](https://github.com/credential-handler/vc-examples).

### How should my issuer endpoint handle authentication?
Issuer endpoint authentication is up-to-you.  Many issuers choose to start with open (unauthenticated) VC-API endpoints, but the CHAPI Playground backend also supports zCap and Oauth2 authentication.  You can test with the endpoint open and then add backend auth as a second step, if you would like to have it.

### Do I need to enable CORS on my issuer endpoint?
Issuer backends do not need CORS because the CHAPI Playground web app makes a backend call to your VC-API endpoint.


## Wallets
### New wallet introduction
Wallets can integrate with the CHAPI Playground using two different methods:

1. **Basic CHAPI store() workflow:** this workflow uses CHAPI to directly communicate a Verifiable Credential.  The [CHAPI Playground](https://playground.chapi.io) site uses VCAPI on the backend to connect to various issuer sites.  This is a simplified workflow that can get developers up-and-running without the need to implement a credential pickup using VC-API/exchanges.
2. **VC-API/exchanges workflow:** in this workflow, the Playground site uses CHAPI to communicate the URL of a VC-API/exchanges endpoint where a Verifiable Credential can be picked up.  The use of CHAPI here preserves the individual's choice of wallet and avoids the need to make assumptions about credential types, wallet apps, etc.  The wallet then hits the specified /exchanges endpoint and receives a Verifiable Presentation containing the Credential.  DID Authentication and credential pickup are performed in the same step.  This is especially useful for native mobile apps.

### Integrating with the basic CHAPI store() workflow
Any CHAPI-enabled wallet can work with the CHAPI Playground.  There is no explicit setting or integration required with the Playground site; all that’s required is that the user register the wallet with their browser (web wallets) or as a Share Target (native mobile apps).  See the [developer notes](https://chapi.io/developers/wallets) for instructions and examples on how to implement CHAPI in a web wallet.

When the CHAPI Playground issues a credential, it generates a CHAPI `store()` event.  This is also documented in the developer notes linked above.

### Performing DID Authentication (“DID Auth”) with the CHAPI Playground in the store() workflow?

The CHAPI Playground follows the DID Auth patterns described in the [Verifiable Presentation Request (VPR) spec](https://w3c-ccg.github.io/vp-request-spec/#example-example-get-request).

First, the Playground will send a Verifiable Presentation Request as a "web" credential object using `navigator.credentials.get()`.  Second, your wallet will respond with a Verifiable Presentation,  also as a "web" credential object.  Examples of both the VPR and VP are included in the [wallet developer notes](https://chapi.io/developers/wallets).

The Playground receives the DID Auth, it extracts the value of `holder` and inserts it into the credential being issued.  Then, the credential is issued using the basic CHAPI `store` workflow.


### Integrating with the VC-API/exchanges workflow
The general /exchanges pattern is illustrated in the [Verifiable Presentation Request (VPR) spec](https://w3c-ccg.github.io/vp-request-spec/#example-example-interact-request), which shows how an issuer can ask for DID Authentication and then point the wallet at /exchanges endpoint to perform the Auth-Pickup workflow.

In this example, the `interact` field describes the type and URL of the /exchanges endpoint.  The `type` is an `UnmediatedPresentationService2021`, which is outlined in the [VC-API spec](https://w3c-ccg.github.io/vc-api/#exchange-examples).

The CHAPI Playground implementation follows the general pattern, via the following spcific steps (with example data):

**Step 1**: CHAPI Playground sends a DID Auth Request (VPR) over CHAPI to the wallet.  This includes an `interact` field that specifies an /exchanges endpoint on the CHAPI Playground.  
```
{
    "query": {
        "type": "DIDAuthentication"
    },
    "interact": {
        "service": [
            {
                "type": "VerifiableCredentialApiExchangeService",
                "serviceEndpoint": "https://playground.chapi.io/exchanges/eyJjcmVkZW50aWFsIjoiaHR0cHM6Ly9wbGF5Z3JvdW5kLmNoYXBpLmlvL2V4YW1wbGVzL2pmZjIvamZmMi5qc29uIiwiaXNzdWVyIjoiZGIvdmMifQ/esOGVHG8d44Q"
            },
            {
                "type": "CredentialHandlerService"
            }
        ]
    },
    "challenge": "g2Wvqg7-cQGWYCCH55rUl",
    "domain": "https://playground.chapi.io"
}
```

**Step 2**: The Wallet POSTs a VP containing the DID Auth to the /exchanges endpoint.
```
{
  "verifiablePresentation" :{
    "@context": [
      "https://www.w3.org/2018/credentials/v1"
    ],
    "type": [
      "VerifiablePresentation"
    ],
    "holder": "did:example:z6MkjsQSCqdN4CGE6R9tKhETAEoPYdcpO5v4tK2USAhWptpr",
    "proof": {
      "type": "Ed25519Signature2020
      "created": "2022-10-17T18:12:55Z",
      "verificationMethod": "did:example:z6MkjsQSCqdN4CGE6R9tKhETAEoPYdcpO5v4tK2USAhWptpr#z6MkjsQSCqdN4CGE6R9tKhETAEoPYdcpO5v4tK2USAhWptpr",
      "proofPurpose": "authentication",
      "challenge": "TTkKgear2sBt4TYxr_zrL",
      "domain": "https://playground.chapi.io",
      "proofValue": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..gaG1RaxRy-xLkjVN-7ulh0dbUU1EX"
    }
  }
}
```

**Step 3**: The CHAPI Playground /exchanges endpoint responds with a VP containing the specified credential
```
{
  "verifiablePresentation": {
    "@context": [
      "https://www.w3.org/2018/credentials/v1"
    ],
    "type": [
      "VerifiablePresentation"
    ],
    "verifiableCredential": [
      {
        ...
        // the issued credential with the DID from the DID Auth inserted into credentials subject
      }
    ]
  }
}
```


## Verifiers
Integrating Verifiers into the CHAPI Playground is next on our agenda, stay tuned for more information on that process as it becomes available.
