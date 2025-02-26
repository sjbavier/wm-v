export const enum VERBOSITY {
  SILENT = 'silent',
  NORMAL = 'normal',
  VERBOSE = 'verbose'
}

export const enum AUTH_ACTION {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  FETCHING = 'FETCHING',
  ERROR = 'ERROR'
}
// ***
// ***
// Authorization
// ***
// ***

export interface IRoles {
  User: string;
  Editor: string;
  Admin: string;
}
export interface IScopes {
  canRead: string;
  canWrite: string;
  canExecute: string;
}

// interface IPermission {
//   USER: string[];
//   EDITOR: string[];
//   ADMIN: string[];
// }

const ROLES: IRoles = {
  User: 'USER',
  Editor: 'EDITOR',
  Admin: 'ADMIN'
};

const SCOPES: IScopes = {
  canRead: 'can-read',
  canWrite: 'can-write',
  canExecute: 'can-execute'
};

export const PERMISSION = {
  [ROLES.User]: [SCOPES.canRead],
  [ROLES.Editor]: [SCOPES.canRead, SCOPES.canWrite],
  [ROLES.Admin]: [SCOPES.canRead, SCOPES.canWrite, SCOPES.canExecute]
};

export const enum Layout {
  GRID = 'Grid',
  ROW = 'Row'
}
