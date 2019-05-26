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

## Getting Started

For maximum context, these examples will show how to integrate `cli-state` with oclif.

We start with a [custom base command](https://oclif.io/docs/base_class):

```ts
// src/base.ts
import Command from '@oclif/command';
import { initCLIState } from 'cli-state';

export default abstract class extends Command {
  async init() {
    // do some initialization
    initCLIState({ projectConfigPath: '.exampleCLI' });
  }
}
```

this makes sure we initialize our CLI state with the basic settings we want every time we run a command.

```ts
// src/commands/hello.ts
import { flags } from '@oclif/command';
import BaseCommand from '../base';
import { globalConfig, projectConfig } from 'cli-state';

export default class Hello extends BaseCommand {
  static description = 'describe the command here';

  static examples = [
    `$ example hello
hello world from ./src/hello.ts!
`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' }),
  };

  static args = [{ name: 'file' }];

  async run() {
    const { args, flags } = this.parse(Hello);

    const name = flags.name || 'world';
    this.log(`hello ${name} from ./src/commands/hello.ts`);
    globalConfig.set('name', name);
    console.log(globalConfig.path);
    projectConfig.set('name', name);
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`);
    }
  }
}
```

## TSDX Bootstrap

This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx).
