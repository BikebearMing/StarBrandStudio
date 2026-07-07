import * as migration_20260630_030843_baseline from './20260630_030843_baseline';
import * as migration_20260707_064413 from './20260707_064413';

export const migrations = [
  {
    up: migration_20260630_030843_baseline.up,
    down: migration_20260630_030843_baseline.down,
    name: '20260630_030843_baseline',
  },
  {
    up: migration_20260707_064413.up,
    down: migration_20260707_064413.down,
    name: '20260707_064413'
  },
];
