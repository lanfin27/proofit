// Direct fetch against Notion API — avoids SDK version drift
const NOTION_API_VERSION = '2022-06-28'
const NOTION_API_BASE = 'https://api.notion.com/v1'

export function isNotionConfigured(): boolean {
  const key = process.env.NOTION_API_KEY ?? ''
  const dbId = process.env.NOTION_INSTRUCTOR_DB_ID ?? ''
  return (
    !key.includes('PLACEHOLDER') &&
    !dbId.includes('PLACEHOLDER') &&
    key.length > 0 &&
    dbId.length > 0
  )
}

// ---- Property extractors (flexible — tries multiple property name variations) ----

type NotionProperties = Record<string, unknown>

function getProperty(props: NotionProperties, ...names: string[]): unknown {
  for (const name of names) {
    if (props[name] !== undefined) return props[name]
  }
  return undefined
}

function extractTitle(prop: unknown): string {
  if (!prop || typeof prop !== 'object') return ''
  const p = prop as { title?: Array<{ plain_text?: string }> }
  return p.title?.[0]?.plain_text ?? ''
}

function extractRichText(prop: unknown): string {
  if (!prop || typeof prop !== 'object') return ''
  const p = prop as { rich_text?: Array<{ plain_text?: string }> }
  return p.rich_text?.[0]?.plain_text ?? ''
}

function extractMultiSelect(prop: unknown): string[] {
  if (!prop || typeof prop !== 'object') return []
  const p = prop as { multi_select?: Array<{ name?: string }> }
  return (p.multi_select ?? []).map((i) => i.name ?? '').filter(Boolean)
}

function extractSelect(prop: unknown): string | null {
  if (!prop || typeof prop !== 'object') return null
  const p = prop as { select?: { name?: string } | null }
  return p.select?.name ?? null
}

function extractNumber(prop: unknown): number | null {
  if (!prop || typeof prop !== 'object') return null
  const p = prop as { number?: number | null }
  return p.number ?? null
}

function extractUrl(prop: unknown): string | null {
  if (!prop || typeof prop !== 'object') return null
  const p = prop as { url?: string | null }
  return p.url ?? null
}

function extractCheckbox(prop: unknown): boolean {
  if (!prop || typeof prop !== 'object') return false
  const p = prop as { checkbox?: boolean }
  return p.checkbox ?? false
}

function extractDate(prop: unknown): string | null {
  if (!prop || typeof prop !== 'object') return null
  const p = prop as { date?: { start?: string } | null }
  return p.date?.start ?? null
}

const VERIFIED_STATUS_VALUES = new Set([
  '수익확인완료',
  '수익인증완료',
  '인증완료',
  '확인완료',
])

// ---- Mapped row from Notion ----

export interface NotionInstructorRow {
  notion_id: string
  display_name: string
  main_categories: string[]
  categories: string[]
  platforms: string[]
  course_title: string | null
  course_price: number | null
  course_url: string | null
  youtube_url: string | null
  is_verified: boolean
  verified_at: string | null
  verification_documents: string[]
  info_updated_at: string | null
  status: string | null
}

interface NotionPage {
  id: string
  properties: NotionProperties
}

interface NotionQueryResponse {
  results: NotionPage[]
  has_more: boolean
  next_cursor: string | null
}

export function mapNotionPageToInstructor(page: NotionPage): NotionInstructorRow {
  const props = page.properties

  const status = extractSelect(getProperty(props, '상태', 'Status'))
  const verificationDocs = extractMultiSelect(
    getProperty(props, '확인완료', 'VerifiedDocs', 'Verification')
  )
  const isVerifiedByCheckbox = extractCheckbox(
    getProperty(props, '인증', 'Verified', 'IsVerified')
  )
  const isVerifiedByStatus = status ? VERIFIED_STATUS_VALUES.has(status) : false
  const isVerified =
    isVerifiedByCheckbox || isVerifiedByStatus || verificationDocs.length > 0

  // URL: 노션의 "URL" property는 강의 URL. 유튜브 채널 url은 별도 속성("유튜브")이 있을 때만.
  const courseUrl = extractUrl(
    getProperty(props, 'URL', '강의URL', '강의 URL', 'Url', 'Link')
  )
  const youtubeUrl = extractUrl(
    getProperty(props, '유튜브', 'YouTube', 'Youtube')
  )

  return {
    notion_id: page.id,
    display_name: extractTitle(
      getProperty(props, '강사', 'Instructor', 'Name', 'Title')
    ),
    main_categories: extractMultiSelect(
      getProperty(props, '대카테고리', 'MainCategory', 'MainCategories')
    ),
    categories: extractMultiSelect(
      getProperty(props, '카테고리', 'Category', 'Categories')
    ),
    platforms: extractMultiSelect(
      getProperty(props, '플랫폼', 'Platform', 'Platforms')
    ),
    course_title:
      extractRichText(getProperty(props, '강의명', 'Course', 'CourseTitle')) ||
      null,
    course_price: extractNumber(
      getProperty(props, '강의료', 'Price', 'CoursePrice')
    ),
    course_url: courseUrl,
    youtube_url: youtubeUrl,
    is_verified: isVerified,
    verified_at: extractDate(
      getProperty(props, '최종확인일자', 'VerifiedAt', 'LastVerified')
    ),
    verification_documents: verificationDocs,
    info_updated_at: extractDate(
      getProperty(
        props,
        '정보업데트일자',
        '정보업데이트일자',
        '정보 업데이트일자',
        'InfoUpdatedAt',
        'UpdatedAt'
      )
    ),
    status,
  }
}

// ---- Fetch all instructors from Notion ----

export async function fetchNotionInstructors(): Promise<NotionInstructorRow[]> {
  if (!isNotionConfigured()) return []

  const apiKey = process.env.NOTION_API_KEY!
  const databaseId = process.env.NOTION_INSTRUCTOR_DB_ID!
  const results: NotionInstructorRow[] = []

  try {
    let cursor: string | undefined = undefined
    do {
      const body: Record<string, unknown> = { page_size: 100 }
      if (cursor) body.start_cursor = cursor

      const res = await fetch(
        `${NOTION_API_BASE}/databases/${databaseId}/query`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Notion-Version': NOTION_API_VERSION,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      )

      if (!res.ok) {
        console.error('Notion API error:', res.status, await res.text())
        return results
      }

      const data = (await res.json()) as NotionQueryResponse

      for (const page of data.results) {
        const row = mapNotionPageToInstructor(page)
        if (row.display_name) {
          results.push(row)
        }
      }

      cursor = data.has_more ? data.next_cursor ?? undefined : undefined
    } while (cursor)

    return results
  } catch (e) {
    console.error('Notion fetch error:', e)
    return results
  }
}
