---
layout: subpage
title: "CHAPI is the Credential Handler API"
permalink: /index.html
showHero: true
---

The Credential Handler API (CHAPI) allows your digital wallet to receive [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/) from an independent third-party issuer - or present Verifiable Credentials to an independent third-party verifier - in a way that establishes trust and preserves privacy.

Too often, users are presented with a fixed set of options for authentication with third-party sites. The CHAPI protocol provides mediation between any CHAPI-enabled Web or mobile application and a third-party site.

## How does CHAPI work?
A _Credential Handler_ is an event handler for credential request and storage events.  Web app developers can use CHAPI to provide their users with Credential Handlers that run in the browser.  These Credential Handlers can respond when users visit other websites that present, request, or store Verifiable Credentials.

![Choose a wallet modal presenting all preregistered wallet systems which can be clicked on to proceed to store the credentials there.](/images/VeresCHAPIaccept.png)

## Enable Browser-based Credential Exchange
Checkout the examples and developer docs...

<p class="button-row">
    <a href="developers/issuers" class="btn2">for VC Issuers</a>
    <a href="developers/wallets" class="btn2">for Digital Wallets</a>
    <a href="developers/verifiers" class="btn2">for VC Verifiers </a>
</p>

## Join the Verifiable Credential Playground
Interested in making your Verifier/Issuer/Wallet available for experimentation?  See the Integration Guide and FAQ for the [Verifiable Credential Playground](https://vcplayground.org/).

<p class="button-row">
    <a href="developers/playgroundfaq" class="btn2">VC Playground FAQ</a>
</p>

[CHAPI](https://w3c-ccg.github.io/credential-handler-api/) and [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/) are the result of open collaboration through the World Wide Web Consortium (W3C).  You can find more information and join the discussion at the [W3C Credentials Community Group](https://www.w3.org/community/credentials/).

Read more about the [open standards that power CHAPI](/standards).
