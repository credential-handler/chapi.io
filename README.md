The CHAPI protocol allows your digital wallet to receive Verifiable Credentials from an independent third-party issuer - or present Verifiable Credentials to an independent third-party verifier - in a way that establishes trust and preserves privacy.
## CHAPI is for open for _everyone_
CHAPI is an open protocol designed to solve the "NASCAR Problem" - too often, users are presented with a fixed set of options for authentication with third-party sites.  The CHAPI protocol provides mediation between any CHAPI-enabled web application and a third-party site.  Just register your web app with your browser, and off you go!

Both [CHAPI](https://w3c-ccg.github.io/credential-handler-api/) and [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/) are results of open collaboration through World Wide Web Consortium (W3C).  You can find more information and join the discussion at the [W3C Credentials Community Group](https://www.w3.org/community/credentials/).

## Contributing
Contributions are welcome and encouraged!  Please follow [best practices for contributing to open-source code on GitHub](https://docs.github.com/en/get-started/exploring-projects-on-github/finding-ways-to-contribute-to-open-source-on-github).

This site is built with [11ty](https://11ty.dev/) and hosted on GitHub Pages.

To build the site locally you will need Node.js and npm. If you have Node, run
the following in your local working copy directory:
```sh
$ npm i
$ npm run serve # or `build` for just file generation
```

If all worked as hoped, you can visit https://localhost:8080/ to test the site.

## License
This site content is open-source; content in this Repository is licensed by contributors under the [BSD-3-Clause](license)
