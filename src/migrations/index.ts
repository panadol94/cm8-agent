import * as migration_20260222_163527_add_mobile_banner_size from './20260222_163527_add_mobile_banner_size';

export const migrations = [
  {
    up: migration_20260222_163527_add_mobile_banner_size.up,
    down: migration_20260222_163527_add_mobile_banner_size.down,
    name: '20260222_163527_add_mobile_banner_size'
  },
];
