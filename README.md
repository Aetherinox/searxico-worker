<div align="center">
<h6>Self-hosted Favicon Grabber for SearXNG</h6>
<h2>☁️ Searxico - Favicon Grabber Service ☁️</h1>

<br />

<p>

A self-hosted Cloudflare worker for SearXNG which allows you to run your own favicon grabber service.

</p>

<br />

<img src="https://raw.githubusercontent.com/Aetherinox/traefik-api-token-middleware/refs/heads/main/.assets/plugin_traefik_apikey_middleware.png" height="230">

<br />
<br />

</div>

<div align="center">

<!-- prettier-ignore-start -->
[![Version][github-version-img]][github-version-uri]
[![Downloads][github-downloads-img]][github-downloads-uri]
[![Build Status][github-build-img]][github-build-uri]
[![Size][github-size-img]][github-size-img]
[![Last Commit][github-commit-img]][github-commit-img]
[![Contributors][contribs-all-img]](#contributors-)

[![Built with Material for MkDocs](https://img.shields.io/badge/Powered_by_Material_for_MkDocs-526CFE?style=for-the-badge&logo=MaterialForMkDocs&logoColor=white)](https://aetherinox.github.io/traefik-api-token-middleware/)
<!-- prettier-ignore-end -->

</div>

<br />

---

<br />

- [About](#about)
  - [Usage](#usage)
- [How It Works](#how-it-works)
  - [Self-hosted CDN Repository](#self-hosted-cdn-repository)
  - [Localized Override Table (URLs)](#localized-override-table-urls)
  - [Localized Override Table (SVG Path)](#localized-override-table-svg-path)
  - [API Service](#api-service)
  - [Domain Code Scan](#domain-code-scan)
  - [Default Logo](#default-logo)
- [Cloudflare Limits](#cloudflare-limits)
- [Contributors ✨](#contributors-)

<br />

---

<br />

## About
With the introduction of favicons into the SearXNG self-hosted search engine, this repository allows you to run your own favicon grabber service that can be used in combination with existing favicon services, or as its own stand-alone worker.

<br />

### Usage
You can search a website for a favicon using the officially hosted worker, or by hosting your own:
- https://searxico.aetherinox.workers.dev/get/google.com/64

<br />

| Parameter | Description | Status |
| --- | --- | --- |
| `DOMAIN` | Website to grab favicon for<br><sub>Does not need `http`, `https` or `www`</sub> | Required |
| `ICON_SIZE` | Size of the icon to return | Optional<br><sub>Default: `32`</sub> |

<br />

This worker includes the following features:
- Favicon override using a Github repository
- Favicon override using locally provided image URL table
- Favicon override using locally provided SVG path
- Works with Google, Yandex, Duckduckgo, FaviconKit, Allesedv
- Site code scanning for favicon tags, both `link` and `svg`
- CORS Security Headers
- Ability to set API rate limits <sup> _`(disabled by default)`_ </sup>
  - Daily limits OR limit per X milliseconds
- Aggressive throttling mode <sup> _`(disabled by default)`_ </sup>
  - Adds an incremental punishment onto the client's cooldown each time they attempt to grab a favicon when their original cooldown period has not yet expired.
- Blacklist of IPs

<br />

---

<br />

## How It Works
This worker contains a wide variety of methods that the worker tries to use in order to obtain a favicon from a website. These methods are listed below, and in the order of priority that they are ran in the worker:

<br />

### Self-hosted CDN Repository
`Priority: 1`

When you request a favicon using this self-hosted worker, it will first check to see if the specified domain has an icon hosted on our [Searxico Favicon CDN Repository](https://github.com/Aetherinox/searxico-cdn). This is a repository that you can host on your own Github account. If you decide to upload your own icon for Google, or Microsoft and place it within the repository, any time you request the Google or Microsoft favicon, it will first scan your own CDN repository and use that icon before it will go fetch the actual icon from their website.

This allows you to override any favicons for any websites.

If you want to see an example of how a Cloudflare hosted repository should be set up, see our Searxico CDN example repository:
- https://github.com/Aetherinox/searxico-cdn

<br />

### Localized Override Table (URLs)
`Priority: 2`

If an icon for a domain is not found within the Self-hosted CDN Repository listed above, it will then check the local worker `index.js` for an override table:

```js
const iconsOverrideIco = {
    's/searxng.org': `https://raw.githubusercontent.com/searxng/searxng/master/searx/static/themes/simple/img/favicon.png`
};
```

<br />

The override table shown above is a table available within the Cloudflare worker `index.js` source code which allows you to force a domain to use a specific favicon. To add a new domain to the list, maintain the format shown above. The entry name should be the first letter of the domain, followed by a forward slash `/` and then the domain.extension. Then for the value, you will provide a direct URL to the favicon you wish for the domain to use.

<br />

### Localized Override Table (SVG Path)
`Priority: 3`

The next source that is prioritized when you search for a favicon is the localized override table with SVG paths. This is similar to the previous method above [Localized Override Table (URLs)](#localized-override-table-urls), except this table uses SVG paths, and can be found inside your Cloudflare worker `index.js` source code file.

```js
const iconsOverrideSvg = {
    's/searxng.org': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="#1F85DE" width="32px" height="32px"><path class="fa-primary" d=""></path><path class="fa-secondary" d="M0 256a160 160 0 1 1 320 0A160 160 0 1 1 0 256z"></path></svg>`
};
```

<br />

To add your own entry, the key must be the first letter of the website domain you are searching for, followed by a forward slash `/`, and then the domain.extension for the domain. The value must be a full SVG path containing the icon you wish to use.

<br />

### API Service
`Priority: 4`

If a favicon cannot be found using any of the methods listed above, the next step which has priority is for the favicon grabber to use an external API such as:
- Google
- Yandex
- Duckduckgo
- FaviconKit
- Allesedv

<br />

The service **unavatar** is also available, however, this API service seems to have a rate limit, so it is not enabled by default.

<br />

### Domain Code Scan
`Priority: 5`

The next step that the favicon grabber uses is a physical search of the domain you are requesting the favicon for. The Cloudflare worker will scan through the HTML code of the domain, and check for specific tags within the HTML code, including `link[rel*="icon"]`, `mask-icon`, etc. An example of HTML being searched for is shown below:

```
<link rel="shortcut icon" href="https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico?v=ec617d715196">
```

<br />

The worker will also search for any `<svg>` icons that may appear in the HTML code to try and figure out if those icons are a logo for the website being searched.

<br />

### Default Logo
`Priority: 6`

If all of the above attempts fail to retrieve a favicon for a website, the favicon worker will then return a default icon to display. The default SVG icon is defined within the worker `index.js` as the following code:

```js
const favicoDefaultSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#1F85DE" width="32px" height="32px">
    <path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"></path>
</svg>`;
```

<br />

It should be worth noting that a test was conducted with over 1,000 domains. Out of all of the domains we tried, the default icon was only ever shown twice. It is highly unlikely for this step to be utilized as there should always be a favicon found somewhere. But we can't say never.

<br />

---

<br />

## Cloudflare Limits
For users who have a **Free** Cloudflare account, be aware that Cloudflare does place limits on how much traffic your worker can have. The limits are generous and if you are using this Cloudflare worker for your own personal site, you should not be surpassing them.

<br />

| Feature | Limit |
| --- | --- |
| Request | 100,000 requests/day<br />1000 requests/min |
| Memory | 128MB |
| CPU Time | 10ms |

<br />

You can check your request limit by signing into Cloudflare, and on the left-side menu, clicking **Worker & Pages** -> **Overview**.

<br />

<p align="center"><img style="width: 50%;text-align: center;" src="https://raw.githubusercontent.com/Aetherinox/searxico-worker/refs/heads/main/docs/img/cloudflare/1.png"></p>

<br />

Select your worker from the **Override** page.

<br />

<p align="center"><img style="width: 50%;text-align: center;" src="https://raw.githubusercontent.com/Aetherinox/searxico-worker/refs/heads/main/docs/img/cloudflare/1.png"></p>

<br />

You should get a very detailed graph and hard numbers showing what your usage is for the day. You can also modify the search criteria to see how the usage has been for the month.

<br />

<p align="center"><img style="width: 50%;text-align: center;" src="https://raw.githubusercontent.com/Aetherinox/searxico-worker/refs/heads/main/docs/img/cloudflare/3.png"></p>

<br />

---

<br />

## Contributors ✨
We are always looking for contributors. If you feel that you can provide something useful to Gistr, then we'd love to review your suggestion. Before submitting your contribution, please review the following resources:

- [Pull Request Procedure](.github/PULL_REQUEST_TEMPLATE.md)
- [Contributor Policy](CONTRIBUTING.md)

<br />

Want to help but can't write code?
- Review [active questions by our community](https://github.com/Aetherinox/searxico-worker/labels/help%20wanted) and answer the ones you know.

<br />

The following people have helped get this project going:

<br />

<div align="center">

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![Contributors][contribs-all-img]](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top"><a href="https://gitlab.com/Aetherinox"><img src="https://avatars.githubusercontent.com/u/118329232?v=4?s=40" width="80px;" alt="Aetherinox"/><br /><sub><b>Aetherinox</b></sub></a><br /><a href="https://github.com/Aetherinox/searxico-worker/commits?author=Aetherinox" title="Code">💻</a> <a href="#projectManagement-Aetherinox" title="Project Management">📆</a> <a href="#fundingFinding-Aetherinox" title="Funding Finding">🔍</a></td>
    </tr>
  </tbody>
</table>
</div>
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

<br />
<br />

<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- BADGE > GENERAL -->
  [general-npmjs-uri]: https://npmjs.com
  [general-nodejs-uri]: https://nodejs.org
  [general-npmtrends-uri]: http://npmtrends.com/searxico-worker

<!-- BADGE > VERSION > GITHUB -->
  [github-version-img]: https://img.shields.io/github/v/tag/Aetherinox/searxico-worker?logo=GitHub&label=Version&color=ba5225
  [github-version-uri]: https://github.com/Aetherinox/searxico-worker/releases

<!-- BADGE > VERSION > NPMJS -->
  [npm-version-img]: https://img.shields.io/npm/v/searxico-worker?logo=npm&label=Version&color=ba5225
  [npm-version-uri]: https://npmjs.com/package/searxico-worker

<!-- BADGE > VERSION > PYPI -->
  [pypi-version-img]: https://img.shields.io/pypi/v/searxico-worker-plugin
  [pypi-version-uri]: https://pypi.org/project/searxico-worker-plugin/

<!-- BADGE > LICENSE > MIT -->
  [license-mit-img]: https://img.shields.io/badge/MIT-FFF?logo=creativecommons&logoColor=FFFFFF&label=License&color=9d29a0
  [license-mit-uri]: https://github.com/Aetherinox/searxico-worker/blob/main/LICENSE

<!-- BADGE > GITHUB > DOWNLOAD COUNT -->
  [github-downloads-img]: https://img.shields.io/github/downloads/Aetherinox/searxico-worker/total?logo=github&logoColor=FFFFFF&label=Downloads&color=376892
  [github-downloads-uri]: https://github.com/Aetherinox/searxico-worker/releases

<!-- BADGE > NPMJS > DOWNLOAD COUNT -->
  [npmjs-downloads-img]: https://img.shields.io/npm/dw/%40aetherinox%2Fsearxico-worker?logo=npm&&label=Downloads&color=376892
  [npmjs-downloads-uri]: https://npmjs.com/package/searxico-worker

<!-- BADGE > GITHUB > DOWNLOAD SIZE -->
  [github-size-img]: https://img.shields.io/github/repo-size/Aetherinox/searxico-worker?logo=github&label=Size&color=59702a
  [github-size-uri]: https://github.com/Aetherinox/searxico-worker/releases

<!-- BADGE > NPMJS > DOWNLOAD SIZE -->
  [npmjs-size-img]: https://img.shields.io/npm/unpacked-size/searxico-worker/latest?logo=npm&label=Size&color=59702a
  [npmjs-size-uri]: https://npmjs.com/package/searxico-worker

<!-- BADGE > CODECOV > COVERAGE -->
  [codecov-coverage-img]: https://img.shields.io/codecov/c/github/Aetherinox/searxico-worker?token=MPAVASGIOG&logo=codecov&logoColor=FFFFFF&label=Coverage&color=354b9e
  [codecov-coverage-uri]: https://codecov.io/github/Aetherinox/searxico-worker

<!-- BADGE > ALL CONTRIBUTORS -->
  [contribs-all-img]: https://img.shields.io/github/all-contributors/Aetherinox/searxico-worker?logo=contributorcovenant&color=de1f6f&label=contributors
  [contribs-all-uri]: https://github.com/all-contributors/all-contributors

<!-- BADGE > GITHUB > BUILD > NPM -->
  [github-build-img]: https://img.shields.io/github/actions/workflow/status/Aetherinox/searxico-worker/release.yml?logo=github&logoColor=FFFFFF&label=Build&color=%23278b30
  [github-build-uri]: https://github.com/Aetherinox/searxico-worker/actions/workflows/release.yml

<!-- BADGE > GITHUB > BUILD > Pypi -->
  [github-build-pypi-img]: https://img.shields.io/github/actions/workflow/status/Aetherinox/searxico-worker/release-pypi.yml?logo=github&logoColor=FFFFFF&label=Build&color=%23278b30
  [github-build-pypi-uri]: https://github.com/Aetherinox/searxico-worker/actions/workflows/pypi-release.yml

<!-- BADGE > GITHUB > TESTS -->
  [github-tests-img]: https://img.shields.io/github/actions/workflow/status/Aetherinox/searxico-worker/tests.yml?logo=github&label=Tests&color=2c6488
  [github-tests-uri]: https://github.com/Aetherinox/searxico-worker/actions/workflows/tests.yml

<!-- BADGE > GITHUB > COMMIT -->
  [github-commit-img]: https://img.shields.io/github/last-commit/Aetherinox/searxico-worker?logo=conventionalcommits&logoColor=FFFFFF&label=Last%20Commit&color=313131
  [github-commit-uri]: https://github.com/Aetherinox/searxico-worker/commits/main/

<!-- prettier-ignore-end -->
<!-- markdownlint-restore -->
