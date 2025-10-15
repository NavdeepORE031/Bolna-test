"use client";

import { useState } from "react";

export default function Home() {
  const [agentName, setAgentName] = useState("");
  const [langEnglish, setLangEnglish] = useState(false);
  const [langHindi, setLangHindi] = useState(false);
  const [achieve, setAchieve] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [faqs, setFaqs] = useState("");
  const [transcript, setTranscript] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function onGenerate() {
    setStatus(null);
    setSubmitting(true);
    try {
      const languages: string[] = [];
      if (langEnglish) languages.push("English");
      if (langHindi) languages.push("Hindi");

      const payload = {
        agent_name: agentName || null,
        languages,
        objective: achieve || null,
        ideal_next_steps: nextSteps || null,
        faqs_or_documents: faqs || null,
        sample_transcript: transcript || null,
        source: "prompt-builder-ui",
        timestamp: new Date().toISOString(),
      };

      const res = await fetch("https://workflows.voagents.ai/webhook/prompt-builder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status} ${res.statusText} - ${text}`);
      }

      setStatus("Sent successfully.");
    } catch (err: any) {
      setStatus(`Failed to send: ${err?.message || String(err)}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <main className="w-full max-w-3xl">
        <div className="rounded-lg border border-black/[.08] dark:border-white/[.145] shadow-sm bg-background">
          <div className="p-4 border-b border-black/[.08] dark:border-white/[.145]">
            <h2 className="text-base font-medium">Select your use case and let AI build your agent</h2>
            <p className="text-xs opacity-80 mt-1">You can always modify & edit it later.</p>
          </div>

          <div className="p-4">
            <div className="flex gap-2 mb-4">
              <button className="h-8 px-3 rounded border border-black/[.08] dark:border-white/[.145] bg-foreground text-background text-xs">Auto Build Agent</button>
              <button className="h-8 px-3 rounded border border-black/[.08] dark:border-white/[.145] text-xs">Pre built Agents</button>
            </div>

            <p className="text-sm mb-2">Tell us about your ideal agent and we'll help you build it step by step.</p>

            <div className="grid gap-4">
              <div className="grid gap-1">
                <label className="text-sm">Name of Agent <span className="text-red-600">*</span></label>
                <input
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="Enter agent name"
                  className="h-10 rounded border border-black/[.08] dark:border-white/[.145] bg-transparent px-3"
                />
              </div>

              <div className="grid gap-1">
                <label className="text-sm">Languages <span className="text-red-600">*</span></label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={langEnglish} onChange={(e) => setLangEnglish(e.target.checked)} />
                    English
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={langHindi} onChange={(e) => setLangHindi(e.target.checked)} />
                    Hindi
                  </label>
                </div>
              </div>

              <div className="grid gap-1">
                <label className="text-sm">What do you want to achieve in this call? <span className="text-red-600">*</span></label>
                <textarea
                  value={achieve}
                  onChange={(e) => setAchieve(e.target.value)}
                  placeholder="Be descriptive as you would to a human who you are asking to lead the call..."
                  className="min-h-24 rounded border border-black/[.08] dark:border-white/[.145] bg-transparent p-3"
                />
              </div>

              <div className="grid gap-1">
                <label className="text-sm">Ideal Next Steps after this call <span className="text-red-600">*</span></label>
                <textarea
                  value={nextSteps}
                  onChange={(e) => setNextSteps(e.target.value)}
                  placeholder="Describe what should happen after the call is completed..."
                  className="min-h-24 rounded border border-black/[.08] dark:border-white/[.145] bg-transparent p-3"
                />
              </div>

              <div className="grid gap-1">
                <label className="text-sm">FAQs / Business Documents / Any information</label>
                <textarea
                  value={faqs}
                  onChange={(e) => setFaqs(e.target.value)}
                  placeholder="Add any relevant FAQs, business documents, or additional information..."
                  className="min-h-24 rounded border border-black/[.08] dark:border-white/[.145] bg-transparent p-3"
                />
              </div>

              <div className="grid gap-1">
                <label className="text-sm">Sample Transcript</label>
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Provide a sample conversation transcript to help guide the agent..."
                  className="min-h-24 rounded border border-black/[.08] dark:border-white/[.145] bg-transparent p-3"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button className="h-9 px-4 rounded border border-black/[.08] dark:border-white/[.145] text-sm">Cancel</button>
                <button onClick={onGenerate} disabled={submitting} className="h-9 px-4 rounded bg-foreground text-background text-sm disabled:opacity-50">{submitting ? "Sending..." : "Generate Agent"}</button>
              </div>
              {status && <p className="text-xs mt-2 opacity-80">{status}</p>}
            </div>
          </div>

          <div className="p-4 border-t border-black/[.08] dark:border-white/[.145] flex items-center justify-center">
            <button className="h-9 px-4 rounded border border-black/[.08] dark:border-white/[.145] text-sm w-full sm:w-auto">I want to create an agent from scratch</button>
          </div>
        </div>
      </main>
    </div>
  );
}
