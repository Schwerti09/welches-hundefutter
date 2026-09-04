import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export const runtime = 'nodejs'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const dbUrl = process.env.DATABASE_URL
  if (dbUrl) {
    try {
      const sql = neon(dbUrl)
      const rows = await sql`
        SELECT affiliate_url FROM dog_foods WHERE slug = ${slug} LIMIT 1
      `
      if (rows[0]?.affiliate_url) {
        // Click-Tracking (non-blocking) — First-Party-Events (Roadmap 5.3)
        const referer = req.headers.get('referer') ?? ''
        sql`INSERT INTO events (name, path, ref, props)
            VALUES ('affiliate_click', ${`/empfehlung/${slug}`}, ${referer || null}, ${JSON.stringify({ slug })}::jsonb)
        `.catch(() => {})

        return NextResponse.redirect(rows[0].affiliate_url as string, { status: 302 })
      }
    } catch { /* DB nicht verfügbar — Fallback */ }
  }

  // Fallback-URLs wenn DB leer/nicht erreichbar
  const fallback: Record<string, string> = {
    'anifit-adult':         'https://www.awin1.com/cread.php?awinmid=XXXXX&awinaffid=XXXXX&ued=https://www.anifit.de',
    'wolfsblut-wild-duck':  'https://www.awin1.com/cread.php?awinmid=XXXXX&awinaffid=XXXXX&ued=https://www.wolfsblut.com',
    'futalis-individuell':  'https://www.awin1.com/cread.php?awinmid=XXXXX&awinaffid=XXXXX&ued=https://www.futalis.de',
    'terra-canis':          'https://www.awin1.com/cread.php?awinmid=XXXXX&awinaffid=XXXXX&ued=https://www.terra-canis.de',
    'josera-festival':      'https://www.awin1.com/cread.php?awinmid=XXXXX&awinaffid=XXXXX&ued=https://www.josera.de',
    'bellfor-allergiker':   'https://www.awin1.com/cread.php?awinmid=XXXXX&awinaffid=XXXXX&ued=https://www.bellfor.de',
    'mera-pure-sensitive':  'https://www.awin1.com/cread.php?awinmid=XXXXX&awinaffid=XXXXX&ued=https://www.mera-petfood.com',
  }

  const url = fallback[slug]
  if (url) return NextResponse.redirect(url, { status: 302 })

  return NextResponse.redirect(new URL('/', req.url), { status: 302 })
}
