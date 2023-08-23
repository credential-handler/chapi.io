---
layout: subpage
title: "Developer Docs for CHAPI Wallet QueryByExample"
permalink: /developers/wallets/querybyexample/
---
# {{ title }}

Prerequisite: This document assumes completion of the
[CHAPI integration for Digital Wallets integration instructions](./).

Responding to requests for credentials from a verifier is a critical step in building out a complete wallet. There are multiple credential query formats, but today we're focusing on Verifiable Presentation Request's `QueryByExample` format.

When integrating with the CHAPI Playground, the JSON sent to the Wallet is in the form of a Verifiable Presentation (VP) Request with one or more QueryByExamples. The payload will be received from the `handleGetEvent` function:

```js
async function handleGetEvent() {
  const event = await WebCredentialHandler.receiveCredentialEvent();
  console.log('Get Credential Event:', event.type, event);

  const vpr = event.credentialRequestOptions.web.VerifiablePresentation;
  // Contains one more QueryByExamples
  const query = Array.isArray(vpr.query) ? vpr.query[0] : vpr.query;

  // Your wallet's code for responding to a request for a Verifiable Credential
}
```

A QueryByExample contains a property named `credentialQuery.example` which contains the set of properties that the Verifiable Credential (VC) must match. The `@context` and `type` properties of a VC will always be present. Additional properties may be requested for more fine grained querying. Use the QueryByExample(s) in combination with the credentials in your wallet to query for the proper VCs.

Next, you will create a signed Verifiable Presentation (VP) using the requested VCs.
```js
async function formSignedVPResponse({challenge, domain, verifiableCredentials}) {
  // Add your code for signing a verifiable presentation
  const vp = await signVerifiablePresentation({challenge, domain, verifiableCredentials});

  // Wrap the verifiable presentation in a web credential
  const credentialType = 'VerifiablePresentation';
  const vpResponse = createWebCredential(credentialType, verifablePresentation);

  return vpResponse;
}
```

Finally, you will wrap the signed VP in a WebCredential and send the response.
```js
async function handleGetEvent() {
  const event = await WebCredentialHandler.receiveCredentialEvent();
  console.log('Get Credential Event:', event.type, event);

  const vpr = event.credentialRequestOptions.web.VerifiablePresentation;
  // Contains one more QueryByExamples
  const query = Array.isArray(vpr.query) ? vpr.query[0] : vpr.query;

  // Your wallet's code for responding to a request for a Verifiable Credential
  const requestedVCs = getVerifiableCredentials({query});
  event.respondWith(
    formSignedVPResponse({
      challenge: vpr.challenge,
      domain: vpr.domain,
      verifiableCredentials: requestedVCs
    })
  );
}
```

Below you will find the VP Requests which Wallets may receive when testing used with the [CHAPI Playground](https://playground.chapi.io/).

## VP Request for Alumni VC
```json
{
  "query": [
    {
      "type": "QueryByExample",
      "credentialQuery": {
        "reason": "Please present your Verifiable Credential to complete the verification process.",
        "example": {
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://www.w3.org/2018/credentials/examples/v1",
            "https://contexts.vcplayground.org/examples/alumni/v1.json"
          ],
          "type": [
            "AlumniCredential"
          ]
        }
      }
    }
  ]
}
```

## VP Request for JFF x vc-edu PF3 VC
```json
{
  "query": [
    {
      "type": "QueryByExample",
      "credentialQuery": {
        "reason": "Please present your Verifiable Credential to complete the verification process.",
        "example": {
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://purl.imsglobal.org/spec/ob/v3p0/context.json"
          ],
          "type": [
            "OpenBadgeCredential"
          ],
          "credentialSubject": {
            "achievement": {
              "id": "urn:uuid:ac254bd5-8fad-4bb1-9d29-efd938536926"
            }
          }
        }
      }
    }
  ]
}
```

## VP Request for Permanent Resident VC
```json
{
  "query": [
    {
      "type": "QueryByExample",
      "credentialQuery": {
        "reason": "Please present your Verifiable Credential to complete the verification process.",
        "example": {
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://w3id.org/citizenship/v1"
          ],
          "type": [
            "PermanentResidentCard"
          ]
        }
      }
    }
  ]
}
```

## VP Request for Alumni & JFF x vc-edu PF3 & Permanent Resident VC
```json
{
  "query": [
    {
      "type": "QueryByExample",
      "credentialQuery": {
        "reason": "Please present your Verifiable Credential to complete the verification process.",
        "example": {
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://www.w3.org/2018/credentials/examples/v1",
            "https://contexts.vcplayground.org/examples/alumni/v1.json"
          ],
          "type": [
            "AlumniCredential"
          ]
        }
      }
    },
    {
      "type": "QueryByExample",
      "credentialQuery": {
        "reason": "Please present your Verifiable Credential to complete the verification process.",
        "example": {
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://w3id.org/citizenship/v1"
          ],
          "type": [
            "PermanentResidentCard"
          ]
        }
      }
    },
    {
      "type": "QueryByExample",
      "credentialQuery": {
        "reason": "Please present your Verifiable Credential to complete the verification process.",
        "example": {
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://purl.imsglobal.org/spec/ob/v3p0/context.json"
          ],
          "type": [
            "OpenBadgeCredential"
          ],
          "credentialSubject": {
            "achievement": {
              "id": "urn:uuid:ac254bd5-8fad-4bb1-9d29-efd938536926"
            }
          }
        }
      }
    }
  ]
}
```
