if(!self.define){let s,e={};const a=(a,t)=>(a=new URL(a+".js",t).href,e[a]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=a,s.onload=e,document.head.appendChild(s)}else s=a,importScripts(a),e()})).then((()=>{let s=e[a];if(!s)throw new Error(`Module ${a} didn’t register its module`);return s})));self.define=(t,c)=>{const n=s||("document"in self?document.currentScript.src:"")||location.href;if(e[n])return;let i={};const u=s=>a(s,n),r={module:{uri:n},exports:i,require:u};e[n]=Promise.all(t.map((s=>r[s]||u(s)))).then((s=>(c(...s),i)))}}define(["./workbox-f1770938"],(function(s){"use strict";importScripts(),self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"/_next/static/chunks/0e5ce63c-cb045aba762898bf.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/1336-07c8b23dce363690.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/1389-3d55cb99060ea29f.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/1869-6d236b9956c223ec.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/193-b16a03f4d33ade11.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/2023-0834b110b6b6e3be.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/2235-ad1cde71ebe45321.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/23-ecbc8814d07ca357.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/2359-fd388b74c2745a83.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/2592-691a85851a896162.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/413-3a5da16179fb68d1.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/4160-8155d8cf5b8e76e6.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/4177-eca9bf9710f2cb00.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/4264-3cbcd8c58c0864e1.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/4310-cff779020216f73e.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/4330-ec7888221ebaa460.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/4523-acd7b6f584e775a6.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/4697-99b10e4b14337e8f.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/4808-f91acd9a7f4c0ce3.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/4868-58edd0bd42a74b10.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/493-172950c737ea4860.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/513-5fbcb01777b12ac3.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/514-a657237fe138af41.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/5176-cdd82c1cb70d4c49.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/5190-5429bc2348d1278c.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/5267-bf7e2392758d8326.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/6460-248c3d7f108cc573.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/7138-e99f102cc7432408.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/7156-55bebeca74df0da0.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/7440-c9f87af9eb7bbbe4.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/752.594841a2766fcb6e.js",revision:"594841a2766fcb6e"},{url:"/_next/static/chunks/7970-4de0cfaf0de130d8.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/8181-18efeb44c1d93baf.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/9030-279efe20648eaae6.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/94730671-523ab9403ad56847.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/9494-e522921d1b0e2384.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/9635.7998bdd0e1da5973.js",revision:"7998bdd0e1da5973"},{url:"/_next/static/chunks/9779-170ba3c874a21d29.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/9783-f53d7b5af3e53347.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/(auth)/layout-89b0e73f0bfaa964.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/(auth)/sign-in/%5B%5B...rest%5D%5D/page-773b3553e7c7f2a1.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/(auth)/sign-up/%5B%5B...rest%5D%5D/page-1c1ee0c424386bee.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/(auth)/welcome/page-663e435d846cc5db.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/(landing)/layout-8015f0e4bfd84f2c.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/(landing)/page-a08d11e5c642afcf.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/_not-found/page-687048894594d829.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/dashboard/admins/%5BadminId%5D/page-78724b27d682ec81.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/dashboard/admins/page-e01ad751d908f7ba.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/dashboard/coordinators/%5BcoordinatorId%5D/page-aa8112f41ec7e3b0.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/dashboard/coordinators/page-10e2438b5d172b20.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/dashboard/events/%5BeventId%5D/page-f449d90b3be0bbfe.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/dashboard/events/page-7cdad6773ea03123.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/dashboard/layout-c94b0c68fa3880e7.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/dashboard/myevents/%5BeventId%5D/page-376315918812b849.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/dashboard/myevents/page-7071b4110c4ca4e2.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/dashboard/myteams/%5BteamId%5D/page-2cd352ef9c760c2b.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/dashboard/myteams/page-67373b83a9741c83.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/dashboard/page-d5c6aa5bea8718e0.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/dashboard/profile/page-bfedf491d270f263.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/dashboard/reaps/%5BreapId%5D/page-2d5979bb55fcf3cb.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/dashboard/reaps/page-f1b6f4829016e90b.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/dashboard/teams/%5BteamId%5D/page-49f624c599616c6d.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/dashboard/teams/page-922afc500e5e6102.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/dashboard/users/%5Bid%5D/page-3695c0e03a8457dc.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/dashboard/users/page-e85e43bd94bdde2e.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/dashboard/yourteams/join/%5BteamCode%5D/page-3acaa38117851761.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/dashboard/yourteams/join/page-ca81b48a2072322a.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/dashboard/yourteams/page-5e757cb6d4840ba5.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/layout-e900be9e40c5802a.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/app/not-found-0fe2b95dc3ec45c8.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/bc9e92e6-7ce517cb588f49be.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/f4898fe8-30a4096a8ab5fdc1.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/fd9d1056-8d1e2b9437a10e83.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/framework-8e0e0f4a6b83a956.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/main-app-b34019258ca78c8e.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/main-f7975915f571d76b.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/pages/_app-f870474a17b7f2fd.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/pages/_error-c66a4e8afc46f17b.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-175fd1874c3f8fbd.js",revision:"juactJw4xABsfU1GHbYR1"},{url:"/_next/static/css/55e751ac52c33ec4.css",revision:"55e751ac52c33ec4"},{url:"/_next/static/juactJw4xABsfU1GHbYR1/_buildManifest.js",revision:"3e2d62a10f4d6bf0b92e14aecf7836f4"},{url:"/_next/static/juactJw4xABsfU1GHbYR1/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/media/5d4a6d6d18033392-s.woff2",revision:"200e5b32143444d1c539429a3f9e0a2c"},{url:"/_next/static/media/73b9b49ded63c2ac-s.woff2",revision:"348c18973bd7ef16e575c2cf02ca846a"},{url:"/_next/static/media/7aa35bcef8fce17b-s.p.woff2",revision:"c7259eb7ab75d68f4c328fd780a4930f"},{url:"/_next/static/media/891631c764a307b2-s.woff2",revision:"c8d7e8fe83b86e15200eccf83f382bf9"},{url:"/_next/static/media/8b7ed269fbb6e772-s.woff2",revision:"dcd304c75717026be729bd81062e2cf8"},{url:"/_next/static/media/d7b29b398dd797a1-s.woff2",revision:"d6e31cc35c18476b32f331a6a0818b98"},{url:"/_next/static/media/eafabf029ad39a43-s.p.woff2",revision:"43751174b6b810eb169101a20d8c26f8"},{url:"/_next/static/media/ef23c27b86d93109-s.woff2",revision:"99b39902fefc6f86170f2bd7f06fb617"},{url:"/_next/static/media/fe0777f1195381cb-s.woff2",revision:"f2a04185547c36abfa589651236a9849"},{url:"/logos/logo.png",revision:"9b77485d2065eaf2012f39f6ff90c1e9"},{url:"/logos/logo.svg",revision:"dfebf5339a3e16923b665bf921724eee"},{url:"/logos/uem-white.svg",revision:"403e961a5a11a634532a2d9085b8d058"},{url:"/manifest.json",revision:"41e5d7d2b12c54b07ebc12ea27ea1975"},{url:"/maskable.png",revision:"cb86513221a0db5dd5c87636aa604806"},{url:"/rounded.png",revision:"e52f5c3952b8d5bfb1565a2f815ad4f1"},{url:"/swe-worker-5c72df51bb1f6ee0.js",revision:"5a47d90db13bb1309b25bdf7b363570e"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]}),s.cleanupOutdatedCaches(),s.registerRoute("/",new s.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({response:s})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),s.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new s.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new s.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),s.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new s.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new s.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),s.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new s.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new s.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),s.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new s.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new s.ExpirationPlugin({maxEntries:64,maxAgeSeconds:2592e3})]}),"GET"),s.registerRoute(/\/_next\/static.+\.js$/i,new s.CacheFirst({cacheName:"next-static-js-assets",plugins:[new s.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\/_next\/image\?url=.+$/i,new s.StaleWhileRevalidate({cacheName:"next-image",plugins:[new s.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:mp3|wav|ogg)$/i,new s.CacheFirst({cacheName:"static-audio-assets",plugins:[new s.RangeRequestsPlugin,new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:mp4|webm)$/i,new s.CacheFirst({cacheName:"static-video-assets",plugins:[new s.RangeRequestsPlugin,new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:js)$/i,new s.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new s.ExpirationPlugin({maxEntries:48,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:css|less)$/i,new s.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new s.StaleWhileRevalidate({cacheName:"next-data",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:json|xml|csv)$/i,new s.NetworkFirst({cacheName:"static-data-assets",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute((({sameOrigin:s,url:{pathname:e}})=>!(!s||e.startsWith("/api/auth/callback")||!e.startsWith("/api/"))),new s.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new s.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),s.registerRoute((({request:s,url:{pathname:e},sameOrigin:a})=>"1"===s.headers.get("RSC")&&"1"===s.headers.get("Next-Router-Prefetch")&&a&&!e.startsWith("/api/")),new s.NetworkFirst({cacheName:"pages-rsc-prefetch",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute((({request:s,url:{pathname:e},sameOrigin:a})=>"1"===s.headers.get("RSC")&&a&&!e.startsWith("/api/")),new s.NetworkFirst({cacheName:"pages-rsc",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute((({url:{pathname:s},sameOrigin:e})=>e&&!s.startsWith("/api/")),new s.NetworkFirst({cacheName:"pages",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute((({sameOrigin:s})=>!s),new s.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET"),self.__WB_DISABLE_DEV_LOGS=!0}));
