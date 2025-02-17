<div align="center">
<h6>Self-hosted Favicon Grabber for SearXNG</h6>
<h2>☁️ Searxico - Favicon Grabber Service ☁️</h1>

<br />

<p>

A self-hosted Cloudflare worker for SearXNG which allows you to run your own favicon grabber service.

</p>

<br />

<img src="https://raw.githubusercontent.com/Aetherinox/searxico-worker/refs/heads/main/docs/img/banner.png" height="230">

<br />
<br />

<div align="center">

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Aetherinox/searxico-worker)

</div>

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

- [Install](#install)
- [About](#about)
  - [Is This Strictly for SearXNG?](#is-this-strictly-for-searxng)
- [Usage](#usage)
- [Methods Utilized:](#methods-utilized)
  - [Self-hosted CDN Repository](#self-hosted-cdn-repository)
  - [Localized Override Table (URLs)](#localized-override-table-urls)
  - [Localized Override Table (SVG Path)](#localized-override-table-svg-path)
  - [API Service](#api-service)
  - [Domain Code Scan](#domain-code-scan)
  - [Default Logo](#default-logo)
- [Step 1 Install Dependencies](#step-1-install-dependencies)
- [Step 2: Deploy Test Server](#step-2-deploy-test-server)
- [Step 3: Customizing Worker](#step-3-customizing-worker)
  - [Sub-Route Support](#sub-route-support)
- [Step 4: Publish Worker to Cloudflare](#step-4-publish-worker-to-cloudflare)
  - [⚠ Windows User Exposed](#-windows-user-exposed)
  - [Deploy Worker](#deploy-worker)
- [Step 5: Adding Your Favicon Worker to SearXNG](#step-5-adding-your-favicon-worker-to-searxng)
- [Cloudflare Loadbalancing](#cloudflare-loadbalancing)
- [Developer Notes](#developer-notes)
  - [wrangler.toml](#wranglertoml)
  - [Wrangler Commands](#wrangler-commands)
    - [Update Wrangle](#update-wrangle)
    - [Launch Dev Server](#launch-dev-server)
    - [Login](#login)
    - [Whoami](#whoami)
    - [List Packages](#list-packages)
    - [Deploy](#deploy)
    - [Deploy - Dry-run (Dist)](#deploy---dry-run-dist)
    - [Delete](#delete)
- [Contributors ✨](#contributors-)

<br />

---

<br />

## Install
To automatically deploy this Cloudflare worker with minimal setup, click the link below:

<div align="center">

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Aetherinox/searxico-worker)

</div>

<br />

If you would like to manually set up the Cloudflare worker and install everything yourself, review the section below:
- [Advanced Install](#step-1-install-dependencies)

<br />

---

<br />

## About
This repository contains the source code you will need to host your own Favicon grabber utilizing a Cloudflare worker (free).

<br />

Originally this project was developed around the use of the popular privacy search engine SearXNG, however, the worker can be used on its own, or can be integrated with any other application which makes use of a favicon grabber service simply by providing the absolute URL to where your worker is hosted.

<br />

When you deploy this worker to Cloudflare, you can enable the ability to either host the worker using your own domain name, or you can use a Cloudflare `worker.dev` domain, which will make the worker available on the web via a browser.

<br />

This worker includes the following features:
- Favicon override using a Github repository <sup> _`(self-hostable)`_ </sup>
- Favicon override using locally provided image URL table
- Favicon override using locally provided SVG path
- Works with Google, Yandex, Duckduckgo, FaviconKit, Allesedv
- Site code scanning for favicon tags, both `link` and `svg`
- CORS Security Headers
- Ability to set API rate limits <sup> _`(disabled by default)`_ </sup>
  - Daily limits OR limit X per milliseconds
- Aggressive throttling mode <sup> _`(disabled by default)`_ </sup>
  - Adds an incremental punishment onto the client's cooldown each time they attempt to grab a favicon when their original cooldown period has not yet expired.
- IP blacklisting / banning
- Supports sub-routes for users who want to add on `get`, `post` routes
- Supports Cloudflare worker logs <sup> _`(beta)`_ </sup>

<br />

The worker contains a variety of methods it uses for finding a favicon for a specified domain. If you would like to view the methods available in this worker, view the section below [Methods Utilized](#methods-utilized).

<br />

### Is This Strictly for SearXNG?
No. This worker was made for [SearXNG](https://searxng.org), however, the favicon worker can be used for any service that makes use of a favicon grabber. 

<br />

---

<br />

## Usage
The usage of this worker is rather simple. Deploy it by clicking the button above. Once the worker is configured, you will be able to access it within your web browser via the URL Cloudflare assigns you. This is usually `searxico.YourCloudflareUsername.worker.dev`.

<br />

Once you access the domain name for your worker, you can start searching for favicons by providing a domain name. As an example, to find a favicon using the online demo worker, you should search using the url:

- https://searxico.aetherinox.workers.dev/reddit.com
- https://searxico.aetherinox.workers.dev/reddit.com/64

<br />

The icon image size on the end of the URL is **optional**. Review a list of available paremeters below:

<br />

| Parameter | Description | Status |
| --- | --- | --- |
| `DOMAIN` | Website to grab favicon for<br><sub>Does not need `http`, `https` or `www`</sub> | Required |
| `ICON_SIZE` | Size of the icon to return | Optional<br><sub>Default: `32`</sub> |

<br />

---

<br />

## Methods Utilized:
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

## Step 1 Install Dependencies
You will need to register for a Cloudflare account if you have not already. First, we need to grab the files from this repo. Create a new project folder where everything will be stored.

```shell
git clone https://github.com/Aetherinox/searxico-worker.git ./searxico
```

<br />

You must have `npm` installed. If you don't, you'll need to install it first. If you are on **Windows**, follow the [Installation Guide here](https://phoenixnap.com/kb/install-node-js-npm-on-windows).

<br />

If you are on **Linux**, you can install with:

```shell
sudo apt install npm
```

<br />

Next, open your terminal / command prompt for Windows / Linux, change directories over to the folder where you downloaded Searxico and install the Node dependencies by running the commands:

```
cd searxico
npm install
```

<br />

Next, confirm that Wrangler is installed by running the command:

```shell
npx wrangler -v
```

<br />

You should receive:
```console
 ⛅️ wrangler 3.80.0
-------------------
```

<br />

Next, you need to sign into Cloudflare using Wrangler so that the app knows where to upload your Favicon worker to:

```shell
npx wrangler login
```

Your operating system web browser should open. Sign into your Cloudflare, and a permission box should appear asking you to confirm that Wrangler should be able to access your Cloudflare account. 

<br />

<p align="center"><img style="width: 80%;text-align: center;" src="https://raw.githubusercontent.com/Aetherinox/searxico-worker/refs/heads/main/docs/img/cloudflare/4.png"></p>

<br />

After you sign in and approve the permissions; you should see the following in your terminal:

```
$ npx wrangler login
Attempting to login via OAuth...
Opening a link in your default browser: https://dash.cloudflare.com/oauth2/auth?response_type=code&client_id=xxxxx
Successfully logged in.
▲ [WARNING] Processing wrangler.toml configuration:
```

<br />

To confirm it worked, type the command:
```shell
npx wrangler whoami
```

<br />

You should see:
```console
 ⛅️ wrangler 3.80.0
-------------------

Getting User settings...
👋 You are logged in with an OAuth Token, associated with the email me@domain.lan.
┌─────────────────────────────────┬──────────────────────────────────┐
│ Account Name                    │ Account ID                       │
├─────────────────────────────────┼──────────────────────────────────┤
│ me@domain.lan's Account         │ abcdefg123456789a1b2c3d4c5e6f7ab │
└─────────────────────────────────┴──────────────────────────────────┘
🔓 Token Permissions: If scopes are missing, you may need to logout and re-login.
Scope (Access)
```

<br />

You now have everything set up and can begin to either make edits to the source code within `/src/index.js`, or you can move on to the next step of the guide which explains how to launch a dev server, or deploy the worker to Cloudflare.

<br />

---

<br />

## Step 2: Deploy Test Server
Now that you finished the above section [Install Dependencies](#install-dependencies), we can now launch a development server so that you can test the worker locally. Back in your terminal, run the command:

```shell
npx wrangler dev -e dev
```

<br />

You should see the following in terminal:
```
 ⛅️ wrangler 3.80.0
-------------------

Your worker has access to the following bindings:
- Unsafe:
  - ratelimit: searxico
- Vars:
  - THROTTLE_DELAY_MS: 0
  - THROTTLE_AGGRESSIVE: false
  - THROTTLE_AGGRESSIVE_PUNISH_MS: 5000
  - THROTTLE_DAILY_ENABLED: false
  - THROTTLE_DAILY_LIMIT: 2000
⎔ Starting local server...
[wrangler:inf] Ready on http://localhost:8787
╭──────────────────────────────────────────────────────────────────────────────────────────────────╮
│  [b] open a browser, [d] open devtools, [l] turn off local mode, [c] clear console, [x] to exit  │
╰──────────────────────────────────────────────────────────────────────────────────────────────────╯
```

<br />

As the instructions say, open your operating system web browser and navigate to the url:
```
http://localhost:8787
```

<br />

> [!NOTE]
> Add the word `/get` to the end of the URL above, as that is the end-point for the favicon grabber. 
>
> I am currently working on an additional setting which will allow you tp specify if you want the favicon grabber to reside in the base domain without a sub-route.

<br >

You should now see the favicon homepage:

```
Searxico Favicon Grabber 1.0.0 

@usage ...... GET localhost:8787/domain.com 
              GET localhost:8787/domain.com/ICON_SIZE 
@repo: ...... https://github.com/Aetherinox/searxico-worker 
@cdn: ....... https://github.com/Aetherinox/searxico-cdn 
@author: ...  github.com/aetherinox 
```

<br />

If you want to test out getting an icon, pick a domain and add it to the end of the URL:
```
http://localhost:8787/searxng.org
```

<br />

You should see the official SearXNG.org favicon, which confirms that this is working. If you wish to stop the development server, go back to your terminal and press `X`. Your terminal should list all of the available options you can pick from:

```
╭──────────────────────────────────────────────────────────────────────────────────────────────────╮
│  [b] open a browser, [d] open devtools, [l] turn off local mode, [c] clear console, [x] to exit  │
╰──────────────────────────────────────────────────────────────────────────────────────────────────╯
```

<br />

Now we can proceed onto the final part of this documentation which explains on how to publish your worker to Cloudflare Proceed to the section [Publish Worker to Cloudflare](#publish-worker-to-cloudflare).

<br />

---

<br />

## Step 3: Customizing Worker
This Cloudflare worker includes a few settings you can adjust. To edit these settings, open the source file `/src/index.js` in an editor and read the sections below:

<br />

### Sub-Route Support
This worker includes the ability to host your favicon worker within a sub-route of your subdomain. You can find this setting within the top of the `src/index.js` as the following settings:

```js
let bSubRoute = false;
const subroute = 'get';
```

<br />

This setting is useful for users who want to expand on this worker and add multiple routes that can be queried such as `GET`, `POST`, and treat it more like an API.

If enabled, this means that you must search for favicons using the URL:
```
https://favicons.domain.com/get/yourdomain.com
                             ^ Sub-route
```

<br />

If you set `bSubRoute = false`, this means that you can search for favicons from domains without any type of additional route being specified. You'll notice in the example below, `/get/` is not being added to the URL:

```
https://favicons.domain.com/yourdomain.com
```

<br />

---

<br />

## Step 4: Publish Worker to Cloudflare
The last part of this guide explains how to publish your worker to Cloudflare.

### ⚠ Windows User Exposed
When you build a wrangler worker and deploy the container to Cloudflare, a file with the extension `.js` will be created, and will display what folder wrangler was installed in. By default, this will show as 
- `C:\Users\USERNAME\AppData\Roaming\npm\node_modules\wrangler`. 

<br />

You can see this by going to Cloudflare, clicking `Workers & Pages`, and clicking `View Code` to the top right.

In order to hide your user path in the code, you must do one of the following:
- Change where NPM is installed for your user path to be removed.
- Deploy using `--minify`

To change the installation path, execute:
```shell ignore
npm config --global set cache "X:\NodeJS\cache" 
npm config --global set prefix "X:\NodeJS\npm"
```

You may need to re-install wrangler after changing the paths:
```shell ignore
npm uninstall wrangler --save-dev
npm install wrangler --save-dev
```

If you do not want to reinstall wrangler, you can also keep the user path from showing in your source code by deploying your project with `--minify`
```shell ignore
wrangler deploy --minify
```

### Deploy Worker
Go back to your Terminal, and execute the command:

```shell
npx wrangler deploy -e production
```

<br />

You will see a large amount of text in your terminal appear:

```
Total Upload: 65.15 KiB / gzip: 14.78 KiB
Your worker has access to the following bindings:
- Unsafe:
  - ratelimit: searxico
- Vars:
  - THROTTLE_DELAY_MS: 0
  - THROTTLE_AGGRESSIVE: false
  - THROTTLE_AGGRESSIVE_PUNISH_MS: 5000
  - THROTTLE_DAILY_ENABLED: false
  - THROTTLE_DAILY_LIMIT: 2000
Uploaded searxico (2.57 sec)
Deployed searxico triggers (0.31 sec)
  https://searxico.aetherinox.workers.dev
Current Version ID: afe1c468-416e-1ff7-1ce6-42aa7490ef5c
```

<br />

> [!NOTE]
> If you have multiple accounts attached to Cloudflare, you will be asked to pick which account you want to upload your worker to.
> 
> ```console
> √ Select an account » 
> »   1. Brad
> »   2. Domain.lan Organization
> ```
>
> If you want to switch accounts, you must execute:
> ```shell
> npx wrangler login
> ```

<br />

If you look at the second to last line, it will tell you what URL you can use to view the actual project online:

```
https://searxico.aetherinox.workers.dev
```

<br />

You can use that domain listed above for any service you wish to use your Favicon grabber for. Cloudflare also supports you adding your own custom domain name onto the worker so that you can access it using a url such as `https://icons.mydomain.com`.

<br />

This concludes the basics of getting your worker up. There are a few things to remember.

<br />

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

<p align="center"><img style="width: 30%;text-align: center;" src="https://raw.githubusercontent.com/Aetherinox/searxico-worker/refs/heads/main/docs/img/cloudflare/1.png"></p>

<br />

Select your worker from the **Override** page.

<br />

<p align="center"><img style="width: 80%;text-align: center;" src="https://raw.githubusercontent.com/Aetherinox/searxico-worker/refs/heads/main/docs/img/cloudflare/2.png"></p>

<br />

You should get a very detailed graph and hard numbers showing what your usage is for the day. You can also modify the search criteria to see how the usage has been for the month.

<br />

<p align="center"><img style="width: 80%;text-align: center;" src="https://raw.githubusercontent.com/Aetherinox/searxico-worker/refs/heads/main/docs/img/cloudflare/3.png"></p>

<br />

---

<br />

## Step 5: Adding Your Favicon Worker to SearXNG
To use your new Favicon grabber service with SearXNG, we need to create a new file within SearXNG.

```shell
searxng/favicons.toml
```

<br />

You should create the file above in the same folder where your other SearXNG configs are, such as:
- `limiter.toml`
- `settings.yml`
- `uwsgi.ini`

<br />

Open the new `favicons.toml` file and add the following:

```toml
[favicons]
cfg_schema = 1   # config's schema version no.

[favicons.proxy.resolver_map]
"searxico" = "searx.plugins.searxico.searxico"
# "duckduckgo" = "searx.favicons.resolvers.duckduckgo"
# "searxico" = "searx.favicons.resolvers.searxico"
# "yandex" = "searx.favicons.resolvers.yandex"
```

<br />

If you want multiple favicon services enabled, uncomment the lines above by removing the `#` for whatever services you want to enable.

<br />

You can also open your `settings.yml` and set the default favicon service you want to use:

```yml
search:
  # backend for the favicon near URL in search results.
  # Available resolvers: "allesedv", "duckduckgo", "google", "yandex" - leave blank to turn it off by default.
  favicon_resolver: "searxico"
```

<br />

Finally, we need to add the plugin file to `/searxng/plugins/`, so create a new file called `searxico.py` and add the following code to it:

```py
"""Adds custom favicon grabber
@plugin     : searxico
@url        : https://github.com/Aetherinox/searxico-worker
@url-cdn    : https://github.com/Aetherinox/searxico-cdn
"""

from __future__ import annotations
from typing import Callable
from searx import network
from searx.plugins import logger
from flask_babel import gettext

DEFAULT_RESOLVER_MAP: dict[str, Callable]
logger = logger.getChild('favicons.resolvers')

name = "Searxico"
description = gettext("Fetch favicons using Searxico favicon grabber")
default_on = True
plugin_id = 'searxico'

logger = logger.getChild(plugin_id)

def _req_args(**kwargs):
    d = {"raise_for_httperror": False}
    d.update(kwargs)
    return d

def searxico(domain: str, timeout: int) -> tuple[None | bytes, None | str]:
    """Favicon Resolver from searxico"""
    data, mime = (None, None)
    url = f"https://searxico.aetherinox.workers.dev/{domain}/32"
    logger.debug("fetch favicon from: %s", url)

    response = network.get(url, **_req_args(timeout=timeout))
    if response and response.status_code == 200 and len(response.content) > 70:
        mime = response.headers['Content-Type']
        data = response.content
    return data, mime

```

<br />

In the code above, change the URL to your custom domain, or your Cloudflare worker:
- `url = f"https://searxico.aetherinox.workers.dev/{domain}/32"`

<br />

You should now have all of the things required for your favicon service to work. Head over to your SearXNG website and click on **Preferences**. Under the **General** tab, find the setting `Favicon Resolver` and change it to:
- Searxico

<br />

<p align="center"><img style="width: 80%;text-align: center;" src="https://raw.githubusercontent.com/Aetherinox/searxico-worker/refs/heads/main/docs/img/searxng/1.png"></p>

<br />

---

<br />

## Cloudflare Loadbalancing
In a previous section, [Publish Worker to Cloudflare](#publish-worker-to-cloudflare), we discussed the fact that Cloudflare puts a limit on each account at 100,000 requests per day. Should there be a reason why you are hosting a public instance of SearXNG, you can also set up load-balancing and provisions off the workload between multiple Cloudflare accounts if you have a team of people working with you.

<br />

SearXNG gives you the ability to select more than one favicon resolver. This means that you can call a second Cloudflare account into service, and add both of these workers into your SearXNG settings. Then when a user performs a search within your search engine, the requests for favicons will be split between both workers instead of them all being sent to one.

<br />

Within your `favicons.toml` file, you can list the different workers you have performing favicon queries:

```toml
[favicons]
cfg_schema = 1   # config's schema version no.

[favicons.proxy.resolver_map]
"Searxico Server 1" = "searx.plugins.searxico.searxico1"
"Searxico Server 2" = "searx.plugins.searxico.searxico2"
```

<br />

With these settings in place, the other step is to take the code provided in the section [Adding Your Favicon Worker to SearXNG](#adding-your-favicon-worker-to-searxng), and create two plugin files instead of one, ensuring each plugin is slightly modified with the updated name.

```py
name = "Searxico 1"
plugin_id = 'searxico1'

logger = logger.getChild(plugin_id)

def _req_args(**kwargs):
    d = {"raise_for_httperror": False}
    d.update(kwargs)
    return d

def searxico(domain: str, timeout: int) -> tuple[None | bytes, None | str]:
```

<br />

Then simply save the plugin file as `/plugins/searxico1.py`.

<br />

---

<br />

## Developer Notes
These are notes you should keep in mind if you plan on modifying this favicon Cloudflare worker.

<br />

### wrangler.toml
We recommend treating your `wrangler.toml` file as the source of truth for your Worker configuration, and to avoid making changes to your Worker via the Cloudflare dashboard if you are using Wrangler.

If you need to make changes to your Worker from the Cloudflare dashboard, the dashboard will generate a TOML snippet for you to copy into your `wrangler.toml` file, which will help ensure your `wrangler.toml` file is always up to date.

If you change your environment variables in the Cloudflare dashboard, Wrangler will override them the next time you deploy. If you want to disable this behavior, add `keep_vars = true` to your `wrangler.toml`.

If you change your routes in the dashboard, Wrangler will override them in the next deploy with the routes you have set in your `wrangler.toml`. To manage routes via the Cloudflare dashboard only, remove any route and routes keys from your `wrangler.toml` file. Then add `workers_dev = false` to your `wrangler.toml` file. For more information, refer to [Deprecations](https://developers.cloudflare.com/workers/wrangler/deprecations/#other-deprecated-behavior).

Wrangler will not delete your secrets (encrypted environment variables) unless you run `wrangler secret delete <key>`.

<br />

> [!NOTE]
> **Experimental Config**
> 
> Wrangler currently supports an `--experimental-json-config` flag, which will read your configuration from a `wrangler.json` file, rather than `wrangler.toml`. The format of this file is exactly the same as the `wrangler.toml` configuration file, except that the syntax is `JSON` rather than `TOML`. 
> 
> This is experimental, and is not recommended for production use.

<br /> <br />

### Wrangler Commands
This section provides a reference for Wrangler commands.

```shell ignore
npx wrangler <COMMAND> <SUBCOMMAND> [PARAMETERS] [OPTIONS]
```

<br />

Since Cloudflare recommends [installing Wrangler locally](https://developers.cloudflare.com/workers/wrangler/install-and-update/) in your project(rather than globally), the way to run Wrangler will depend on your specific setup and package manager.

- [npm](https://developers.cloudflare.com/workers/wrangler/commands/#)
- [yarn](https://developers.cloudflare.com/workers/wrangler/commands/#)
- [pnpm](https://developers.cloudflare.com/workers/wrangler/commands/#)

<br />

After you have access to wrangler globally, you can switch over from using `npx wrangler` to just `wrangler`:

```shell ignore
npx wrangler <COMMAND> <SUBCOMMAND> [PARAMETERS] [OPTIONS]
```

<br />

Full list of commands available at:
- https://developers.cloudflare.com/workers/wrangler/commands/

<br /> <br />

#### Update Wrangle
To update the version of Wrangler used in your project, run:

```shell ignore
npm install wrangler@latest
```

<br /> <br />

#### Launch Dev Server
Launches your local wrangler / cloudflare dev project in a test environment.

```shell ignore
npx wrangler dev -e dev
```

<br /> <br />

#### Login
Authorize Wrangler with your Cloudflare account using OAuth. Wrangler will attempt to automatically open your web browser to login with your Cloudflare account.
If you prefer to use API tokens for authentication, such as in headless or continuous integration environments, refer to [Running Wrangler in CI/CD](https://developers.cloudflare.com/workers/wrangler/ci-cd/).

If Wrangler fails to open a browser, you can copy and paste the URL generated by `wrangler login` in your terminal into a browser and log in.

```shell ignore
npx wrangler login [OPTIONS]
```

<br /> <br />

#### Whoami
Lists all accounts associated with your Cloudflare account

```shell ignore
npx wrangler whoami
```

<br /> <br />

#### List Packages
Check where wrangler (and other global packages) are installed at:

```shell ignore
npm list -g --depth=0
```

<br /> <br />

#### Deploy
Deploy your Worker to Cloudflare.

```shell ignore
npx wrangler deploy [<SCRIPT>] [OPTIONS]
```

```shell ignore
npx wrangler deploy --minify -e production
```

> [!NOTE]
> None of the options for this command are required. Also, many can be set in your `wrangler.toml` file. Refer to the [`wrangler.toml` configuration](https://developers.cloudflare.com/workers/wrangler/configuration/) documentation for more information.

<br /><br />

#### Deploy - Dry-run (Dist)
The following command will build a dry-run compiled version of your index.js file which will be placed in the `dist/` folder

```shell ignore
npx wrangler deploy --dry-run --outdir dist -e production
```

<br /> <br />

#### Delete
Delete your Worker and all associated Cloudflare developer platform resources.

```shell ignore
npx wrangler delete [<SCRIPT>] [OPTIONS]
```

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
  [github-build-img]: https://img.shields.io/github/actions/workflow/status/Aetherinox/searxico-worker/worker-publish.yml?logo=github&logoColor=FFFFFF&label=Build&color=%23278b30
  [github-build-uri]: https://github.com/Aetherinox/searxico-worker/actions/workflows/worker-publish.yml

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
