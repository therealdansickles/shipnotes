import { GitHubCommit, groupCommitsByType } from './github'
import { rewriteChangelogWithAI } from './openai'
import { logger } from './logger'

// Type labels for better formatting
const typeLabels: Record<string, string> = {
  feat: '✨ Features',
  fix: '🐛 Bug Fixes',
  docs: '📚 Documentation',
  style: '💄 Styling',
  refactor: '♻️ Refactoring',
  perf: '⚡ Performance',
  test: '✅ Tests',
  chore: '🔧 Chores',
}

export function generateTechnicalChangelog(commits: GitHubCommit[]): string {
  if (commits.length === 0) {
    return '# Changelog\n\nNo commits found for the selected period.'
  }

  const grouped = groupCommitsByType(commits)
  let changelog = '# Changelog\n\n'

  // Sort by priority: feat, fix, others
  const priority = ['feat', 'fix', 'perf', 'refactor', 'docs', 'style', 'test', 'chore']
  const sortedTypes = Object.keys(grouped).sort((a, b) => {
    return priority.indexOf(a) - priority.indexOf(b)
  })

  sortedTypes.forEach((type) => {
    const commits = grouped[type]
    if (commits.length === 0) return

    changelog += `## ${typeLabels[type] || type.toUpperCase()}\n\n`

    commits.forEach((commit) => {
      changelog += `- ${commit.message} ([${commit.sha}])\n`
    })

    changelog += '\n'
  })

  return changelog.trim()
}

export async function generateUserFriendlyChangelog(
  commits: GitHubCommit[]
): Promise<string> {
  if (commits.length === 0) {
    return '# What\'s New\n\nNo updates for the selected period.'
  }

  const technicalChangelog = generateTechnicalChangelog(commits)

  try {
    const userFriendly = await rewriteChangelogWithAI(technicalChangelog)
    return userFriendly
  } catch (error) {
    logger.error('Failed to generate AI-powered changelog, falling back to technical version', error)
    // Fallback to technical changelog if AI fails
    return technicalChangelog
  }
}

export function generateChangelogSummary(commits: GitHubCommit[]): string {
  const grouped = groupCommitsByType(commits)

  const featCount = grouped.feat?.length || 0
  const fixCount = grouped.fix?.length || 0
  const otherCount = commits.length - featCount - fixCount

  const parts = []
  if (featCount > 0) parts.push(`${featCount} new feature${featCount > 1 ? 's' : ''}`)
  if (fixCount > 0) parts.push(`${fixCount} bug fix${fixCount > 1 ? 'es' : ''}`)
  if (otherCount > 0) parts.push(`${otherCount} other change${otherCount > 1 ? 's' : ''}`)

  return parts.join(', ')
}

// Export changelog as different formats
export function exportAsMarkdown(changelog: string): string {
  return changelog
}

export function exportAsHTML(changelog: string): string {
  // Simple markdown to HTML conversion
  let html = changelog
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')

  // Wrap lists - match consecutive li tags
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')

  return `<div class="changelog">${html}</div>`
}

export function exportAsPlainText(changelog: string): string {
  // Remove markdown formatting
  return changelog
    .replace(/^#+\s/gm, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/[*_]/g, '')
}
