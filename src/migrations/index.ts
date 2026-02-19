import * as migration_20260218_210843_add_scanner_config_fields from './20260218_210843_add_scanner_config_fields'
import * as migration_20260219_125603_add_missing_site_settings_columns from './20260219_125603_add_missing_site_settings_columns'
import * as migration_20260220_020800_add_banner_image_url from './20260220_020800_add_banner_image_url'

export const migrations = [
  {
    up: migration_20260218_210843_add_scanner_config_fields.up,
    down: migration_20260218_210843_add_scanner_config_fields.down,
    name: '20260218_210843_add_scanner_config_fields',
  },
  {
    up: migration_20260219_125603_add_missing_site_settings_columns.up,
    down: migration_20260219_125603_add_missing_site_settings_columns.down,
    name: '20260219_125603_add_missing_site_settings_columns',
  },
  {
    up: migration_20260220_020800_add_banner_image_url.up,
    down: migration_20260220_020800_add_banner_image_url.down,
    name: '20260220_020800_add_banner_image_url',
  },
]
