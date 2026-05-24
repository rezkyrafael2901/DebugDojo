'use client'

import { useEffect, useMemo, useState } from 'react'
import { DojoState, Mission, MissionType, MISSION_TYPES, awardXP, defaultState, fallbackMission, loadState, saveState } from '@/lib/dojo'

const THEMES = ['haunted deployment', 'robot kitchen', 'lunar base', 'neon marketplace', 'pirate API', 'dragon database', 'arcade leaderboard', 'quantum calendar']

function parseSSEChunk(line: string) {
  if (!line.startsWith('data: ')) return ''
  const data = line.slice(6).trim()
  if (!data || data === '[DONE]') return ''
  try {
    const json = JSON.parse(data)
    return json.choices?.[0]?.delta?.content || json.choices?.[0]?.delta?.reasoning_content || ''
  } catch { return '' }
}

export default function DojoApp() {
  const [state, setState] = useState<DojoState>(defaultState())
  const [mission, setMission] = useState<Mission | null>(null)
  const [missionText, setMissionText] = useState('')
  const [answer, setAnswer] = useState('')
  const [judgement, setJudgement] = useState('')
  const [mentorInput, setMentorInput] = useState('')
  const [mentor, setMentor] = useState('')
  const [loading, setLoading] = useState<'mission' | 'judge' | 'mentor' | ''>('')
  const progress = useMemo(() => Math.round((state.xp / (state.level * 100)) * 100), [state])

  useEffect(() => { setState(loadState()) }, [])
  useEffect(() => { saveState(state) }, [state])

  async function streamMiMo(messages: { role: string; content: string }[], maxTokens: number, onToken: (text: string) => void) {
    const res = await fetch('/api/mimo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, maxTokens, temperature: 0.82, mode: 'stream' })
    })
    if (!res.ok) throw new Error(await res.text())
    const reader = res.body?.getReader()
    if (!reader) throw new Error('No stream reader')
    const decoder = new TextDecoder()
    let full = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      for (const line of chunk.split('\n')) {
        const token = parseSSEChunk(line)
        if (token) { full += token; onToken(full) }
      }
    }
    return full
  }

  async function generateMission(type: MissionType) {
    setLoading('mission'); setMissionText(''); setJudgement(''); setAnswer('')
    const theme = THEMES[Math.floor(Math.random() * THEMES.length)]
    const difficulty = state.level < 5 ? 'Easy' : state.level < 12 ? 'Medium' : 'Hard'
    const system = `You are DebugDojo, a Xiaomi MiMo powered coding mentor. Generate one ${type} mission for a level ${state.level} developer. Theme: ${theme}. Difficulty: ${difficulty}. Use structured markdown with sections: Title, Scenario, Broken Code, Goal, Hints, Expected Focus. Keep it practical and fun.`
    try {
      const text = await streamMiMo([
        { role: 'system', content: system },
        { role: 'user', content: `Create a fresh ${difficulty} ${type} debugging dojo mission. Include code and realistic constraints.` }
      ], 1100, setMissionText)
      setMission({ ...fallbackMission(type, state.level), id: crypto.randomUUID(), type, difficulty, theme, title: `${type} Mission — ${theme}`, prompt: text })
    } catch {
      const fb = fallbackMission(type, state.level)
      setMission(fb); setMissionText(`${fb.title}\n\n${fb.prompt}\n\n\`\`\`js\n${fb.starterCode}\n\`\`\``)
    } finally { setLoading('') }
  }

  async function judgeAnswer() {
    if (!mission || !answer.trim()) return
    setLoading('judge'); setJudgement('')
    const system = `You are a strict but helpful MiMo AI code reviewer. Judge the developer's answer for this mission. Return: Score /100, What is correct, Missing issues, Improved solution, and one next-step lesson. Be concise but useful.`
    try {
      const text = await streamMiMo([
        { role: 'system', content: system },
        { role: 'user', content: `MISSION:\n${missionText || mission.prompt}\n\nDEVELOPER ANSWER:\n${answer}` }
      ], 1000, setJudgement)
      const score = Number(text.match(/(\d{2,3})\s*\/\s*100/)?.[1] || '75')
      const xp = score >= 85 ? 90 : score >= 65 ? 60 : 30
      setState(prev => awardXP({ ...prev, solved: prev.solved + 1, judged: prev.judged + 1 }, xp, mission.title, 'judged mission'))
    } catch {
      setJudgement('MiMo judging is unavailable. Fallback score: 70/100. Review your edge cases and explain tradeoffs clearly.')
      setState(prev => awardXP({ ...prev, solved: prev.solved + 1, judged: prev.judged + 1 }, 50, mission.title, 'fallback judge'))
    } finally { setLoading('') }
  }

  async function askMentor() {
    if (!mentorInput.trim()) return
    setLoading('mentor'); setMentor('')
    try {
      await streamMiMo([
        { role: 'system', content: `You are DebugDojo's MiMo mentor. User rank: ${state.rank}, level ${state.level}. Answer like a senior debugging coach under 120 words with practical next steps.` },
        { role: 'user', content: mentorInput }
      ], 450, setMentor)
      setState(prev => awardXP({ ...prev, mentorChats: prev.mentorChats + 1 }, 10, 'Mentor chat', 'mentor'))
    } catch { setMentor('Mentor is offline. Try isolating the failing input, write a minimal repro, then add a regression test.') }
    finally { setLoading('') }
  }

  return (
    <main className="min-h-screen px-4 py-8 md:px-8">
      <section className="mx-auto max-w-7xl">
        <nav className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3"><div className="h-10 w-10 rounded-xl bg-cyan/20 border border-cyan/40 grid place-items-center shadow-neon">🥋</div><div><div className="font-bold text-xl">DebugDojo</div><div className="text-xs text-slate-400">MiMo AI debugging mentor</div></div></div>
          <a href="https://github.com" className="text-sm text-cyan hover:text-white">GitHub ↗</a>
        </nav>

        <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-6 items-start">
          <div>
            <div className="relative overflow-hidden rounded-3xl pixel-card scanline p-8 md:p-10 mb-6">
              <div className="absolute right-8 top-8 text-7xl opacity-20 floaty">🐛</div>
              <p className="text-cyan text-sm font-bold tracking-[.25em] uppercase">Generate → Solve → Judge → Coach</p>
              <h1 className="mt-4 text-4xl md:text-6xl font-black leading-tight">Turn every bug into an AI training mission.</h1>
              <p className="mt-5 text-slate-300 max-w-2xl">DebugDojo uses Xiaomi MiMo V2.5 Pro to generate coding missions, stream hints, judge your fixes, and coach you with personalized next steps.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {MISSION_TYPES.map(type => <button key={type} onClick={() => generateMission(type)} disabled={!!loading} className="rounded-xl border border-cyan/30 bg-cyan/10 px-4 py-3 text-sm font-semibold text-cyan hover:bg-cyan/20 disabled:opacity-50">{type}</button>)}
              </div>
            </div>

            <section className="rounded-3xl pixel-card p-6 mb-6">
              <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold">Live MiMo Mission</h2><span className="text-xs text-slate-400">SSE streaming</span></div>
              <pre className={`code-font whitespace-pre-wrap text-sm leading-7 text-slate-200 min-h-[260px] ${loading === 'mission' ? 'streaming-cursor' : ''}`}>{missionText || 'Pick a mission type to generate a fresh MiMo debugging scenario...'}</pre>
            </section>

            <section className="rounded-3xl pixel-card p-6">
              <h2 className="text-xl font-bold mb-4">Submit your fix / explanation</h2>
              <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Paste your fixed code, reasoning, tests, or explanation..." className="w-full min-h-36 rounded-2xl bg-ink border border-slate-700 p-4 text-sm outline-none focus:border-cyan code-font" />
              <button onClick={judgeAnswer} disabled={!mission || !answer.trim() || !!loading} className="mt-4 rounded-xl bg-lime text-ink px-5 py-3 font-bold disabled:opacity-50">Judge with MiMo</button>
              {judgement && <div className="mt-5 rounded-2xl bg-ink/70 border border-lime/20 p-4"><pre className={`whitespace-pre-wrap text-sm leading-7 ${loading === 'judge' ? 'streaming-cursor' : ''}`}>{judgement}</pre></div>}
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl pixel-card p-6">
              <div className="flex items-center justify-between"><div><div className="text-sm text-slate-400">Rank</div><div className="text-3xl font-black text-gold">{state.rank}</div></div><div className="text-5xl">🏯</div></div>
              <div className="mt-5"><div className="flex justify-between text-sm text-slate-400"><span>Level {state.level}</span><span>{progress}%</span></div><div className="mt-2 h-3 rounded-full bg-ink overflow-hidden"><div className="h-full bg-gradient-to-r from-cyan to-lime" style={{ width: `${progress}%` }} /></div></div>
              <div className="grid grid-cols-3 gap-3 mt-5 text-center"><Stat label="Solved" value={state.solved} /><Stat label="Judged" value={state.judged} /><Stat label="Chats" value={state.mentorChats} /></div>
            </section>

            <section className="rounded-3xl pixel-card p-6">
              <h3 className="font-bold mb-3">MiMo Mentor</h3>
              <textarea value={mentorInput} onChange={e => setMentorInput(e.target.value)} placeholder="Ask for a debugging hint, architecture advice, or explanation..." className="w-full min-h-24 rounded-2xl bg-ink border border-slate-700 p-3 text-sm outline-none focus:border-cyan" />
              <button onClick={askMentor} disabled={!mentorInput.trim() || !!loading} className="mt-3 rounded-xl bg-cyan text-ink px-4 py-2 font-bold disabled:opacity-50">Ask Mentor</button>
              {mentor && <p className={`mt-4 text-sm text-slate-200 leading-6 ${loading === 'mentor' ? 'streaming-cursor' : ''}`}>{mentor}</p>}
            </section>

            <section className="rounded-3xl pixel-card p-6">
              <h3 className="font-bold mb-3">Achievements</h3>
              <div className="flex flex-wrap gap-2">{(state.achievements.length ? state.achievements : ['First Fix', 'AI Reviewed', 'Mentor Bond']).map((a, i) => <span key={a} className={`rounded-full px-3 py-1 text-xs border ${state.achievements.includes(a) ? 'border-gold/50 text-gold bg-gold/10' : 'border-slate-700 text-slate-500'}`}>{i < state.achievements.length ? '🏆 ' : '🔒 '}{a}</span>)}</div>
            </section>

            <section className="rounded-3xl pixel-card p-6">
              <h3 className="font-bold mb-3">Activity Feed</h3>
              <div className="space-y-3">{state.history.length === 0 ? <p className="text-sm text-slate-500">No missions judged yet.</p> : state.history.map(h => <div key={h.id} className="rounded-xl bg-ink/70 border border-slate-800 p-3 text-sm"><div className="text-slate-200">{h.title}</div><div className="text-lime text-xs">+{h.xp} XP • {h.type}</div></div>)}</div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl bg-ink/80 border border-slate-800 p-3"><div className="text-xl font-black text-white">{value}</div><div className="text-[10px] text-slate-500 uppercase">{label}</div></div>
}
