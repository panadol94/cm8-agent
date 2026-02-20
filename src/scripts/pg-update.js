const { Client } = require('pg')

async function patchPromo() {
  const client = new Client({
    connectionString: 'postgres://postgres:postgres123@127.0.0.1:5432/cm8',
  })

  await client.connect()
  console.log('Connected to DB')

  try {
    const res = await client.query(
      `SELECT id, title, items FROM promos WHERE title = 'Agent Commission' LIMIT 1;`,
    )

    if (res.rows.length === 0) {
      console.log('No promo found with title Agent Commission')

      // Dump all promos just to see what titles exist
      const allPromos = await client.query('SELECT id, title, items FROM promos;')
      console.log('Available Promos:', JSON.stringify(allPromos.rows, null, 2))
      return
    }

    const promo = res.rows[0]
    console.log('Found promo:', promo.title)

    // Items might be JSON/JSONB
    let items = promo.items
    if (typeof items === 'string') {
      items = JSON.parse(items)
    }

    let updated = false
    const newItems = items.map((item) => {
      if (item.text && item.text.includes('45%')) {
        item.text = item.text.replace('45%', '90%')
        updated = true
      }
      return item
    })

    if (updated) {
      await client.query(`UPDATE promos SET items = $1 WHERE id = $2`, [
        JSON.stringify(newItems),
        promo.id,
      ])
      console.log('Successfully updated 45% -> 90% in DB!')
    } else {
      console.log('45% not found in the items.')
      console.log('Current items:', JSON.stringify(items, null, 2))
    }
  } catch (err) {
    console.error('DB Error:', err)
  } finally {
    await client.end()
  }
}

patchPromo()
