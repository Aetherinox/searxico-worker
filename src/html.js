const template = ( console, domain, host ) =>`
<!doctype html>
<html lang="en" with-selection-styled>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Favicon Grabber · Powered by Cloudflare Workers®</title>

    <meta name="description" content="Favicon grabber powered by Cloudflare Workers®.">
    <meta name="keywords" content="favicon, favico, favicon grabber, favicon capture, favicon downloader, Cloudflare Workers, Cloudflare®, app">
    <meta name="author" content="Aetherinox">
    <meta name="generator" content="Aetherinox">

    <meta property="og:type" content="website">
    <meta property="og:title" content="Favicon Grabber">
    <meta property="og:description" content="Favicon grabber powered by Cloudflare Workers®.">
    <meta property="og:url" content="${domain}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Favicon Grabber">
    <meta name="twitter:description" content="Favicon grabber powered by Cloudflare Workers®.">
    <meta name="twitter:url" content="${domain}">

    <link href="https://ui.components.workers.dev/?helpers=with-selection-styled,is-smooth-scrolling&components=Link,Button,FormField,Input,Checkbox,Radio,Stack,Row,Dialog" rel="stylesheet">

    <script>
    /* focus-visible polyfill */ ! function(t, e) {
        "object" == typeof exports && "undefined" != typeof module ? e() : "function" == typeof define && define.amd ? define(e) : e()
    }(0, function() {
        "use strict";
        "undefined" != typeof document && function(t) {
            var e;

            function n() {
                e || (e = !0, t())
            } ["interactive", "complete"].indexOf(document.readyState) >= 0 ? t() : (e = !1, document.addEventListener("DOMContentLoaded", n, !1), window.addEventListener("load", n, !1))
        }(function() {
            var t = !0,
                e = !1,
                n = null,
                o = {
                    text: !0,
                    search: !0,
                    url: !0,
                    tel: !0,
                    email: !0,
                    password: !0,
                    number: !0,
                    date: !0,
                    month: !0,
                    week: !0,
                    time: !0,
                    datetime: !0,
                    "datetime-local": !0
                };

            function r(t) {
                return !!(t && t !== document && "HTML" !== t.nodeName && "BODY" !== t.nodeName && "classList" in t && "contains" in t.classList)
            }

            function i(t) {
                "" !== t.getAttribute("is-focus-visible") && t.setAttribute("is-focus-visible", "")
            }

            function u(e) {
                t = !1
            }

            function c() {
                document.addEventListener("mousemove", s), document.addEventListener("mousedown", s), document.addEventListener("mouseup", s), document.addEventListener("pointermove", s), document.addEventListener("pointerdown", s), document.addEventListener("pointerup", s), document.addEventListener("touchmove", s), document.addEventListener("touchstart", s), document.addEventListener("touchend", s)
            }

            function s(e) {
                "html" !== e.target.nodeName.toLowerCase() && (t = !1, document.removeEventListener("mousemove", s), document.removeEventListener("mousedown", s), document.removeEventListener("mouseup", s), document.removeEventListener("pointermove", s), document.removeEventListener("pointerdown", s), document.removeEventListener("pointerup", s), document.removeEventListener("touchmove", s), document.removeEventListener("touchstart", s), document.removeEventListener("touchend", s))
            }

            document.addEventListener("keydown", function(e) {
                r(document.activeElement) && i(document.activeElement), t = !0
            }, !0), document.addEventListener("mousedown", u, !0), document.addEventListener("pointerdown", u, !0), document.addEventListener("touchstart", u, !0), document.addEventListener("focus", function(e) {
                var n, u, c;
                r(e.target) && (t || (n = e.target, u = n.type, "INPUT" == (c = n.tagName) && o[u] && !n.readOnly || "TEXTAREA" == c && !n.readOnly || n.isContentEditable)) && i(e.target)
            }, !0), document.addEventListener("blur", function(t) {
                var o;
                r(t.target) && t.target.hasAttribute("is-focus-visible") && (e = !0, window.clearTimeout(n), n = window.setTimeout(function() {
                    e = !1, window.clearTimeout(n)
                }, 100), "" === (o = t.target).getAttribute("is-focus-visible") && o.removeAttribute("is-focus-visible"))
            }, !0), document.addEventListener("visibilitychange", function(n) {
                "hidden" == document.visibilityState && (e && (t = !0), c())
            }, !0), c(), document.documentElement.setAttribute("js-focus-visible-polyfill-available", "")
        })
    })
    </script>

    <script>
        /* dialog */
        (() => {
            const t = '*[tabindex]:not([tabindex="-1"]),a[href]:not([tabindex="-1"]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled])',
                e = e => {
                    e.querySelectorAll(t).forEach(t => {
                        if (t.setAttribute("data-inert", ""), t.matches("[tabindex]")) {
                            const e = t.getAttribute("tabindex");
                            e && t.setAttribute("data-original-tabindex", e), t.setAttribute("tabindex", -1)
                        } else t.setAttribute("disabled", "")
                    })
                },
                i = (t => {
                    let e = !1;
                    return () => {
                        e || (t(), e = !0)
                    }
                })(() => {
                    let t;
                    document.documentElement.addEventListener("dialogOpen", ({
                        detail: {
                            dialog: e
                        }
                    }) => {
                        t && (t.originalActiveElement = null, t.close()), t = e
                    }), document.documentElement.addEventListener("dialogClose", ({
                        detail: {
                            dialog: e
                        }
                    }) => {
                        t = null
                    })
                });
            window.Dialog = class {
                constructor(t) {
                    this.el = t, this.el.setAttribute("tabindex", 0), this.backdropEl = t.closest("[dialog-backdrop]"), this.setupARIA(), this.prepareFocusTrap(), this.checkForEscape = (t => e => {
                        e.target.matches("input[type=text],input[type=email],input[type=number],input[type=password],input[type=search],input[type=tel],input[type=url],textarea") || "Escape" === e.key && t.close()
                    })(this), this.setupClosers(), e(this.backdropEl), this.isOpen = !1, i()
                }
                setupARIA() {
                    this.el.setAttribute("role", "dialog"), this.el.setAttribute("aria-modal", !0)
                }
                prepareFocusTrap() {
                    const e = '<div tabindex="0"></div>';
                    this.el.insertAdjacentHTML("beforebegin", e), this.el.insertAdjacentHTML("afterend", e), this.trapFocus = (e => i => {
                        if (e.contains(i.target)) return;
                        const s = Array.from(e.querySelectorAll(t));
                        s.unshift(e), e.previousElementSibling === i.target ? s[s.length - 1].focus() : e.nextElementSibling === i.target && s[0].focus()
                    })(this.el)
                }
                setupClosers() {
                    this.backdropEl.addEventListener("click", t => {
                        const e = t.target;
                        (e === this.backdropEl || e.matches("[dialog-close]") || e.closest("[dialog-close]")) && this.close()
                    })
                }
                dispatch(t) {
                    this.el.dispatchEvent(new CustomEvent(t, {
                        bubbles: !0,
                        detail: {
                            dialog: this
                        }
                    }))
                }
                open() {
                    if (this.isOpen) return;
                    this.isOpen = !0, this.backdropEl.querySelectorAll("[data-inert]").forEach(t => {
                        if (t.matches("[tabindex]")) {
                            const e = t.getAttribute("data-original-tabindex");
                            t.removeAttribute("tabindex"), null !== e && t.setAttribute("tabindex", e)
                        } else t.removeAttribute("disabled");
                        t.removeAttribute("data-inert")
                    }), this.originalActiveElement = document.activeElement, this.backdropEl.setAttribute("is-active", ""), document.documentElement.setAttribute("is-dialog", ""), document.addEventListener("focus", this.trapFocus, !0), document.addEventListener("keyup", this.checkForEscape, !0);
                    const t = this.el.querySelector("[dialog-autofocus]");
                    t ? t.focus() : matchMedia("(hover: hover) and (pointer: fine)").matches && (this.el.focus({
                        preventScroll: !0
                    }), requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            this.backdropEl.scrollTo(0, 0)
                        })
                    })), this.dispatch("dialogOpen")
                }
                close() {
                    this.isOpen && (this.isOpen = !1, e(this.backdropEl), this.backdropEl.removeAttribute("is-active", ""), document.documentElement.removeAttribute("is-dialog"), document.removeEventListener("focus", this.trapFocus, !0), document.removeEventListener("keyup", this.checkForEscape, !0), this.originalActiveElement && this.originalActiveElement.focus(), this.dispatch("dialogClose"))
                }
            }
        })()
    </script>

    <style>
        html {
            --font-family: Avenir, system-ui, sans-serif;
            --color-rgb: 8, 10, 60;
            --accent-color-rgb: 74, 76, 105;
            --error-color-rgb: 206, 0, 88;
        }

        @media (min-width: 84em) {
            body {
                font-size: 1.2em;
            }
        }

        [is-hidden] {
            display: none;
        }

        a {
            color: rgb(var(--accent-color-rgb));
        }

        html {
            background: #242829;
            color: #fff;
        }

        html,
        body {
            overscroll-behavior: none;
        }

        body {
            margin: 0;
        }

        html,
        body,
        .Surface {
            height: 100%;
        }

        figure {
            background-image: url("https://raw.githubusercontent.com/Aetherinox/searxico-worker/refs/heads/main/src/assets/img/1.jpg");
            background-size: cover;
        }

        .Surface {
            display: flex;
        }

        h1 {
            margin: 0;
            font-weight: bold;
            font-size: 1.15em;
        }

        .Dialog {
            background-color: #1a1d21;
        }

        @media (min-width: 84em) {
            body {
                font-size: 1em;
            }
        }

        @media (max-width: 360px) {
            h1 {
                font-size: 1em;
            }
        }

        h1 + .Button {
            margin-left: auto;
        }

        .Button-is-help {
            margin: -0.5em 0;
            padding: 0;
            font-size: 1.1em;
            font-size: 1.0625em;
            font-weight: bold;
            text-align: center;
            width: 1.76470588236em;
            height: 1.76470588236em;
            border-radius: 50%;
        }

        .Button-is-help:hover {
            background-color: #202020;
            font-weight: 600;
        }

        .FormField--label {
            font-weight: 500;
        }

        .Panel {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            width: 25em;
            background-color: #242829;
            box-shadow: 0 0 1em rgba(0, 0, 0, 0.5);
        }

        .Dialog---backdrop {
            background: rgba(85, 85, 85, 0.3);
        }

        .Row {
            display: block;
        }

        .Panel--top,
        .Panel--main,
        .Panel--bottom {
            box-sizing: border-box;
            padding-left: 1.5em;
            padding-right: 1.5em;
        }

        .Panel--top {
            position: relative;
            z-index: 2;
            display: flex;
            align-items: center;
            padding-top: 1em;
            padding-bottom: 1em;
            background: #1a1d1e;
            box-shadow: 0 1px rgba(0, 0, 0, 0.07), 0 3px 3px -2px rgba(0, 0, 0, 0.09);
            flex-shrink: 0;
        }

        .Panel--main {
            padding-top: 1.5em;
            padding-bottom: 1.5em;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
        }

        .Panel--deemphasized {
            position: relative;
        }

        .Panel--deemphasized::after {
            content: "";
            display: block;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: #efefef;
            opacity: 0.3;
        }

        #status
        {
            position: relative;
            z-index: 1;
            margin-top: auto;
            padding-top: 0.5em;
            padding-bottom: 0.5em;
            padding-left: 10px;
            padding-right: 10px;
            font-size: 10pt;
            text-align: center;
            color: #A6A6A6;
        }

        #status > .url {
            color: rgb(255, 122, 166);
        }

        .Panel--bottom {
            padding: 5px;
            position: relative;
            z-index: 1;
            padding-top: 1em;
            padding-bottom: 1em;
            background: #1a1d1e;
            box-shadow: 0 -1px rgba(0, 0, 0, 0.07), 0 -3px 3px -2px rgba(0, 0, 0, 0.09);
            flex-shrink: 0;
        }

        .console {
            flex: 1;
            margin: 0;
        }

        .console .codeblock,
        .console .codeblock--code {
            display: block;
            height: 100%;
            width: 100%;
            margin: 0;
        }

        .codeblock {
            box-sizing: border-box;
            -webkit-font-smoothing: antialiased;
            display: block;
            white-space: pre-wrap;
            word-break: break-word;
            font-family: var(--monospace-font-family);
            padding: 1.5em;
            font-size: 0.9em;
            background: rgba(29, 29, 37, 0.60);
            color: #fff;
            cursor: text;
            overflow: auto;
            font-size: 10pt;
        }

        .codeblock::-webkit-scrollbar {
            width: 8px;
            height: 8px;
            transition: opacity 0.5s ease;
        }

        .codeblock:not(:hover)::-webkit-scrollbar {
            opacity: 0;
        }

        .codeblock::-webkit-scrollbar-track-piece {
            background: transparent;
            border-radius: 0.5em;
        }

        .codeblock::-webkit-scrollbar-thumb {
            border-radius: 0.5em;
            box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.05);
            border: 2px solid var(--primary-background-color);
            background: rgba(255, 255, 255, 0.1);
        }

        .logo > span {
            display: inline-block;
            color: rgb(140, 140, 140);
        }

        .logo--muted {
            position: relative;
        }

        .logo--muted::after {
            content: "";
            display: block;
            position: absolute;
            top: 3px;
            right: 0;
            bottom: 3px;
            left: 0;
            opacity: 0.5;
        }

        .about-text {
            font-size: 10pt;
            line-height: 2;
        }

        .about-text a {
            font-size: 10pt;
            color: #53D962;
            text-decoration-style: dotted;
        }

        @media (max-width: 319px) {
            .logo > .logo--muted {
                display: none;
            }
        }

        .btn-grab {
            background-color: #ac1524;
        }

        .btn-grab-ico
        {
            margin-block-end: -2px;
            padding-right: 4px;
        }

        .btn-exit {
            background-color: rgb(83, 71, 140);
        }

        .btn-exit-ico
        {
            margin-block-end: -2px;
            padding-right: 4px;
            filter: brightness(0) invert(1);
        }

        .btn-github {
            background-color: #0c60cc;
        }

        .btn-github-ico
        {
            margin-block-end: -2px;
            padding-right: 4px;
            filter: brightness(0) invert(1);
        }

        .btn-deploy {
            background-color: #575757;
        }

        .btn-deploy-ico
        {
            margin-block-end: -2px;
            padding-right: 4px;
        }

        .Panel--bottom .btn-grab .mobile-only {
            display: none;
        }

        @media (max-width: 800px) {
            .Panel {
                width: 100%;
            }

            .console,
            .Panel--bottom .btn-grab .desktop-only,
            .Panel--bottom .btn-demo,
            .Panel--bottom .btn-deploy {
                display: none;
            }

            .Panel--bottom .btn-grab .mobile-only {
                display: inline;
            }
        }

        .Dialog--content .Link {
            --underline-size: 1px;
            --underline-color: rgba(var(--accent-color-rgb), 0.7);
            display: inline-block;
            line-height: 1.1;
        }

        .Dialog-is-medium {
            width: 40em;
        }

        .Input {
            background-color: #17191a;
        }

        .Checkbox--label::before {
            background: #17191a;
        }

        .Radio--input:checked + .Radio--label::after {
            background-color: #0070e0;
        }

        .Checkbox--label::after {
            box-shadow: 0 0 0 0em rgba(0, 112, 224, 0.4);
        }

        .Checkbox--input:checked + .Checkbox--label::after,
        .Checkbox--input:indeterminate + .Checkbox--label::after {
            background-color: #0070e0;
        }

        .Radio--label::before {
            background: #17191a;
        }

        .Input:not([is-pristine]):not(:focus):invalid {
            --focus-color: rgba(var(--error-color-rgb), 0.5);
            --border-color: rgba(var(--error-color-rgb), 0.4);
            --border-top-color: rgb(var(--error-color-rgb));
        }

        .Input:not([is-pristine]):focus:invalid {
            color: rgb(var(--error-color-rgb));
        }

    </style>
  </head>

  <body>
    <div class="Surface">
        <div class="Panel">
            <div class="Panel--top">
                <h1>
                    <a href="${domain}" class="Link Link-without-underline">
                        <span class="logo">
                            <span>${host}</span>
                        </span>
                    </a>
                </h1>
                <button data-js-dialog-open class="Button Button-is-help" type="button" aria-label="Help">?</button>
            </div>
            <main class="Panel--main" is-smooth-scrolling>
                <p>Enter a domain name below to fetch the favicon for that particular domain.</p>
                <form id="form" class="Stack" method="GET" action="${domain}">
                    <div class="FormField">
                        <div class="FormField--text">
                            <label class="FormField--label" for="url">URL</label>
                        </div>
                        <input class="Input" is-pristine id="url" type="text" inputmode="url" name="url" pattern="(?:(?:(?:https?):\\/\\/))?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))(?::\\d{2,5})?(?:\\/\\S*)?" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off" required autofocus />
                    </div>
                </form>
            </main>
            <div id="status">Ready</div>
            <div class="Panel--bottom">
                <div class="Row">
                    <center>
                    <button class="Button btn-grab" type="submit" form="form">
                        <span class="desktop-only"><img class="btn-grab-ico" width="16" height="16" src="https://raw.githubusercontent.com/Aetherinox/searxico-worker/refs/heads/main/src/assets/ico/action_grab.png"> Grab Icon</span>
                        <span class="mobile-only">Fetch</span>
                    </button>
                    <a data-js-button-github href="https://github.com/Aetherinox/searxico-worker" class="Button btn-github" type="button"><img class="btn-github-ico" width="16" height="16" src="https://raw.githubusercontent.com/Aetherinox/searxico-worker/refs/heads/main/src/assets/ico/action_github.png"> Github</a>
                    </center>
                </div>
            </div>
        </div>
        <figure class="console">
            <pre class="codeblock"><code class="codeblock--code" language="json" data-js-console-output></code></pre>
        </figure>
    </div>
    <div class="Dialog---backdrop" dialog-backdrop>
        <div tabindex="0"></div>
        <div class="Dialog Dialog-is-medium" role="dialog" aria-modal="true" aria-labelledby="dialog-title" dialog>
            <h2 class="Dialog--title" id="dialog-title">About</h2>
            <div class="Dialog--content">
                <center>
                    <img alt="GitHub Release" src="https://img.shields.io/github/v/release/Aetherinox/searxico-worker?include_prereleases&style=flat-square&logo=github&label=version">

                    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/Aetherinox/searxico-worker?style=flat-square&label=last%20commit&color=de1f54">

                    <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/Aetherinox/searxico-worker?style=flat-square&color=396cc6">
                </center>

                <p class="about-text">Searxico allows you to fetch the favicon of a specific website which you can then utilize within your own application. Visit the Github repository for instructions on how to integrate this Cloudflare worker into <a href="https://searxng.org">SearXNG</a>.</p>
            </div>
            <div class="Dialog--actions">
                <div class="Row">
                    <button class="Button btn-exit" dialog-close dialog-autofocus><img class="btn-exit-ico" width="16" height="16" src="https://raw.githubusercontent.com/Aetherinox/searxico-worker/refs/heads/main/src/assets/ico/action_close.png"> Close</button>
                    <button class="Button btn-deploy" dialog-close data-js-button-deploy><img class="btn-deploy-ico" width="16" height="16" src="https://raw.githubusercontent.com/Aetherinox/searxico-worker/refs/heads/main/src/assets/ico/action_cfworker.png"> Deploy</button>
                </div>
            </div>
            <div class="Dialog--close-positioner">
                <button class="Button Button-is-close" aria-label="Close" dialog-close>
                    <svg viewBox="0 0 8 8">
                        <path stroke="currentColor" stroke-width=".75" d="M0 0 L8 8 M8 0 L0 8" />
                    </svg>
                </button>
            </div>
        </div>
        <div tabindex="0"></div>
    </div>

    <script>
        const Debounce = ( fn, delay ) =>
        {
            let timeout

            return ( ) =>
            {
                clearTimeout( timeout )
                timeout = setTimeout(( ) => fn( ), delay)
            }
        }

        const form = document.querySelector('form')
        const openDialog = document.querySelector('[data-js-dialog-open]')
        const btnDeploy = document.querySelector('[data-js-button-deploy]')
        const btnGithub = document.querySelector('[data-js-button-github]')
        const console = document.querySelector('[data-js-console-output]')
        console.textContent = \`${console}\`

        const mobileQuery = window.matchMedia('(max-width: 800px)')
        const dialog = new Dialog(document.querySelector('[dialog]'))
        openDialog.addEventListener('click', () => dialog.open())

        btnDeploy.addEventListener( 'click', () =>
        {
            const data =
            {
                url: 'https://deploy.workers.cloudflare.com/?url=https://github.com/Aetherinox/searxico-worker'
            }

            const getElement = id => form.querySelector(\`#\${ id }\`)

            let pristine = true
            for (obj in data)
            {
                const fieldEl = getElement(obj)
                if (fieldEl && fieldEl.value !== '')
                    pristine = false
            }

            for (obj in data)
            {
                const fieldEl = getElement(obj)
                if (fieldEl) fieldEl.value = data[obj]
            }

            validateURL()
            update()
        })

        let lastUrl = btnGithub.href
        const update = ( ) =>
        {
            if ( form.checkValidity && !form.checkValidity( ) )
                return

            const data = new FormData(form)
            const data_url = data.get("url");
            const url = \`\/\${ data_url }\`

            if (url === lastUrl)
                return

            lastUrl = url

            if (data.get('url'))
                fetchURL(url)
        }

        async function fetchURL( url )
        {
            const data = new FormData(form)
            //const response = await fetch( url )
            document.getElementById("status").innerHTML = \`${host}\`
            window.location.href = \`${domain}\` + url
            console.textContent = \`${console}\`
        }

        form.addEventListener( 'submit', event =>
        {
            if (mobileQuery.matches) return

            event.preventDefault()
            update()
        })

        const validateURL = () =>
        {
            if (url.validity.valueMissing)
            {
                url.setCustomValidity('Enter a URL to fetch the favicon for.')
            } else if (url.validity.patternMismatch) {
                url.setCustomValidity('Enter a valid URL.')
            } else {
                url.setCustomValidity('')
            }
        }

    </script>
  </body>
</html>`

export default template
