[![License: AGPL v3](https://img.shields.io/github/license/tstibbs/smart-home-integration?color=blue)](LICENSE)
[![Build Status](https://github.com/tstibbs/smart-home-integration/workflows/CI/badge.svg)](https://github.com/tstibbs/smart-home-integration/actions?query=workflow%3ACI)
[![GitHub issues](https://img.shields.io/github/issues/tstibbs/smart-home-integration.svg)](https://github.com/tstibbs/smart-home-integration/issues)

# What is this?

Collection of functions that provide integration with smart home stuff.

# Integrations

So far, the only integration is some minimal integration with a blink home camera setup. Thanks to https://github.com/MattTW/BlinkMonitorProtocol for the detailed API guide.

## Blink

```
curl -XPOST "https://<id>.execute-api.<region>.amazonaws.com/prod/blinkCheckAllArmed" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "<email adress here>",
    "password": "<password here>"
}'
```

```
curl -XPOST "https://<id>.execute-api.<region>.amazonaws.com/prod/blinkGetTemperature" \
  -H "Content-Type: application/json" \
  -d '{
    "cameras": [
        "<NameOfCamera1>",
        "<NameOfCamera2>"
    ],
    "email": "<email adress here>",
    "password": "<password here>"
}'
```

# Contributing

PRs are very welcome, but for any big changes or new features please open an issue to discuss first.
