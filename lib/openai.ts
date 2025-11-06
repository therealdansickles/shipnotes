import OpenAI from 'openai'

let openaiInstance: OpenAI | null = null

function getOpenAI() {
  if (!openaiInstance) {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    openaiInstance = new OpenAI({ apiKey })
  }
  return openaiInstance
}

export async function rewriteChangelogWithAI(technicalChangelog: string): Promise<string> {
  const prompt = `You are a professional technical writer. Rewrite this technical changelog into user-friendly release notes.

Technical changelog:
${technicalChangelog}

Instructions:
1. Group changes into these categories: "✨ New Features", "🐛 Bug Fixes", "🎨 Improvements", "📚 Documentation"
2. Rewrite technical commit messages into clear, user-friendly language
3. Remove technical jargon and implementation details
4. Make it exciting but accurate - focus on the benefit to users
5. Keep it concise - one line per change
6. Don't include commit hashes
7. Skip trivial changes like formatting or minor refactors
8. Use emojis for visual appeal

Return ONLY the formatted changelog, no additional commentary.`

  const openai = getOpenAI()
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a professional technical writer who excels at turning technical jargon into clear, user-friendly language.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  })

  return response.choices[0].message.content || ''
}

export async function categorizeCommit(commitMessage: string): Promise<string> {
  const prompt = `Categorize this Git commit message into one of these types: feat, fix, docs, style, refactor, perf, test, or chore.

Commit message: "${commitMessage}"

Return ONLY the type (one word), nothing else.`

  const openai = getOpenAI()
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.3,
    max_tokens: 10,
  })

  return response.choices[0].message.content?.trim().toLowerCase() || 'chore'
}
