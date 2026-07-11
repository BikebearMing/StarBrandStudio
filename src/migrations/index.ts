import * as migration_20260630_030843_baseline from './20260630_030843_baseline';
import * as migration_20260707_064413 from './20260707_064413';
import * as migration_20260711_061855_hover_image from './20260711_061855_hover_image';

export const migrations = [
  {
    up: migration_20260630_030843_baseline.up,
    down: migration_20260630_030843_baseline.down,
    name: '20260630_030843_baseline',
  },
  {
    up: migration_20260707_064413.up,
    down: migration_20260707_064413.down,
    name: '20260707_064413',
  },
  {
    up: migration_20260711_061855_hover_image.up,
    down: migration_20260711_061855_hover_image.down,
    name: '20260711_061855_hover_image'
  },
];
