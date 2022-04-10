# Boost your react app accessibility with AI Speech Recognition (Deepgram)!

-   [What's that?](#whats-that)
    -   [Deepgram?](#deepgram)
    -   [Purpose](#purpose)
-   [Why?](#why)
-   [How it's working?](#How-its-working)
    -   [deepgram-proxy](#deepgram-proxy)
    -   [deepgram-react](#deepgram-react)
-   [Run a project](#run-a-project)
    -   [Get your API key](#get-your-API-key)
    -   [Set your API key](#set-your-API-key)
    -   [Run](#run)
        -   [Using docker](#using-docker)
        -   [Using local env](#using-local-env)

## What's that?

It's example of integration with Deepgram using react.

![gif](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/x6n5skgl52tetmn2vta4.gif)

### Deepgram?

Deepgram is external service to transcript speech from audio! (using AI, crazy stuff!)

Read more here: [https://deepgram.com](https://deepgram.com)

### Purpose

Purpose is to use speech transcription to improve an react app accessibility. We provide extra way to input value!

-   Help to provide input for people with disabilities
-   Speed up a form filling
-   Share expierience accross any device
    -   any device supporting modern browser
    -   react-native (mobile, TV, dekstop) as well!

## Why?

Project was made as submission to DEV hackathlon, read more [here](https://dev.to/devteam/join-us-for-a-new-kind-of-hackathon-on-dev-brought-to-you-by-deepgram-2bjd)

## How it's working?

Project is built from two parts deepgram-proxy and deepgram-react

### deepgram-proxy

We need some backend to upload audio file and communicate with deepgram API.

-   deepgram-proxy is a simple nodejs container with express.js to handler API requests.
-   API allow to upload audio a file and return a transcript in return
-   Backend communication to secure API key

### deepgram-react

Simple example how to integrate your react app with the proxy.

### Can I use other frontend?

Yes! You can integrate any other app with the proxy! It's just REST API!

## Run a project

### Get your API key

-   Register deepgram account [https://deepgram.com](https://deepgram.com)
-   Generate API key in deepgram panel, more in docs

### Set your API key

-   Go to deepgram-proxy/.env-example
-   Copy file as .env
-   Set variable DEEPGRAM_API_KEY with your API key

### Run

#### Using docker

In root dir, just execute:

```
docker-compose up -d
```

By default project will be available on ports:

```
http://localhost:3000 -> frontend
http://localhost:8080 -> proxy
```

If you would like to change ports, just edit .env file in root directory:

```
FRONTEND_PORT=3000
FRONTEND_NAME=deepgram-react
PROXY_PORT=8080
PROXY_NAME=deepgram-proxy
```

#### Using local env

First start a proxy

```
# move to proxy folder
cd deepgram-proxy
npm install && npm start
```

next start a frontend

```
# move to frontend folder
cd deepgram-react
npm install && npm start
```

By default project will be available on ports:

```
http://localhost:3000 -> frontend
http://localhost:8080 -> proxy
```
