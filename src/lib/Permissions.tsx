interface IRoles {
  User: string;
  Editor: string;
  Admin: string;
}

interface IScopes {
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
  User: "USER",
  Editor: "EDITOR",
  Admin: "ADMIN",
};

const SCOPES: IScopes = {
  canRead: "can-read",
  canWrite: "can-write",
  canExecute: "can-execute",
};

export const PERMISSION = {
  [ROLES.User]: [SCOPES.canRead],
  [ROLES.Editor]: [SCOPES.canRead, SCOPES.canWrite],
  [ROLES.Admin]: [SCOPES.canRead, SCOPES.canWrite, SCOPES.canExecute],
};

const PermissionWrapper = () => <></>;

export default PermissionWrapper;
