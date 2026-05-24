export type MissionType = 'Debug' | 'Refactor' | 'Test Writer' | 'Explain'
export type Rank = 'Novice' | 'Apprentice' | 'Debugger' | 'Sensei' | 'Grandmaster'

export interface DojoState {
  username: string
  rank: Rank
  level: number
  xp: number
  streak: number
  solved: number
  judged: number
  mentorChats: number
  achievements: string[]
  history: { id: string; type: string; title: string; xp: number; at: number }[]
}

export interface Mission {
  id: string
  type: MissionType
  difficulty: 'Easy' | 'Medium' | 'Hard'
  theme: string
  title: string
  prompt: string
  starterCode: string
  expectedFocus: string[]
}

export const MISSION_TYPES: MissionType[] = ['Debug', 'Refactor', 'Test Writer', 'Explain']

export function defaultState(): DojoState {
  return { username: '', rank: 'Novice', level: 1, xp: 0, streak: 1, solved: 0, judged: 0, mentorChats: 0, achievements: [], history: [] }
}

export function loadState(): DojoState {
  if (typeof window === 'undefined') return defaultState()
  try {
    const raw = localStorage.getItem('debugdojo_state')
    return raw ? { ...defaultState(), ...JSON.parse(raw) } : defaultState()
  } catch { return defaultState() }
}

export function saveState(state: DojoState) {
  if (typeof window !== 'undefined') localStorage.setItem('debugdojo_state', JSON.stringify(state))
}

export function getRank(level: number): Rank {
  if (level >= 30) return 'Grandmaster'
  if (level >= 20) return 'Sensei'
  if (level >= 10) return 'Debugger'
  if (level >= 5) return 'Apprentice'
  return 'Novice'
}

export function awardXP(state: DojoState, amount: number, title: string, type: string): DojoState {
  const next = { ...state, xp: state.xp + amount, history: [{ id: crypto.randomUUID(), type, title, xp: amount, at: Date.now() }, ...state.history].slice(0, 20) }
  while (next.xp >= next.level * 100) {
    next.xp -= next.level * 100
    next.level += 1
  }
  next.rank = getRank(next.level)
  const achievements = new Set(next.achievements)
  if (next.solved >= 1) achievements.add('First Fix')
  if (next.judged >= 3) achievements.add('AI Reviewed')
  if (next.level >= 5) achievements.add('Apprentice Debugger')
  if (next.mentorChats >= 5) achievements.add('Mentor Bond')
  next.achievements = Array.from(achievements)
  return next
}

export function fallbackMission(type: MissionType, level: number): Mission {
  const difficulty = level < 5 ? 'Easy' : level < 12 ? 'Medium' : 'Hard'
  return {
    id: crypto.randomUUID(),
    type,
    difficulty,
    theme: 'cyber dojo',
    title: `${type} Mission: The Missing Edge Case`,
    prompt: 'A production helper works for happy paths but fails under an edge case. Identify the bug, explain why it happens, and propose a safe fix.',
    starterCode: `function normalizeUser(input) {\n  return input.name.trim().toLowerCase();\n}\n\nconsole.log(normalizeUser({ name: ' Ada ' }));`,
    expectedFocus: ['null safety', 'input validation', 'clear explanation'],
  }
}
