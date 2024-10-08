---
layout: subpage
title: "Handling a VC API Exchange in a Web Wallet"
permalink: /developers/wallets/exchanges/
---

## {{ title }}

<figure>

> A VC API workflow defines a particular set of steps for exchanging verifiable
> credentials between two parties across a trust boundary. Each step can involve
> the issuance, verification, transmission, or presentation of verifiable
> credentials.
<figcaption>
  <cite>from <a href="https://w3c-ccg.github.io/vc-api/#workflows-and-exchanges">VC API Workflows & Exchanges</a></cite>
</figcaption>
</figure>

A VC API workflow interaction begins with _either_ a CHAPI event or an
interaction URL via a QR code (or similar user initiated transfer experience).

The CHAPI event will provide a complete protocols object similar to the
following:
```json
{
  "protocols": {
    "vcapi": "https://vcapi.example.com/workflows/abc/exchanges/123",
    "OID4VCI": "openid-credential-offer://?..."
  }
}
```
Alternatively, a QR code can be used to provide a URL which when dereferenced
will result in either a `protocols` (object as above) or an HTML fallback page
to allow the user to continue otherwise.

To retrieve a `protocols` object from an _interaction URL_, the Wallet must send
an HTTP GET request including an explicit `Accept: application/json` request
header--which results in the same JSON object as above:

```http
GET /workflows/abc/exchanges/123/protocols
Host: vcapi.example.com
Accept: application/json

{
  "protocols": {
    "vcapi": "https://vcapi.example.com/workflows/abc/exchanges/123",
    "OID4VCI": "openid-credential-offer://?..."
  }
}
```

Once a VC API exchange URL is acquisitioned from `protocols.vcapi`, a POST
request is sent with a configuration object (which may be empty) to begin the
exchange:

```http
POST /workflows/abc/exchanges/123
Host: vcapi.example.com

{}
```

A response will be returned by the exchanger...

If the response object is empty (as above), the exchange is complete and nothing
is requested from nor offered to the exchange client.

If, however, the object includes `verifiablePresentationRequest`, then the
exchange is not yet complete and some *additional information is requested*, as
specified by the contents of the associated verifiable presentation request.

> Read more about possible values in the
> [Verifiable Presentation Requests](https://w3c-ccg.github.io/vp-request-spec/#overview)
> specification.

For example:
```json
{
  "verifiablePresentationRequest": {
    "query": [{
      "type": "QueryByExample",
      "credentialQuery": [{
        "reason": "We require proof of residency to onboard you.",
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
workflow service recommends that the client sent the user to another place to
continue the interaction.

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
    Note right of W: POST /workflows/abc/exchanges/123 &mdash; HTTP request to start exchange (e.g., send credentials, get credentials)
    I->>W: Verifiable Presentation Request (VPR)
    Note left of I: VPR includes method of interaction, for purposes of exchange
    W->>I: Verifiable Presentation (VP)
    Note right of W: POST /workflows/abc/exchanges/123 &mdash; sent via interaction mechanism to meet requirements of exchange
    I->>W: Verifiable Presentation
    Note left of I: VP includes result of exchange (e.g., VCs), or VPR with new interaction request, or error description
```

The exchange client (Wallet) code for a flow like the above may look similar to
the following:

```js
const receivedExchangeUrl = 'https://vcapi.example.com/workflows/abc/exchanges/123';

const response = await fetch(receivedExchangeUrl, {
  method: 'POST'
  body: JSON.stringify({})
});
const body = await response.json();

function checkResponse(body) {
  if('verifiablePresentationRequest' in body) {
    // use the information in the Verifiable Presentation Request to find a
    // credential that fulfills the request, then send a Verifiable
    // Presentation a message back to the exchange endpoint
    // Verifiable Presentation Request
    const verifiablePresentation = findCredentialAndCreatePresentation();
    const response = await fetch(receivedExchangeUrl, {
      method: 'POST',
      body: JSON.stringify({verifiablePresentation})
    });
    checkResponse(response.json());
  }
  if('verifiablePresentation' in body) {
    // the Wallet has received a Verifiable Presentation containing one or more
    // Verifiable Credentials--use them per your use case
  }
  if('redirectUrl' in body) {
    // take the user to the new location
  }
}