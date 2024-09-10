---
layout: subpage
title: "Handling a VC API Exchange in a Web Wallet"
permalink: /developers/wallets/exchanges/
---

## {{ title }}

> A VC API workflow defines a particular set of steps for exchanging verifiable
> credentials between two parties across a trust boundary. Each step can involve
> the issuance, verification, transmission, or presentation of verifiable
> credentials.

A Web Wallet may receive an Exchange URL through CHAPI, reading a QR code, or
via some other user initiated transmission.

Once that URL is received, the Wallet can initiate the exchange (acting as the
_exchange client_) by sending a POST request to that URL.

Exchange URL:
```
https://vcapi.example.com/exchanges/12345
```

To initiate an exchange using VC API, an exchange client performs an HTTP POST
sending a JSON object as the request body. In the simplest case, when the client
has no constraints of its own on the exchange — i.e., it has nothing to request
from the other party — the JSON object is empty ({})--as seen below:

```http
POST /exchanges/12345
Host: vcapi.example.com

{}
```

The workflow service then responds with its own JSON object in the response
body:

```json
{}
```

If the response object is empty (as above), the exchange is complete and nothing
is requested from nor offered to the exchange client.

If, however, the object includes `verifiablePresentationRequest`, then the
exchange is not yet complete and some *additional information is requested*, as
specified by the contents of the associated verifiable presentation request.

For example:
```json
{
  "verifiablePresentationRequest": {
    "query": [{
      "type": "QueryByExample",
      "credentialQuery": [{
        "reason": "Please present proof of citizenship.",
        "example": {
          "@context": [
            "https://www.w3.org/ns/credentials/v2",
            "https://w3id.org/citizenship/v1"
          ],
          "type": "PermanentResidentCard"
        }
      }]
    }]
  }
}
```

If the object includes `verifiablePresentation`, then some *information is
offered*, such as verifiable credentials issued to the holder operating the
exchange client (i.e. the Wallet) or verifiable credentials with information
about the exchange server's operator based on the exchange client's request.

For example:
```json
{
  "verifiablePresentation": {
    "@context": [
      "https://www.w3.org/ns/credentials/v2"
    ],
    "type": ["VerifiablePresentation"],
    "verifiableCredential": [{
      "@context": [
        "https://www.w3.org/ns/credentials/v2",
        "https://w3id.org/citizenship/v1"
      ],
      "type": ["VerifiableCredential", "PermanentResidentCard"],
      // additional properties...
    }]
  }
}
```

If the object includes `redirectUrl`, the *exchange is complete* and the
workflow service recommends that the client proceed to another place to continue
the interaction in another form.

For example:
```json
{
  "redirectUrl": "https://vcapi.example.com/go-here-next"
}
```

Many Verifiable Credential use cases can be implemented using these basic
primitives. Either party to an exchange is capable of requesting Verifiable
Presentations and of providing one or more Verifiable Credentials that might be
necessary to establish trust and/or gain authorization capabilities, and either
party is capable of presenting credentials that they hold or that they have
issued. Specific workflows can be configured to expect specific presentations
and credentials and to reject deviations from the expected flow of information.

When a workflow service determines that a particular message is not acceptable,
it raises an error by responding with a `4xx` HTTP status message and a JSON
object that expresses information about the error.

Below is an example of a typical exchange:

```mermaid
sequenceDiagram
    participant H as Holder
    participant W as Holder Coordinator (Wallet)
    participant I as Issuer/Verifier Coordinator
    autonumber
    Note right of H: Start exchange
    W->>I: Initiate
    Note right of W: POST /workflows/123/exchanges/123 &mdash; HTTP request to start exchange (e.g., send credentials, get credentials)
    I->>W: Verifiable Presentation Request (VPR)
    Note left of I: VPR includes method of interaction, for purposes of exchange
    W->>I: Verifiable Presentation (VP)
    Note right of W: POST /workflows/123/exchanges/abc &mdash; sent via interaction mechanism to meet requirements of exchange
    I->>W: Verifiable Presentation
    Note left of I: VP includes result of exchange (e.g., VCs), or VPR with new interaction request, or error description
```

The exchange client (Wallet) code for a flow like the above may look similar to
the following:

```js
const receivedExchangeUrl = 'https://vcapi.example.com/workflows/123/exchanges/123';

const response = await fetch(receivedExchangeUrl, {
  method: 'POST'
  body: JSON.stringify({})
});
const body = response.json();

function checkResponse(body) {
  if('verifiablePresentationRequest' in body) {
    // use the information in the Verifiable Presentation Request to find a
    // credentail that fullfills the request, then send a Verifiable
    // Presentation as the response to the interaction endpoint included in the
    // Verifiable Presentation Request
    const presentation = findCredentialAndCreatePresentation();
    // TODO: properly extract interaction URL
    const interactionUrl = body.interact.service[0].serviceEndpoint;
    const response = await fetch(interactionUrl, {
      method: 'POST',
      body: JSON.stringify(presentation)
    });
    checkResponse(response.json());
  }
  // TODO: should these be exclusive?
  if('verifiablePresentation' in body) {
    // the Wallet has received a Verifiable Presentation containing one or more
    // Verifiable Credentials--validate and verify them per your use case
  }
  if('redirectUrl' in body) {
    // TODO: take the user to the new location OR does the exchange "move"?
  }
}