# example

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/example.svg)](https://npmjs.org/package/example)
[![Downloads/week](https://img.shields.io/npm/dw/example.svg)](https://npmjs.org/package/example)
[![License](https://img.shields.io/npm/l/example.svg)](https://github.com/cli-state/example/blob/master/package.json)

<!-- toc -->

- [Usage](#usage)
- [Commands](#commands)
  <!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g example
$ example COMMAND
running command...
$ example (-v|--version|version)
example/0.0.0 darwin-x64 node-v10.13.0
$ example --help [COMMAND]
USAGE
  $ example COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`example hello [FILE]`](#example-hello-file)
- [`example help [COMMAND]`](#example-help-command)

## `example hello [FILE]`

describe the command here

```
USAGE
  $ example hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ example hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/cli-state/example/blob/v0.0.0/src/commands/hello.ts)_

## `example help [COMMAND]`

display help for example

```
USAGE
  $ example help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_

<!-- commandsstop -->
