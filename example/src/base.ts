import Command from '@oclif/command';
import { initCLIState } from 'cli-state';

export default abstract class extends Command {
  async init() {
    // do some initialization
    initCLIState({ projectStatePath: '.exampleCLI' });
  }
}
