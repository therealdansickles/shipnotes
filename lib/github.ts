import { Octokit } from '@octokit/rest'
import { subDays } from 'date-fns'

export type GitHubRepo = {
  id: number
  name: string
  full_name: string
  owner: {
    login: string
    avatar_url: string
  }
  description: string | null
  stargazers_count: number
  updated_at: string
  private: boolean
}

export type GitHubCommit = {
  sha: string
  commit: {
    message: string
    author: {
      name?: string
      email?: string
      date?: string
    } | null
  }
  author: {
    login: string
    avatar_url: string
  } | null
}

export function createGitHubClient(accessToken: string) {
  return new Octokit({
    auth: accessToken,
  })
}

export async function getUserRepos(accessToken: string) {
  const octokit = createGitHubClient(accessToken)

  const { data } = await octokit.repos.listForAuthenticatedUser({
    sort: 'updated',
    per_page: 100,
    affiliation: 'owner,collaborator',
  })

  return data as GitHubRepo[]
}

export async function getRepoCommits(
  accessToken: string,
  owner: string,
  repo: string,
  days: number = 30
) {
  const octokit = createGitHubClient(accessToken)
  const since = subDays(new Date(), days).toISOString()

  const { data } = await octokit.repos.listCommits({
    owner,
    repo,
    since,
    per_page: 100,
  })

  // Filter out merge commits and WIP commits
  return data.filter((commit: any) => {
    const message = commit.commit.message.toLowerCase()
    return (
      !message.includes('merge') &&
      !message.includes('wip') &&
      !message.includes('work in progress') &&
      !message.startsWith('merge pull request')
    )
  }) as unknown as GitHubCommit[]
}

export async function getUserProfile(accessToken: string) {
  const octokit = createGitHubClient(accessToken)
  const { data } = await octokit.users.getAuthenticated()
  return data
}

// Parse conventional commit format
export function parseCommitMessage(message: string) {
  const conventionalCommitRegex = /^(feat|fix|docs|style|refactor|perf|test|chore|build|ci)(\(.+\))?: (.+)/
  const match = message.match(conventionalCommitRegex)

  if (match) {
    return {
      type: match[1],
      scope: match[2]?.replace(/[()]/g, ''),
      message: match[3],
      isConventional: true,
    }
  }

  // Try to detect type from keywords
  const messageLower = message.toLowerCase()
  let type = 'chore'

  if (messageLower.includes('fix') || messageLower.includes('bug')) {
    type = 'fix'
  } else if (messageLower.includes('add') || messageLower.includes('implement') || messageLower.includes('create')) {
    type = 'feat'
  } else if (messageLower.includes('update') || messageLower.includes('improve') || messageLower.includes('enhance')) {
    type = 'feat'
  } else if (messageLower.includes('doc')) {
    type = 'docs'
  } else if (messageLower.includes('test')) {
    type = 'test'
  } else if (messageLower.includes('refactor')) {
    type = 'refactor'
  }

  return {
    type,
    scope: null,
    message: message.split('\n')[0], // Get first line only
    isConventional: false,
  }
}

// Group commits by type
export function groupCommitsByType(commits: GitHubCommit[]) {
  const grouped: Record<string, Array<{ sha: string; message: string; author: string }>> = {
    feat: [],
    fix: [],
    docs: [],
    style: [],
    refactor: [],
    perf: [],
    test: [],
    chore: [],
  }

  commits.forEach((commit) => {
    const parsed = parseCommitMessage(commit.commit.message)
    const authorName = commit.author?.login || commit.commit.author?.name || 'Unknown'

    grouped[parsed.type].push({
      sha: commit.sha.substring(0, 7),
      message: parsed.message,
      author: authorName,
    })
  })

  // Remove empty categories
  Object.keys(grouped).forEach((key) => {
    if (grouped[key].length === 0) {
      delete grouped[key]
    }
  })

  return grouped
}
