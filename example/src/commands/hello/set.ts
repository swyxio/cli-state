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
    globalConfig.set('name', undefined);
    console.log(globalConfig.path);
    projectConfig.set('name', name);
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`);
    }
  }
}
