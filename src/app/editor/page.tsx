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
          setPipeline((prev) => ({
            ...prev,
            ...data.pipeline_status,
          }));
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
                    <a
                      href={pipeline.result_url}
                      className="primary small"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ↓ Baixar PDF
                    </a>
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
