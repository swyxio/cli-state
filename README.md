# CLI-state

> ⚠️this library is totally unstable and incomplete.

This library aims to make it easy to read, persist, and prompt for required settings for CLI's.

Two secondary goals we might not reach but want to consider:

- make caching easy for offline friendly CLI's
- make it easy to store history of inputs for autocompletion support

## Philosophy of CLI state

Here are some sources of CLI config:

- CLI flags (prefer flags over arguments)
- Project Config (e.g. `package.json`, an `rc` file read by [cosmiconfig](https://github.com/davidtheclark/cosmiconfig), or some other special file e.g. `toml`)
- Project Filesystem (eg do you have special folders/files setup)
- Machine/User Config
- _Remote_ user account settings
- _Remote_ team account settings
- _Remote_ global telemetry based defaults

While offline, we may also lean on caches as sources of state:

- Project cache
- Machine/User Cache
- _Cached_ user account settings
- _Cached_ team account settings
- _Cached_ global telemetry based defaults

## Config vs State

We make a (possibly confusing?) distinction between config vs state. Config is static - it is what it is before the CLI starts, and doesn't change. State is dynamic, you can set state during your CLI session and expect it to persist between sessions. If a state is missing, we can prompt for it, and then offer to persist it, or tell the user how to override it in future with a flag.

## API

## TSDX Bootstrap

This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx).
