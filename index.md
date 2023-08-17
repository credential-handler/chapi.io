---
layout: subpage
title: "CHAPI is the Credential Handler API"
permalink: /index.html
showHero: true
---

The CHAPI protocol allows your digital wallet to receive Verifiable Credentials from an independent third-party issuer - or present Verifiable Credentials to an independent third-party verifier - in a way that establishes trust and preserves privacy.
## CHAPI is for open for _everyone_
CHAPI is an open protocol designed to solve the "NASCAR Problem" - too often, users are presented with a fixed set of options for authentication with third-party sites.  The CHAPI protocol provides mediation between any CHAPI-enabled web application and a third-party site.  Just register your web app with your browser, and off you go!

Both [CHAPI](https://w3c-ccg.github.io/credential-handler-api/) and [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/) are results of open collaboration through World Wide Web Consortium (W3C).  You can find more information and join the discussion at the [W3C Credentials Community Group](https://www.w3.org/community/credentials/).

## How does CHAPI work?
A _Credential Handler_ is an event handler for credential request and storage events.  Web app developers can use CHAPI to provide their users with Credential Handlers that run in the browser.  These Credential Handlers can respond when users visit other websites that present, request, or store Verifiable Credentials.

![CHAPI Polyfill Image](/images/VeresCHAPIaccept.png)
## How do I build CHAPI into my website or application?
Examples and developer docs:

<p class="button-row">
    <a href="developers/issuers" class="btn2">for VC Issuers</a>
    <a href="developers/wallets" class="btn2">for Digital Wallets</a>
    <a href="developers/verifiers" class="btn2">for VC Verifiers </a>
</p>

## How do I integrate my application into the CHAPI Playground?
Interested in making your Verifier/Issuer/Wallet available for experimentation?  See the Integration Guide and FAQ for the CHAPI Playground.

<p class="button-row">
    <a href="developers/playgroundfaq" class="btn2">CHAPI Playground FAQ</a>
</p>

Read more about the [open standards that power CHAPI](/standards).

## Contributing
Contributions are welcome and encouraged!  Please follow [best practices for contributing to open-source code on GitHub](https://docs.github.com/en/get-started/exploring-projects-on-github/finding-ways-to-contribute-to-open-source-on-github).

## License
This site content is open-source; content in this Repository is licensed by contributors under the [BSD 3-Clause](license)
