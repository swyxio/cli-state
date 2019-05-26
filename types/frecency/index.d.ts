declare module 'frecency' {
  export default class Frecency<T = any> {
    constructor(constructOpts: {
      key: string;
      idAttribute?: string | Function;
      timeStampsLimit?: number;
      recentSelectionsLimit?: number;
      storageProvider?: object;
      exactQueryMatchWeight?: number;
      subQueryMatchWeight?: number;
      recentSelectionsMatchWeight?: number;
    });
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
