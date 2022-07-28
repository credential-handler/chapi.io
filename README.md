The CHAPI protocol allows your digital wallet to receive Verifiable Credentails from an independent third-party issuer - or present Verifiable Credentials to an independent third-party verifier - in a way that establishes trust and preserves privacy.
## CHAPI is for open for _everyone_
CHAPI is an open protocol designed to solve the "NASCAR Problem" - too often, users are presented with a fixed set of options for authentication with third-party sites.  The CHAPI protocol provides mediation between any CHAPI-enabled wallet and web application.  Just register your wallet with your browser, and off you go!

Both [CHAPI](https://w3c-ccg.github.io/credential-handler-api/) and [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/) are results of open collaboration through World Wide Web Consortium (W3C).  You can find more information and join the discussion at the [W3C Credentials Community Group](https://www.w3.org/community/credentials/).

## How does CHAPI work?
A _Credential Handler_ is an event handler for credential request and storage events.  Web developers can use CHAPI to provide Credential Handlers that run in the browser - which can respond when users visit other websites that present, request, or store Verifiable Credentials.

![Registering a Credential Handler with the Browser](images/VeresCHAPIregistration.png)

The Credential Handler receives the event via a Service Worker or, if the Credential Handler Polyfill is used, a simple page with no UI elements is loaded that allows the user to view and respond to the event.

![User Selecting a Credential Handler to Process the Event](images/VeresCHAPIaccept.png)

The CHAPI-enabled web application can display information directly in the poyfill - to provide the desired user experience.

![Data Display within the Polyfill](images/VeresCHAPIpolyfill.png)


<p class="button-row">
    <a href="devIssuers" class="btn2">for VC Issuers</a>
    <a href="devWallets" class="btn2">for Digital Wallets</a>
    <a href="devVerifiers" class="btn2">for VC Verifiers </a>
</p>

## Contributing
Contributions are welcome and encouraged!  Please follow [best practices for contributing to open-source code on GitHub](https://docs.github.com/en/get-started/exploring-projects-on-github/finding-ways-to-contribute-to-open-source-on-github).

## License
This site content is open-source; content in this Repository is licensed by contributors under the [BSD 3-Clause](license)
