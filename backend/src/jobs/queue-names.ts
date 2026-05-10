export const QUEUE_NAMES = {
  notifications: 'notifications',
  payments: 'payments',
  settlements: 'settlements',
  sync: 'sync',
  operations: 'operations',
  risk: 'risk',
  reports: 'reports',
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];
