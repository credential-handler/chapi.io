---
layout: subpage
title: "Web Standards related to the Credential Handler API"
permalink: /standards/
---
# CHAPI Related Web Standards
The Credential Handler API (CHAPI) was originally described in a draft report for the [W3C Credentials Community Group](https://www.w3.org/community/credentials/). It is being developed now as a ready-to-use API, libraries, and as integration documentation. This work supports the W3G CCG's mission to explore the technologies and use cases involving [Verifiable Credentials](https://www.w3.org/TR/vc-data-model-2.0/#dfn-verifiable-credential).

## Verifiable Credentials
A [Verifiable Credential](https://www.w3.org/TR/vc-data-model-2.0/#dfn-verifiable-credential) is a set of digital _claims_ stated by an _issuer_ about a _subject_.  The [Verifiable Credentials Data Model](https://www.w3.org/TR/vc-data-model/) recommends a standard digital format for Verifiable Credentials on the Web - so that digital credentials can be easily issued, presented, and verified by anyone - while preserving the privacy of the parties involved.

A wide variety of [Verifiable Credentials Use Cases](https://www.w3.org/TR/vc-use-cases/) are emerging, as users and organizations move more of their everyday activities online.

> From educational records to payment account access, the next generation of web applications will authorize entities to perform actions based on rich sets of credentials issued by trusted parties. Human- and machine-mediated decisions about job applications, account access, collaboration, and professional development will depend on filtering and analyzing growing amounts of data. It is essential that data be verifiable.
>
> Standardization of digital claim technologies makes it possible for many stakeholders to issue, earn, and trust these essential records about their counterparties, without being locked into proprietary platforms.
>
> <cite>from <a href="https://www.w3.org/TR/vc-use-cases/#importance-of-this-work">Verifiable Credentials Use Cases</a></cite>

## Establishing Trusted Communication
The diversity of Verifiable Credentials applications means that users will be presented with Verifiable Credentials from many different issuers.  Users may be asked to present Verifiable Credentials by any third-party website.

How can we empower users to safely make these transactions?  CHAPI defines a method for users to designate trusted Web applications as _handlers_ for credential requests and credential storage.  When the user visits a website that asks to present or requests Verifiable Credentials, the user is informed and consents to the transaction, and the designated _handler_ responds to the request.

CHAPI can be implemented now by any third-party Web application - so users are not limited in their choices for software services that work with Verifiable Credentials.

## Get Involved
The [Credentials Community Group](https://www.w3.org/community/credentials/) is a free and open forum for Web developers and stakeholders to connect and develop input for the next generation of Web standards.  Checkout the latest meeting notes or join the discussion at [the community group's site](https://www.w3.org/community/credentials/).
