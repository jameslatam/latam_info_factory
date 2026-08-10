"use client";

import AppShell from "@/components/layout/AppShell";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

type PipelineStatus = {
  stage: string;
  progress: number;
  message: string;
  pages_done?: number;
  pages_total?: number;
  result_url?: string;
};

const PIPELINE_STAGES = [
  { key: "queued",        label: "Na fila",               icon: "◇" },
  { key: "planning",      label: "Planejando conteúdo",   icon: "◆" },
  { key: "content",       label: "Gerando textos",        icon: "✎" },
  { key: "images",        label: "Gerando ilustrações",   icon: "◈" },
  { key: "rendering",     label: "Montando páginas",      icon: "◫" },
  { key: "pdf",           label: "Exportando PDF",        icon: "▤" },
  { key: "completed",     label: "Projeto concluído!",    icon: "✦" },
];

function EditorContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [project, setProject] = useState<any>(null);
  const [pipeline, setPipeline] = useState<PipelineStatus>({
    stage: "queued",
    progress: 0,
    message: "Aguardando o worker local...",
  });
  const [error, setError] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pollProject = useCallback(async () => {
    if (!projectId) return;

    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) return;

      const json = await res.json();
      const data = json.data;

      if (data) {
        setProject(data);

        if (data.pipeline_status) {
          setPipeline({
            stage: data.pipeline_status.stage || "queued",
            progress: data.pipeline_status.progress || 0,
            message: data.pipeline_status.message || "",
            pages_done: data.pipeline_status.pages_done,
            pages_total: data.pipeline_status.pages_total,
            result_url: data.pipeline_status.result_url || data.results?.url || null,
          });
        }

        if (
          data.pipeline_status?.stage === "completed" ||
          data.pipeline_status?.stage === "error"
        ) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }
    } catch {
      // silent — will retry on next poll
    }
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;

    // Load from localStorage while waiting for Supabase
    try {
      const raw = localStorage.getItem("latam_v4_current_project");
      if (raw) {
        const local = JSON.parse(raw);
        if (local.projectId === projectId) {
          setProject(local);
        }
      }
    } catch { /* ignore */ }

    // Start polling Supabase every 3 seconds
    pollProject();
    intervalRef.current = setInterval(pollProject, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [projectId, pollProject]);

  if (!projectId) {
    return (
      <AppShell title="Editor">
        <div className="comingSoon">
          <span>⚠</span>
          <h2>Nenhum projeto selecionado</h2>
          <p>Crie um projeto primeiro em &quot;Criar produto&quot;.</p>
        </div>
      </AppShell>
    );
  }

  const currentStageIdx = PIPELINE_STAGES.findIndex(
    (s) => s.key === pipeline.stage
  );

  const config = project?.configuration || {};

  return (
    <AppShell title="Editor" eyebrow="GENERATION ENGINE">
      <div className="editorPage">

        {/* Project Header */}
        <section className="editorHeader">
          <div>
            <span className="badge">
              {config.productType || "Projeto"} • {config.language || ""}
            </span>
            <h2>{config.title || project?.projectId || "Gerando..."}</h2>
            <p>
              {config.niche || ""} • {config.pageCount || ""} páginas •{" "}
              {config.visualStyle || ""}
            </p>
          </div>

          <div className="progressInfo">
            <strong>{Math.round(pipeline.progress)}%</strong>
            <span>geração</span>
          </div>
        </section>

        {/* Progress Bar */}
        <div className="progressTrack">
          <i style={{ width: `${pipeline.progress}%` }} />
        </div>

        {/* Pipeline Stages */}
        <div className="pipelineStages">
          {PIPELINE_STAGES.map((stage, idx) => {
            let stageClass = "pipelineStage";
            if (idx < currentStageIdx) stageClass += " done";
            else if (idx === currentStageIdx) stageClass += " active";

            return (
              <div key={stage.key} className={stageClass}>
                <span className="pipelineIcon">
                  {idx < currentStageIdx ? "✓" : stage.icon}
                </span>
                <span className="pipelineLabel">{stage.label}</span>
              </div>
            );
          })}
        </div>

        {/* Status Message */}
        <section className="panel editorStatus">
          <div className="statusContent">
            {pipeline.stage === "completed" ? (
              <>
                <div className="statusIcon success">✦</div>
                <div>
                  <strong>Projeto finalizado com sucesso!</strong>
                  <p>
                    Seu infoproduto &quot;{config.title}&quot; foi gerado com
                    {config.pageCount ? ` ${config.pageCount} páginas` : ""}.
                  </p>
                  {pipeline.result_url && (
                    <div style={{ marginTop: "1rem", padding: "1rem", background: "rgba(255,255,255,0.05)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <strong style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>Arquivo PDF gerado:</strong>
                      
                      <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
                        <button
                          className="primary small"
                          onClick={() => {
                            fetch("http://127.0.0.1:3131/open?path=" + encodeURIComponent(pipeline.result_url!)).catch(() => alert("O worker local precisa estar rodando para abrir o arquivo."));
                          }}
                        >
                          Abrir no Computador
                        </button>
                        <a
                          className="secondary small button"
                          href={"http://127.0.0.1:3131/download?path=" + encodeURIComponent(pipeline.result_url!)}
                          download
                        >
                          ↓ Fazer Download
                        </a>
                      </div>

                      <strong style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>Caminho local:</strong>
                      <code style={{ display: "block", padding: "0.5rem", background: "#000", borderRadius: "4px", fontSize: "0.85rem", wordBreak: "break-all", userSelect: "all", cursor: "pointer" }} onClick={(e) => {
                        navigator.clipboard.writeText(pipeline.result_url!);
                        const el = e.currentTarget;
                        const oldBg = el.style.background;
                        el.style.background = "#2ea043";
                        setTimeout(() => el.style.background = oldBg, 300);
                      }}>
                        {pipeline.result_url}
                      </code>
                    </div>
                  )}
                </div>
              </>
            ) : pipeline.stage === "error" ? (
              <>
                <div className="statusIcon error">✕</div>
                <div>
                  <strong>Erro na geração</strong>
                  <p>{pipeline.message || "Ocorreu um erro durante o processo."}</p>
                </div>
              </>
            ) : (
              <>
                <div className="statusIcon working">
                  <div className="spinner" />
                </div>
                <div>
                  <strong>{pipeline.message}</strong>
                  <p>
                    O motor está processando no seu computador local.
                    {pipeline.pages_done != null && pipeline.pages_total
                      ? ` Página ${pipeline.pages_done} de ${pipeline.pages_total}.`
                      : " Aguarde..."}
                  </p>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Worker Hint */}
        {pipeline.stage === "queued" && (
          <section className="panel workerHint">
            <div className="statusContent">
              <div className="statusIcon hint">⚡</div>
              <div>
                <strong>Worker local não detectado</strong>
                <p>
                  Para gerar o projeto, abra um terminal no seu computador e
                  execute:
                </p>
                <code className="workerCommand">
                  python online_worker.py
                </code>
                <p className="workerNote">
                  O worker irá conectar ao Supabase, detectar este projeto
                  automaticamente e iniciar a geração usando o Ollama e ComfyUI
                  do seu computador.
                </p>
              </div>
            </div>
          </section>
        )}

        {error && <div className="formError">{error}</div>}
      </div>
    </AppShell>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <AppShell title="Editor">
          <div className="comingSoon">
            <div className="spinner" />
            <h2>Carregando editor...</h2>
          </div>
        </AppShell>
      }
    >
      <EditorContent />
    </Suspense>
  );
}
