import * as Conf from 'conf';
import uuidv4 from 'uuid/v4';
import Frecency from 'frecency';
import { LocalStorage } from 'node-localstorage';
import envPaths from 'env-paths';

// https://stackoverflow.com/questions/43481518/get-argument-types-for-function-class-constructor
// type GetConstructorArgs<T> = T extends new (arg1: infer U) => any ? U : never;
// type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
// type ConfOptions = NonNullable<GetConstructorArgs<typeof Conf>>;
// type ConfOptions = GetConstructorArgs<typeof Conf>

/** machine/user level config */
export let globalConfig: Conf;
/** machine/user level frecencystore */
export let accessGlobalFrecency: (key: string) => Frecency;
/** project level config */
export let projectConfig: Conf;

export type initCLIStateArgs = {
  projectConfigPath: string;
  globalConfOptions?: Conf.Options<string>;
  projectConfOptions?: Conf.Options<string>;
};
export const initCLIState = ({
  /** where in your current project do you store your config */
  projectConfigPath,
  globalConfOptions = {},
  projectConfOptions = {},
}: initCLIStateArgs) => {
  // provide some nice defaults for the CLI global settings
  const globalConfigDefaults = {
    /* disable stats from being sent home */
    telemetry: 'enabled',
    /* a unique ID for your CLI user */
    cliId: uuidv4(),
  };
  if (!globalConfOptions.defaults) {
    globalConfOptions = {
      ...globalConfOptions,
      defaults: globalConfigDefaults,
    };
  }
  globalConfig = new Conf.default<string>(globalConfOptions);

  // frecency
  if (globalConfig instanceof Conf.default) {
    const { _options: options } = globalConfig as typeof globalConfig & {
      _options: { projectName: string };
    };
    const storageProviderFrecencyFilePath = envPaths(options.projectName).cache; // store frecency in cache, it is disposable
    const storageProvider = new LocalStorage(storageProviderFrecencyFilePath);
    accessGlobalFrecency = key =>
      new Frecency({
        key,
        storageProvider,
        // exactQueryMatchWeight: 1.9, // default to 1.0
        // subQueryMatchWeight: 0.5, // default to 0.7
        // recentSelectionsMatchWeight: 0.1, // default to 0.5
      });
  }

  // scope projectConfOptions to cwd
  projectConfig = new Conf.default({
    ...projectConfOptions,
    cwd: projectConfigPath,
  });
  return {
    globalConfig,
    projectConfig,
    accessGlobalFrecency,
  };
};
