---
layout: subpage
title: "Developer Docs for Native Wallet Applications"
permalink: /developers/wallets/native/
---

[Back to Wallet Documentation](../)

# Native Wallets

* [Wallet Registration](#wallet-registration)
* [Verifiable Credential Storage](#verifiable-credential-storage)

## Resources

* [Working with `QueryByExample` format requests](../querybyexample)
- **Example Code**: the [chapi-demo-wallet](https://github.com/credential-handler/chapi-demo-wallet) contains a full example implementation and is referenced throughout this guide.
- **Polyfill Library**: The [credential-handler-polyfill](https://github.com/credential-handler/credential-handler-polyfill) library provides the needed functionality in the browser.
- **Helper Library**: The [web-credential-handler](https://github.com/credential-handler/web-credential-handler) library provides helper functions for CHAPI integration in your code.


## Wallet Registration

Wallets need to be registered with the browser as a Credential Handler in order to store or retrieve Verifiable Credentials (VCs) on the Web.

To enable a native mobile wallet to receive VCs via CHAPI, your application will need to be configured to receive deep links from the mobile OS.

Deep links, also known as app links, cause a user's Web browser to open a native application and pass any URL to it when particular links are followed. This enables the user's Web browser to open a native mobile wallet from the CHAPI wallet selection menu and pass the CHAPI request to it. See appropriate deep link documentation for [Android](https://developer.android.com/training/app-links/deep-linking) or [iOS](https://developer.apple.com/documentation/xcode/allowing-apps-and-websites-to-link-to-your-content?language=objc).

Consequently, you will be required by the mobile OS to host the appropriate operating system specific files on a Web server.

In addition, to enable CHAPI registration, your Web server will also need to host a `manifest.json` file as well as a registration page that allows the user to register your wallet with CHAPI within their mobile Web browser.

### 1. Add a `credential_handler` to the server's `manifest.json`

In order to register as a Credential Handler, your registration page's server must serve a `manifest.json` file from its root path (`/manifest.json`). This endpoint must also be CORS-enabled. Add the following `credential_handler` object with the appropriate `acceptedProtocols` your wallet can handle:

```json
{
  "credential_handler": {
    "url": "/switchboard",
    "enabledTypes": ["VerifiablePresentation"],
    "acceptedInput": "url",
    "acceptedProtocols": [
      "OID4VCI",
      "OID4VP",
      "vcapi"
    ]
  }
}
```

The `url` property must be the entry point for your mobile wallet so it must be a deep link that will open the application. Details about the event that initiates the opening of this URL will be relayed via query parameters appended to it.

The `"acceptedInput": "url"` line tells CHAPI that the wallet should receive data via opening the URL and providing query parameters rather than browser sent events typically used with Web wallets.

### 2. Allow your users to register their wallet as a Credential Handler with the browser polyfill

Next, we need to have the user trigger the registration of your wallet as a Credential Handler within their browser. This must be initiated by user interaction, so you cannot automatically register without the user clicking a button.

Add something similar to your registration page:

```html
<button id="installHandlerButton">Register Wallet</button>

<script src="https://unpkg.com/credential-handler-polyfill@3/dist/credential-handler-polyfill.min.js"></script>
<script src="https://unpkg.com/web-credential-handler@2/dist/web-credential-handler.min.js"></script>

<script>
  document.getElementById('installHandlerButton').addEventListener('click', async function() {
    try {
      await credentialHandlerPolyfill.loadOnce();
      await WebCredentialHandler.installHandler();
      console.log('Handler Installed Successfully!');
    } catch (error) {
      console.error('Error installing handler: ' + error.message);
    }
  });
</script>
```

### 3. Link users to the registration page from your application

Your mobile application should include a link to your registration page. That link should open the device's default browser and allow them to register the wallet as a Credential Handler.

Once done, your Wallet should now be enabled to handle various credential related requests from across the Web.

## Verifiable Credential Storage

Now that your native wallet has been registered with CHAPI, it can receive requests to store credentials at the URL stated in the `credential_handler.url` of the `manifest.json` above.

The endpoint declared there (`/switchboard` in the example above) will receive a `request` query parameter that will include a URL encoded object with the following properties:

- `credentialRequestOrigin`: This will tell the wallet where the request originated
- `protocols`: This will include any available credential exchange protocols (for issuance and/or presentation). The wallet may retrieve the credential for storage from any of the available protocols.

Here is an example URL showing the `request` query parameter and its URL encoded value:

<pre><code style="white-space: normal;overflow: auto;word-break: break-word;">
https://wallet.example.com/switchboard?request=%7B%22credentialRequestOrigin%22%3A%22https%3A%2F%2Fplayground.chapi.io%22%2C%22protocols%22%3A%7B%22OID4VCI%22%3A%22openid-credential-offer%3A%2F%2F%3Fcredential_offer%3D%257B%2522credential_issuer%2522%253A%2522https%253A%252F%252Fexample.exchanger.com%252Fexchangers%252Fz1A1GqykGBWKbwhFCDqFjMfnG%252Fexchanges%252Fz1A36rr6wEL25EEiikKvisVEC%2522%252C%2522credentials%2522%253A%255B%257B%2522format%2522%253A%2522ldp_vc%2522%252C%2522credential_definition%2522%253A%257B%2522%2540context%2522%253A%255B%2522https%253A%252F%252Fwww.w3.org%252F2018%252Fcredentials%252Fv1%2522%252C%2522https%253A%252F%252Fpurl.imsglobal.org%252Fspec%252Fob%252Fv3p0%252Fcontext.json%2522%255D%252C%2522type%2522%253A%255B%2522VerifiableCredential%2522%252C%2522OpenBadgeCredential%2522%255D%257D%257D%255D%252C%2522grants%2522%253A%257B%2522urn%253Aietf%253Aparams%253Aoauth%253Agrant-type%253Apre-authorized_code%2522%253A%257B%2522pre-authorized_code%2522%253A%25220065a8a0-069b-46f1-a857-4e1ce5047afd%2522%257D%257D%257D%22%2C%22vcapi%22%3A%22https%3A%2F%2Fexchanger.example.com%2Fexchangers%2Fz1A1GqykGBWKbwhFCDqFjMfnG%2Fexchanges%2Fz19mxa763DAKX7diL51kBFecZ%22%7D%7D
</code></pre>

The `request` value is URL encoded. Its contents look like this when unencoded:

```json
{
  "credentialRequestOrigin": "https://playground.chapi.io",
  "protocols": {
    "vcapi": "https://exchanger.example.com/exchangers/z1A1GqykGBWKbwhFCDqFjMfnG/exchanges/z19mxa763DAKX7diL51kBFecZ",
    "OID4VCI": "openid-credential-offer://?credential_offer=%7B%22credential_issuer%22%3A%22https%3A%2F%2Fexample.exchanger.com%2Fexchangers%2Fz1A1GqykGBWKbwhFCDqFjMfnG%2Fexchanges%2Fz1A36rr6wEL25EEiikKvisVEC%22%2C%22credentials%22%3A%5B%7B%22format%22%3A%22ldp_vc%22%2C%22credential_definition%22%3A%7B%22%40context%22%3A%5B%22https%3A%2F%2Fwww.w3.org%2F2018%2Fcredentials%2Fv1%22%2C%22https%3A%2F%2Fpurl.imsglobal.org%2Fspec%2Fob%2Fv3p0%2Fcontext.json%22%5D%2C%22type%22%3A%5B%22VerifiableCredential%22%2C%22OpenBadgeCredential%22%5D%7D%7D%5D%2C%22grants%22%3A%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%220065a8a0-069b-46f1-a857-4e1ce5047afd%22%7D%7D%7D"
  }
}
```

There are currently two possible protocols that Issuers may use with CHAPI in order to issue Verifiable Credentials to be stored in the user's digital wallet: `vcapi` and `OID4VCI`.

Depending on what you declared in your `acceptedProtocols` you may receive either or both as properties in the `protocols` object carried in the `request` query parameter. It is up to wallet providers to decide (or they may delegate this to advanced users) which protocol to use if multiple protocols are supported.

### VC-API

The `vcapi` property will be a URL that will tell the wallet where to go to retrieve the credential. The wallet can send a `POST` request to this URL with an empty JSON object (`{}`) to attempt to download the VC to be stored. The VC will be found in the `verifiablePresentation` object of the response to that `POST` request. If there are further steps required in the flow such as DID Auth a `verifiablePresentationRequest` object will describe the details.

See the [VC API Specification](https://w3c-ccg.github.io/vc-api/) for more details on this protocol.

Example VCAPI protocol URL:
`https://exchanger.example.com/exchangers/z1A1GqykGBWKbwhFCDqFjMfnG/exchanges/z19mxa763DAKX7diL51kBFecZ`

### OID4VCI

The `OID4VCI` property will be a URL that includes all of the required information to complete the issuance of the Verifiable Credential using the OID4VCI protocol.

Example OID4VCI protocol URL:
`openid-credential-offer://?credential_offer=%7B%22credential_issuer%22%3A%22https%3A%2F%2Fqa.veresexchanger.dev%2Fexchangers%2Fz1A1GqykGBWKbwhFCDqFjMfnG%2Fexchanges%2Fz1A36rr6wEL25EEiikKvisVEC%22%2C%22credentials%22%3A%5B%7B%22format%22%3A%22ldp_vc%22%2C%22credential_definition%22%3A%7B%22%40context%22%3A%5B%22https%3A%2F%2Fwww.w3.org%2F2018%2Fcredentials%2Fv1%22%2C%22https%3A%2F%2Fpurl.imsglobal.org%2Fspec%2Fob%2Fv3p0%2Fcontext.json%22%5D%2C%22type%22%3A%5B%22VerifiableCredential%22%2C%22OpenBadgeCredential%22%5D%7D%7D%5D%2C%22grants%22%3A%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%220065a8a0-069b-46f1-a857-4e1ce5047afd%22%7D%7D%7D`

The `credential_offer` query parameter will be URL decoded resulting in a JSON
object containing the following details:

```json
{
  "credential_issuer": "https://qa.veresexchanger.dev/exchangers/z1A1GqykGBWKbwhFCDqFjMfnG/exchanges/z1A36rr6wEL25EEiikKvisVEC",
  "credentials": [
    {
      "format": "ldp_vc",
      "credential_definition": {
        "@context": ["https://www.w3.org/2018/credentials/v1", "https://purl.imsglobal.org/spec/ob/v3p0/context.json"],
        "type": ["VerifiableCredential","OpenBadgeCredential"]
      }
    }
  ],
  "grants": {
    "urn:ietf:params:oauth:grant-type:pre-authorized_code": {
      "pre-authorized_code": "0065a8a0-069b-46f1-a857-4e1ce5047afd"
    }
  }
}
```

See the [OID4VCI Specification](https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html) for more details on this protocol.
