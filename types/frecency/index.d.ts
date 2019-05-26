declare module 'frecency' {
  export type idAttrFn = (result: string) => string;
  export type frecencyOpts = {
    key: string;
    idAttribute?: string | idAttrFn;
    timeStampsLimit?: number;
    recentSelectionsLimit?: number;
    storageProvider?: object;
    exactQueryMatchWeight?: number;
    subQueryMatchWeight?: number;
    recentSelectionsMatchWeight?: number;
  };
  export default class Frecency<T = any> {
    constructor(constructOpts: frecencyOpts);
    save: (arg: { searchQuery: T; selectedId: string }) => void;
    sort:
      | ((arg: { searchQuery: T; searchResults: T[] }) => T[])
      | ((arg: {
          searchQuery: T;
          searchResults: T[];
          keepScores?: boolean;
        }) => (T & { _frecencyScore?: number })[]);
  }
}
