import { flags } from '@oclif/command';
import BaseCommand from '../../base';
import { globalConfig, projectConfig, accessGlobalFrecency } from 'cli-state';
import { prompt } from 'enquirer';
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
    const type = globalConfig.get('name');
    console.log(type, typeof type);
    console.log(globalConfig.path);
    projectConfig.get('name');

    const freq = accessGlobalFrecency('country');
    const choices = freq.sort({
      results: ['apple', 'banana', 'pear', 'orange', 'pineapple'].map(
        normalize
      ),
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
  }
}
type Choice = { value: string; message: string; name: string; hint: string };

function normalize(foo: string) {
  return {
    value: foo,
    message: foo + 'msg',
    name: foo + 'name',
    hint: foo + 'secret',
  };
}
function caseInsensitiveFilter(input: string) {
  return (choice: Choice) => {
    const msg = choice.message.toLowerCase();
    const hint = choice.hint ? choice.hint.toLowerCase() : '';
    return (msg + hint).includes(input.toLowerCase());
  };
}
