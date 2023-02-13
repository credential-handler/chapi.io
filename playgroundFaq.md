---
layout: subpage
title: "CHAPI Playground Integration Guide"
permalink: /developers/playgroundfaq
---
# CHAPI Playground Integration Guide

Have you already integrated CHAPI into your project and now you’re interested in making your Issuer, Wallet, or Verifier available for experimentation? This Integration Guide/FAQ for the CHAPI Playground will help you accomplish this!

## Issuers
### New issuer introduction:
You can integrate your Issuer into our tooling with the [CHAPI-Playground Issuer](https://playground.chapi.io/issuer).  

If you can provide a [VC-API /issue endpoint](https://w3c-ccg.github.io/vc-api/#issue-credential), we can add your issuer to the list of options accessible from the "Gear" icon on the site.  That should be all we need for integration with the Veres Wallet.  (Note that you'll also be able to use this site to demonstrate issuance with any other CHAPI-enabled wallets).

We've put together a [quick test](https://github.com/credential-handler/chapi-issuer-test-suite) that you can run locally against your endpoint (the test runs locally; the endpoint can be running anywhere).  If your issuer endpoint can pass the first three test conditions, then we'll be ready to add it to the playground.

### Updating to the VC-API Spec:
To be compliant with the [vc-api spec](https://w3c-ccg.github.io/vc-api/#issue-credential), your endpoint should end in `credentials\issue`.  

### Adding contexts to issuers so that they can support the example credentials hosted on the CHAPI playground.
To ensure interoperability, add the [following contexts](https://docs.google.com/document/d/1L3GnHtvrH51MJ7W2ZAL-PIfzR2dxLyFoDrUAHZ1KBU4/edit) to get it to work with the other credential examples on the CHAPI-playground.

### How should my issuer endpoint handle authentication?
Authentication is up-to-you.  We are working with some open (unauthenticated) VC-API endpoints now, but we also have support for zCap and Oauth2 authentication.  You can test with the endpoint open and then add backend auth as a second step, if you would like to have it.

### Do I need to enable CORS on my issuer endpoint?
You do not need CORS because we are just making a backend call from the CHAPI-playground web app to your VC-API endpoint.


## Wallets
### New wallet introduction
Wallets can integrate with the CHAPI-playground using two different methods:

1. **Basic CHAPI store() workflow:** this workflow uses CHAPI to directly communicate a Verifiable Credential.  The [CHAPI Playground](https://playground.chapi.io) site uses VCAPI on the backend to connect to various issuer sites.  This is a simplified workflow that can get developers up-and-running without the need to implement a credential pickup using VCAPI /exchanges.
2. **VC-API exchanges workflow:** in this workflow, the playground site uses CHAPI to communicate the URL of a VC-API/exchanges endpoint where a Verifiable Credential can be picked up.  The use of CHAPI here preserves the individual's choice of wallet and avoids the need to make assumptions about credential types, wallet apps, etc.  The wallet then hits the specified /exchanges endpoint and receives a Verifiable Presentation containing the Credential.  DID Authentication and credential pickup are performed in the same step.  This is especially useful for native mobile apps.

### Integrating with the basic CHAPI store() workflow
Any CHAPI-enabled wallet can work with the CHAPI-playground.  There is no explicit setting or integration required with the CHAPI-playground site; all that’s required is that the user register the wallet with their browser (web wallets) or as a Share Target (native mobile apps).  See the [developer notes](https://chapi.io/developers/wallets) for instructions and examples on how to implement CHAPI in a web wallet.

When the CHAPI-playground issues a credential, it generates a CHAPI `store` event.  This is also documented at the link above.

### Performing DID Authentication (“DID Auth”) with the CHAPI-playground in the store() workflow?

[Start here](https://gist.github.com/evanlally/3feb599ceadecc511a8a35d1a3b306b1)

These are examples of the types of data passed between the CHAPI playground and the Veres Wallet during the DID Auth workflow.  The CHAPI-playground will send the Verifiable Presentation Request in (1.) as a "web" credential object using `navigator.credentials.get()`.

Your wallet will respond with the Verifiable Presentation in (2.), also as a "web" credential object.  The playground receives the DID Auth, it extracts the value of `holder` and inserts it into the credential being issued.  Then, the credential is issued using the basic CHAPI `store` workflow.

All of this follows the patterns in the [VPR spec](https://w3c-ccg.github.io/vp-request-spec/#example-example-get-request).

### Integrating with the VC-API exchanges workflow
Here's an overview of the steps:
1. CHAPI Playground sends a DID Auth Request (VPR) over CHAPI to the wallet.  This includes an `interact` field that specifies an \exchanges endpoint on the CHAPI Playground.
2. The Wallet POSTs a VP containing the DID Auth to the \exchanges endpoint.
3. The CHAPI Playground \exchanges endpoint responds with a VP containing the specified credential

Example data for each step can be found [here](https://gist.github.com/tolson4/6e44720a15957136fbe6ca33403c4bcb).

We’ve added an example to the [Verifiable Presentation Request (VPR) spec](https://w3c-ccg.github.io/vp-request-spec/#example-example-interact-request) to show how an issuer can ask for DID Authentication and then point the wallet at /exchanges endpoint to perform the Auth-Pickup workflow.

In this example, the `interact` field describes the type and URL of the /exchanges endpoint.  The `type` is an `UnmediatedPresentationService2021`, which is outlined in the [VCAPI spec](https://w3c-ccg.github.io/vc-api/#exchange-examples).

## Verifiers
Integrating Verifiers into the CHAPI playground is next on our agenda, stay tuned for more information on that process as it becomes available. 
