# React Deepgram example, AI speech transcription

-   [What's that?](#whats-that)
-   [Deepgram?](#deepgram)
-   [Why?](#why)
-   [How it's working?](#How-its-working)
    -   [deepgram-proxy](#deepgram-proxy)
    -   [deepgram-react](#deepgram-react)

## What's that?

It's example of integration deepgram using react.

## Deepgram?

Deepgram is external service to transcript speech from audio! (using AI or other crazy stuff!)

Read more here: [https://deepgram.com](https://deepgram.com)

## Why?

Project was made as submission to DEV hackathlon, read more [here](https://dev.to/devteam/join-us-for-a-new-kind-of-hackathon-on-dev-brought-to-you-by-deepgram-2bjd)

## How it's working?

To make it work we need proxy to deepgram API.
### deepgram-proxy

First we need some backend to communicate with deepgram API. 

deepgram-proxy is a simple nodejs container with express.js to handler API requests.

### deepgram-react

Simple example how to integrate your react app with proxy.
