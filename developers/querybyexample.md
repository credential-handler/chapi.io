---
layout: subpage
title: "Developer Docs for CHAPI Wallet QueryByExample"
permalink: /developers/querybyexample
---
# {{ page.title }}

Prerequisite: This document assumes completion of the
[CHAPI integration for Digital Wallets integration instructions](wallets).

Responding to requests for credentials from a verifier is a critical step in building out a complete wallet. There are multiple credential query formats, but today we're focusing on Verifiable Presentation Request's `QueryByExample` format.

When integrating with the CHAPI Playground, the JSON sent to the Wallet is in the form of a Verifiable Presentation (VP) Request with one or more QueryByExamples. A QueryByExample contains a property named `credentialQuery.example` which contains the set of properties that the Verifiable Credential (VC) must match. The `@context` and `type` properties of a VC will always be present. Additional properties may be requested for more fine grained querying.

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

## VP Request for JFF x vc-edu PF2 VC
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
          ]
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

## VP Request for Alumni & JFF x vc-edu PF2 & Permanent Resident VC
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
          ]
        }
      }
    }
  ]
}
```
