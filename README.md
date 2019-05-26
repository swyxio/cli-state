# CLI-state

> ⚠️this library is totally unstable and incomplete.

This library aims to make it easy to read, persist, and prompt for required settings for CLI's.

Two secondary goals we might not reach but want to consider:

- make caching easy for offline friendly CLI's
- make it easy to store history of inputs for autocompletion support or suggestion of what user should do next

<details><summary>

## High Level Philosophy of CLI state

</summary>

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

**Config vs State**

We make a (possibly confusing?) distinction between config vs state. Config is static - it is what it is before the CLI starts, and doesn't change. State is dynamic, you can set state during your CLI session and expect it to persist between sessions. If a state is missing, we can prompt for it, and then offer to persist it, or tell the user how to override it in future with a flag.

</details>

## Getting Started

For maximum context, these examples will show how to integrate `cli-state` with [oclif](https://oclif.io/).

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

Then we are free to read and write to and from our configs wherever we want:

```ts
// src/commands/hello.ts
import { flags } from '@oclif/command';
import BaseCommand from '../../base';
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
    file: flags.string({ description: 'file for writing' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' }),
  };

  static args = [{ name: 'file' }];

  async run() {
    const { args, flags } = this.parse(Hello);
    const name = flags.name || 'world';
    this.log(`hello ${name} from ./src/commands/hello.ts`);
    globalConfig.set('name', name);
    const type = globalConfig.get('name');
    console.log(type, typeof type); // types are preserved after deserialization
    console.log(globalConfig.path); // where the globalconfig is stored
    projectConfig.set('name'); // same thing for project config
  }
}
```

## Exported API

`cli-state` is really a thin wrapper over a few libraries. Here is the public API (there are no default exports):

## `initCLIState`

```ts
initCLIState({
  projectConfigPath: string;
  globalConfOptions?: Conf.Options<ConfigTypes>;
  projectConfOptions?: Conf.Options<ConfigTypes>;
  frecencyOpts?: {
    idAttribute?: string | idAttrFn;
    timeStampsLimit?: number;
    recentSelectionsLimit?: number;
    exactQueryMatchWeight?: number;
    subQueryMatchWeight?: number;
    recentSelectionsMatchWeight?: number;
  };
})
```

This must be run before any of the other functions.

Only `projectConfigPath` is mandatory, and should reflect where you want your project config stored, e.g. in a `.netlify` folder.

Both `globalConfOptions` and `projectConfOptions` take the same options as https://github.com/sindresorhus/conf, which you can [see here](https://github.com/sindresorhus/conf#confoptions). In particular you may wish to define a schema. We tweak the options slightly: `globalConfOptions` sets a `telemetry` flag and a unique `cliId` by default, and `projectConfOptions` overrides conf's `cwd` to make the file project specific.

`frecencyOpts` take from https://github.com/mixmaxhq/frecency except `key` and `storageProvider` have been omitted. You set `key` later and `storageProvider` will be set for you. By default, we have made the `idAttribute` be `"value"` instead of `"_id"`, since that is far more common for CLI prompting. but you can override this.

## `globalConfig` and `projectConfig`

These two objects have the entire public instance API of https://github.com/sindresorhus/conf. You can view them here: https://github.com/sindresorhus/conf#instance, in particular `.get`, `.set`, and `.store`.

These are singletons for the life of your CLI.

## `accessGlobalFrecency`

`accessGlobalFrecency: (key: string) => Frecency;`

This function takes a key and creates a [Frecency](https://github.com/mixmaxhq/frecency) object, which is stored in the [user's default/specified cache folder according to `env-paths`](https://github.com/sindresorhus/env-paths#pathscache). This is explicitly meant for recording and sorting prompt inputs, for example Autocompletes, to help learn from usage.

You can create as many as you like, as long as your keys are unique. Remember we overrode the default `idAttribute` to `value` instead of `_id`, but if you want to override it further, pass `frecencyOpts.idAttribute` during initialization.

The frecency docs aren't great so here is a working example.

```ts
const freq = accessGlobalFrecency('country');
const choices = freq.sort({
  results: ['apple', 'banana', 'pear', 'orange', 'pineapple'].map(normalize),
  // keepScores: true,
});
const question = {
  type: 'autocomplete',
  name: 'fruits',
  message: 'Where to?',
  limit: 5,
  suggest(input: string, choices: Choice[]) {
    const list = choices.filter(caseInsensitiveFilter(input));
    return freq.sort({ searchQuery: input, results: list });
  },
  choices,
};

let { fruits } = await prompt(question);
const tosave = { searchQuery: fruits, selectedId: fruits };
freq.save(tosave);
console.log({ fruits });

// helper functions defined
type Choice = { value: string; message: string; name: string };

function normalize(foo: string) {
  return { value: foo, message: foo, name: foo };
}
function caseInsensitiveFilter(input: string) {
  return (choice: Choice) =>
    choice.message.toLowerCase().startsWith(input.toLowerCase());
}
```

## TSDX Bootstrap

This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx).
