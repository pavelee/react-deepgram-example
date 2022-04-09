# React Deepgram example, AI speech transcription to improve accessibility

-   [What's that?](#whats-that)
-   [Deepgram?](#deepgram)
-   [Why?](#why)
-   [How it's working?](#How-its-working)
    -   [deepgram-proxy](#deepgram-proxy)
    -   [deepgram-react](#deepgram-react)
-   [Run a project](#run-a-project)
    -   [get your API key](#get-your-API-key)
    -   [set your API key](#set-your-API-key)
    -   [run using docker](#run-using-docker)

## What's that?

It's example of integration deepgram using react.

## Deepgram?

Deepgram is external service to transcript speech from audio! (using AI or other crazy stuff!)

Read more here: [https://deepgram.com](https://deepgram.com)

## Why?

Project was made as submission to DEV hackathlon, read more [here](https://dev.to/devteam/join-us-for-a-new-kind-of-hackathon-on-dev-brought-to-you-by-deepgram-2bjd)

## How it's working?

Project is built from two parts deepgram-proxy and deepgram-react

### deepgram-proxy

We need some backend to upload audio file and communicate with deepgram API. 

-   deepgram-proxy is a simple nodejs container with express.js to handler API requests.
-   API allow to upload audio file and return transcript in return
-   Backend communication with deepgram to secure API key

### deepgram-react

Simple example how to integrate your react app with proxy.

## Run a project

### get your API key

- Register deepgram account [https://deepgram.com](https://deepgram.com)
- Generate API key in deepgram panel, more in docs

### set your API key

- Go to deepgram-proxy/.env-example
- Copy file as .env
- Set variable DEEPGRAM_API_KEY with your API key

### run using docker

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
