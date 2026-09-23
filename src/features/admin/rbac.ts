export const adminRoles = [
  'master',
  'engineering',
  'customer_experience',
  'director',
  'finance',
  'product',
] as const;

export type AdminRole = (typeof adminRoles)[number];

export const adminPermissions = [
  'admins.read',
  'admins.manage',
  'audit.read',
  'users.read',
  'users.suspend',
  'users.delete',
  'users.credentials.reset',
  'users.sessions.revoke',
  'users.impersonate',
  'billing.read',
  'billing.manage',
  'legal.read',
  'legal.manage',
  'features.read',
  'features.manage',
  'guidance.read',
  'guidance.manage',
  'communications.read',
  'communications.manage',
  'api.read',
  'api.manage',
  'maintenance.manage',
  'observability.read',
] as const;

export type AdminPermission = (typeof adminPermissions)[number];

const allPermissions = new Set<AdminPermission>(adminPermissions);

export const rolePermissions: Record<AdminRole, ReadonlySet<AdminPermission>> = {
  master: allPermissions,
  engineering: new Set([
    'admins.read', 'audit.read', 'users.read', 'users.sessions.revoke',
    'features.read', 'features.manage', 'guidance.read', 'guidance.manage', 'communications.read', 'communications.manage', 'api.read', 'api.manage', 'legal.read', 'legal.manage', 'maintenance.manage', 'observability.read',
  ]),
  customer_experience: new Set([
    'users.read', 'users.suspend', 'users.credentials.reset',
    'users.sessions.revoke', 'users.impersonate', 'communications.read', 'guidance.read',
  ]),
  director: new Set([
    'admins.read', 'audit.read', 'users.read', 'billing.read',
    'features.read', 'guidance.read', 'communications.read', 'api.read', 'legal.read', 'observability.read',
  ]),
  finance: new Set(['users.read', 'billing.read', 'billing.manage']),
  product: new Set(['users.read', 'features.read', 'features.manage', 'guidance.read', 'guidance.manage', 'communications.read', 'communications.manage', 'api.read', 'api.manage', 'legal.read', 'legal.manage', 'observability.read']),
};

export const adminRoleLabels: Record<AdminRole, string> = {
  master: 'Master Admin',
  engineering: 'Engenharia',
  customer_experience: 'Customer Experience',
  director: 'Diretoria',
  finance: 'Financeiro',
  product: 'Produto',
};

export function hasAdminPermission(role: AdminRole, permission: AdminPermission) {
  return rolePermissions[role].has(permission);
}

export function isAdminRole(value: unknown): value is AdminRole {
  return typeof value === 'string' && adminRoles.includes(value as AdminRole);
}
