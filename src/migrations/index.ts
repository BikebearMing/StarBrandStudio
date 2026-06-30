import * as migration_20260630_030843_baseline from './20260630_030843_baseline';

export const migrations = [
  {
    up: migration_20260630_030843_baseline.up,
    down: migration_20260630_030843_baseline.down,
    name: '20260630_030843_baseline'
  },
];
