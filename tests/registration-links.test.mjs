import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import { CM8_REGISTER_URL, resolveCm8RegistrationLink } from '../src/lib/registration-links.ts'

const expected = 'https://masuk10.com/Cm8'

test('registration URL preserves the exact requested short-link and case', () => {
  assert.equal(CM8_REGISTER_URL, expected)
  assert.equal(resolveCm8RegistrationLink(expected), expected)
})

test('empty CMS registration links use the shared registration URL', () => {
  for (const value of [undefined, null, '', '   ']) {
    assert.equal(resolveCm8RegistrationLink(value), expected)
  }
})

test('legacy CM8 referral domains resolve to the shared registration URL', () => {
  for (const host of ['cm8play.com', 'cm8ong.com', 'cm8asia.com', 'cm8huat.com', 'cm8huat1.com']) {
    for (const url of [
      `https://${host}/r/luckyhorse879`,
      `http://www.${host}/r/luckyhorse879/`,
      `https://${host.toUpperCase()}/r/luckyhorse879?campaign=promo#register`,
    ]) {
      assert.equal(resolveCm8RegistrationLink(url), expected, url)
    }
  }
})

test('support, agent, community, internal navigation and unrelated links are preserved', () => {
  for (const url of [
    'https://masuk10.com/Wasapvvipcs',
    'https://masuk10.com/Televvipcs',
    'https://wasap.my/60172722902',
    'https://t.me/cm8winratebot',
    'https://whatsapp.com/channel/0029Vb7cSULCxoAtcGaunK37',
    'https://www.facebook.com/share/1CU7wLGg8n/',
    '/agent-judi',
    '/patch-id',
    'https://cm8ong.com/support',
    'https://cm8ong.com.evil.example/r/luckyhorse879',
    'https://cm8ong.com@evil.example/r/luckyhorse879',
    'https://example.com/r/luckyhorse879',
    'https://masuk10.com/cm8',
    'not-a-url',
  ]) {
    assert.equal(resolveCm8RegistrationLink(url), url, url)
  }
})

test('no stale hardcoded CM8 referral URLs remain in application source', () => {
  const source = new URL('../src/', import.meta.url)
  const stale = []
  function scan(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name)
      if (entry.isDirectory()) scan(path)
      else if (/\.(?:[cm]?js|tsx?)$/.test(path)) {
        const text = readFileSync(path, 'utf8')
        if (/https?:\/\/(?:www\.)?cm8(?:play|ong|asia|huat\d*)\.com\/r\//i.test(text)) stale.push(path)
      }
    }
  }
  scan(source.pathname)
  assert.deepEqual(stale, [])
})

test('CMS-driven home registration, banner and promo links are normalized', () => {
  const home = readFileSync(new URL('../src/app/(frontend)/page.tsx', import.meta.url), 'utf8')
  assert.match(home, /resolveCm8RegistrationLink\(ss\?\.ctaButton2Link\)/)
  assert.match(home, /resolveCm8RegistrationLink\(b\.link\)/)
  assert.match(home, /resolveCm8RegistrationLink\(correctedCtaLink\)/)
  const settings = readFileSync(new URL('../src/globals/SiteSettings.ts', import.meta.url), 'utf8')
  assert.match(settings, /name: 'ctaButton2Link'[\s\S]*?defaultValue: CM8_REGISTER_URL/)
})
