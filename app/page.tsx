"use client";

import { useMemo, useState } from 'react';
import type { SupportedLanguage, AnalysisResult } from '@/lib/analyzers';
import { analyzeCode } from '@/lib/analyzers';

const LANGUAGE_OPTIONS: { label: string; value: SupportedLanguage }[] = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
];

export default function HomePage() {
  const [language, setLanguage] = useState<SupportedLanguage>('javascript');
  const [code, setCode] = useState<string>(`// ??? ??? ???? ?? ??? ?????\nfunction add(a, b){\n  if(a == null || b == null){\n    return 0;\n  }\n  for(let i=0;i<3;i++){\n    console.log(i);\n  }\n  return a + b;\n}`);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isAnalyzeDisabled = useMemo(() => code.trim().length === 0, [code]);

  function handleAnalyze() {
    setError(null);
    try {
      const res = analyzeCode(code, language);
      setResult(res);
    } catch (e: unknown) {
      setError('?? ? ??? ??????. ??? ??????.');
    }
  }

  return (
    <div className="container">
      <header className="header">
        <div className="logo">??</div>
        <div className="title">Agentic Code Analyzer</div>
      </header>

      <div className="grid">
        <section className="panel">
          <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="label">??</div>
              <select value={language} onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}>
                {LANGUAGE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="row">
              <button className="primary" onClick={handleAnalyze} disabled={isAnalyzeDisabled}>????</button>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div className="label" style={{ marginBottom: 6 }}>??</div>
            <textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder="??? ??? ??????" />
          </div>
          {error && <div className="bad" style={{ marginTop: 8 }}>{error}</div>}
          <div className="footer">?????? ??? ?????. ??? ??? ???? ????.</div>
        </section>

        <aside className="panel">
          <div className="label">?? ??</div>
          {!result && <div className="small" style={{ marginTop: 8 }}>??? ???? ??????? ?? ??? ?????.</div>}
          {result && (
            <div style={{ display: 'grid', gap: 12, marginTop: 8 }}>
              <div className="kv">
                <div className="k">??</div>
                <div>{result.summary}</div>
              </div>
              <div>
                <div className="label" style={{ marginBottom: 6 }}>???</div>
                <div style={{ display: 'grid', gap: 6 }}>
                  {result.metrics.map(m => (
                    <div key={m.name} className="kv">
                      <div className="k">{m.name}</div>
                      <div>{m.value}{m.hint ? <span className="small"> ? {m.hint}</span> : null}</div>
                    </div>
                  ))}
                </div>
              </div>
              {result.topComplexitySignals.length > 0 && (
                <div>
                  <div className="label" style={{ marginBottom: 6 }}>??? ??</div>
                  <div style={{ display: 'grid', gap: 6 }}>
                    {result.topComplexitySignals.map(s => (
                      <div key={s.signal} className="kv">
                        <div className="k">{s.signal}</div>
                        <div>{s.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {result.hotspots.length > 0 && (
                <div>
                  <div className="label" style={{ marginBottom: 6 }}>???</div>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {result.hotspots.map((h, i) => (
                      <li key={i} className="bad">{h}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.identifierFrequency.length > 0 && (
                <div>
                  <div className="label" style={{ marginBottom: 6 }}>??? ?? ??</div>
                  <div className="code">
                    {result.identifierFrequency.map(it => `${it.identifier}: ${it.count}`).join('\n')}
                  </div>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>

      <div className="footer">Made for Vercel ? Next.js 14 ? ????? ? ?? ??</div>
    </div>
  );
}
