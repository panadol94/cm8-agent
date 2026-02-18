import * as migration_20260218_210843_add_scanner_config_fields from './20260218_210843_add_scanner_config_fields';

export const migrations = [
  {
    up: migration_20260218_210843_add_scanner_config_fields.up,
    down: migration_20260218_210843_add_scanner_config_fields.down,
    name: '20260218_210843_add_scanner_config_fields'
  },
];
