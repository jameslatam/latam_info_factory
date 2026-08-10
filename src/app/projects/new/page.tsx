"use client";

import AppShell from "@/components/layout/AppShell";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type ProductForm = {
  market: string;
  productType: string;
  title: string;
  subtitle: string;

  niche: string;
  topic: string;
  objective: string;

  language: string;
  audience: string;
  audienceLevel: string;
  tone: string;

  pageCount: number;
  contentDepth: string;
  structureType: string;

  visualStyle: string;
  imageMode: string;
  imageStyle: string;

  generateCover: boolean;
  generateImages: boolean;
  qualityMode: string;
  referenceText: string;
};

const initialForm: ProductForm = {
  market: "Hotmart LATAM",
  productType: "E-book",
  title: "",
  subtitle: "",

  niche: "Educação",
  topic: "",
  objective: "Vender conhecimento",

  language: "Espanhol LATAM",
  audience: "",
  audienceLevel: "Iniciante",
  tone: "Didático",

  pageCount: 30,
  contentDepth: "Intermediário",
  structureType: "Editorial inteligente",

  visualStyle: "Premium Editorial",
  imageMode: "Automático",
  imageStyle: "Editorial Vector",

  generateCover: true,
  generateImages: true,
  qualityMode: "Premium",
  referenceText: "",
};

const steps = [
  {
    number: 1,
    label: "Produto",
  },
  {
    number: 2,
    label: "Conteúdo",
  },
  {
    number: 3,
    label: "Estrutura",
  },
  {
    number: 4,
    label: "Visual IA",
  },
  {
    number: 5,
    label: "Revisão",
  },
];

function slug(value: string) {
  return value
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "_"
    )
    .replace(
      /^_|_$/g,
      ""
    );
}

export default function NewProjectPage() {

  const router = useRouter();

  const [step, setStep] =
    useState(1);

  const [form, setForm] =
    useState<ProductForm>(
      initialForm
    );

  const [error, setError] =
    useState("");

  const progress = useMemo(
    () => step * 20,
    [step]
  );

  function update<K extends keyof ProductForm>(
    key: K,
    value: ProductForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function next() {

    setError("");

    if (
      step === 1 &&
      !form.title.trim()
    ) {
      setError(
        "Informe o título do produto."
      );
      return;
    }

    if (
      step === 2 &&
      !form.topic.trim()
    ) {
      setError(
        "Informe o tema específico."
      );
      return;
    }

    setStep(
      Math.min(
        step + 1,
        5
      )
    );
  }

  function back() {
    setError("");

    setStep(
      Math.max(
        step - 1,
        1
      )
    );
  }

  function createProject() {

    const now = new Date();

    const projectId =
      now
        .toISOString()
        .replace(
          /[-:.TZ]/g,
          ""
        )
        .slice(0, 14)
      + "_"
      + (
        slug(form.title)
        || "produto"
      );

    const project = {
      projectId,
      version: "4.2",
      status: "configured",
      createdAt:
        now.toISOString(),

      configuration:
        form,

      pipeline: {
        briefing:
          "completed",

        outline:
          "pending",

        content:
          "pending",

        artDirector:
          "pending",

        illustrations:
          "pending",

        layout:
          "pending",

        qualityGate:
          "pending",

        export:
          "pending",
      },
    };

    // Try to persist to Supabase via API route. If it fails, fallback to localStorage.
    (async () => {
      try {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(project),
        });

        if (res.ok) {
          // Optionally read returned data
          const json = await res.json();

          // Keep a local copy for offline/personal mode
          const existingRaw = localStorage.getItem("latam_v4_projects");
          const existing = existingRaw ? JSON.parse(existingRaw) : [];
          existing.unshift(project);
          localStorage.setItem("latam_v4_projects", JSON.stringify(existing));
          localStorage.setItem("latam_v4_current_project", JSON.stringify(project));

          router.push(`/editor?projectId=${projectId}`);
          return;
        }
      } catch (err) {
        // ignore and fallback to local
      }

      // Fallback: localStorage-only persistence
      const existingRaw = localStorage.getItem("latam_v4_projects");
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      existing.unshift(project);
      localStorage.setItem("latam_v4_projects", JSON.stringify(existing));
      localStorage.setItem("latam_v4_current_project", JSON.stringify(project));

      router.push(`/editor?projectId=${projectId}`);
    })();
  }

  return (
    <AppShell
      title="Criar produto"
      eyebrow="PRODUCT CONFIGURATOR"
    >

      <div className="configPage">

        <section className="configIntro">

          <div>
            <span className="badge">
              V4.2 • PERSONAL MODE
            </span>

            <h2>
              Configure o produto.
            </h2>

            <p>
              Essas informações serão
              utilizadas pelos engines de
              conteúdo, design, imagem e PDF.
            </p>
          </div>

          <div className="progressInfo">
            <strong>
              {progress}%
            </strong>

            <span>
              configuração
            </span>
          </div>

        </section>


        <div className="progressTrack">
          <i
            style={{
              width:
                `${progress}%`,
            }}
          />
        </div>


        <div className="configSteps">

          {steps.map((item) => (

            <button
              key={item.number}
              onClick={() =>
                setStep(
                  item.number
                )
              }
              className={
                step === item.number
                  ? "configStep active"
                  : step > item.number
                    ? "configStep done"
                    : "configStep"
              }
            >
              <span>
                {step > item.number
                  ? "✓"
                  : item.number}
              </span>

              {item.label}
            </button>

          ))}

        </div>


        <section className="configCard">

          {step === 1 && (

            <>
              <ConfigHeader
                number="01"
                title="Produto"
                description="Defina o produto que será criado."
              />

              <div className="formGrid">

                <SelectField
                  label="Mercado / destino"
                  value={form.market}
                  options={[
                    "Hotmart LATAM",
                    "Hotmart Brasil",
                    "Uso próprio",
                    "Outro",
                  ]}
                  onChange={(v) =>
                    update(
                      "market",
                      v
                    )
                  }
                />

                <SelectField
                  label="Tipo de produto"
                  value={
                    form.productType
                  }
                  options={[
                    "E-book",
                    "Guia",
                    "Workbook",
                    "Manual",
                    "Livro digital",
                    "Lead Magnet",
                  ]}
                  onChange={(v) =>
                    update(
                      "productType",
                      v
                    )
                  }
                />

                <TextField
                  wide
                  label="Título"
                  value={form.title}
                  placeholder="Ex.: Chopin — Vida e Obra"
                  onChange={(v) =>
                    update(
                      "title",
                      v
                    )
                  }
                />

                <TextField
                  wide
                  label="Subtítulo"
                  value={
                    form.subtitle
                  }
                  placeholder="Opcional"
                  onChange={(v) =>
                    update(
                      "subtitle",
                      v
                    )
                  }
                />

              </div>
            </>
          )}


          {step === 2 && (

            <>
              <ConfigHeader
                number="02"
                title="Conteúdo"
                description="Diga à inteligência editorial o que deve ser produzido."
              />

              <div className="formGrid">

                <SelectField
                  label="Nicho"
                  value={form.niche}
                  options={[
                    "Educação",
                    "Religião",
                    "História",
                    "Finanças",
                    "Negócios",
                    "Música",
                    "Culinária",
                    "Desenvolvimento pessoal",
                    "Outro",
                  ]}
                  onChange={(v) =>
                    update(
                      "niche",
                      v
                    )
                  }
                />

                <SelectField
                  label="Objetivo"
                  value={
                    form.objective
                  }
                  options={[
                    "Vender conhecimento",
                    "Ensinar",
                    "Captar leads",
                    "Autoridade",
                    "Produto complementar",
                  ]}
                  onChange={(v) =>
                    update(
                      "objective",
                      v
                    )
                  }
                />

                <TextField
                  wide
                  label="Tema específico"
                  value={form.topic}
                  placeholder="Ex.: Vida, obra e legado de Frédéric Chopin"
                  onChange={(v) =>
                    update(
                      "topic",
                      v
                    )
                  }
                />

                <ReferenceFileField
                  label="E-book de Referência / Material Base (Opcional)"
                  value={form.referenceText}
                  placeholder="Cole aqui o texto de um e-book existente ou clique em 'Carregar arquivo' acima. A IA usará este material como base para criar um infoproduto 100% inédito e único."
                  onChange={(v) =>
                    update(
                      "referenceText",
                      v
                    )
                  }
                />

                <SelectField
                  label="Idioma"
                  value={
                    form.language
                  }
                  options={[
                    "Espanhol LATAM",
                    "Português Brasil",
                    "Inglês",
                  ]}
                  onChange={(v) =>
                    update(
                      "language",
                      v
                    )
                  }
                />

                <TextField
                  label="Público-alvo"
                  value={
                    form.audience
                  }
                  placeholder="Ex.: estudantes de música"
                  onChange={(v) =>
                    update(
                      "audience",
                      v
                    )
                  }
                />

                <SelectField
                  label="Nível do público"
                  value={
                    form.audienceLevel
                  }
                  options={[
                    "Iniciante",
                    "Intermediário",
                    "Avançado",
                    "Geral",
                  ]}
                  onChange={(v) =>
                    update(
                      "audienceLevel",
                      v
                    )
                  }
                />

                <SelectField
                  label="Tom"
                  value={form.tone}
                  options={[
                    "Didático",
                    "Editorial",
                    "Profissional",
                    "Inspirador",
                    "Prático",
                    "Acadêmico acessível",
                  ]}
                  onChange={(v) =>
                    update(
                      "tone",
                      v
                    )
                  }
                />

              </div>
            </>
          )}


          {step === 3 && (

            <>
              <ConfigHeader
                number="03"
                title="Estrutura"
                description="Determine o tamanho e a profundidade editorial."
              />

              <div className="formGrid">

                <NumberField
                  label="Quantidade de páginas"
                  value={
                    form.pageCount
                  }
                  min={5}
                  max={150}
                  onChange={(v) =>
                    update(
                      "pageCount",
                      v
                    )
                  }
                />

                <SelectField
                  label="Profundidade"
                  value={
                    form.contentDepth
                  }
                  options={[
                    "Rápido",
                    "Intermediário",
                    "Profundo",
                    "Premium",
                  ]}
                  onChange={(v) =>
                    update(
                      "contentDepth",
                      v
                    )
                  }
                />

                <SelectField
                  wide
                  label="Arquitetura editorial"
                  value={
                    form.structureType
                  }
                  options={[
                    "Editorial inteligente",
                    "Capítulos tradicionais",
                    "Passo a passo",
                    "Guia visual",
                    "Cards e resumos",
                  ]}
                  onChange={(v) =>
                    update(
                      "structureType",
                      v
                    )
                  }
                />

              </div>
            </>
          )}


          {step === 4 && (

            <>
              <ConfigHeader
                number="04"
                title="Visual IA"
                description="Defina a direção visual do produto."
              />

              <div className="formGrid">

                <SelectField
                  label="Estilo editorial"
                  value={
                    form.visualStyle
                  }
                  options={[
                    "Premium Editorial",
                    "Minimalista",
                    "Infográfico",
                    "Educacional",
                    "Magazine",
                    "Luxury",
                  ]}
                  onChange={(v) =>
                    update(
                      "visualStyle",
                      v
                    )
                  }
                />

                <SelectField
                  label="Modo de imagem"
                  value={
                    form.imageMode
                  }
                  options={[
                    "Automático",
                    "Ilustrações",
                    "Fotográfico",
                    "Sem imagens",
                  ]}
                  onChange={(v) =>
                    update(
                      "imageMode",
                      v
                    )
                  }
                />

                <SelectField
                  label="Estilo de imagem"
                  value={
                    form.imageStyle
                  }
                  options={[
                    "Editorial Vector",
                    "Editorial Painting",
                    "Realista",
                    "Infográfico",
                    "3D Clean",
                  ]}
                  onChange={(v) =>
                    update(
                      "imageStyle",
                      v
                    )
                  }
                />

                <SelectField
                  label="Qualidade"
                  value={
                    form.qualityMode
                  }
                  options={[
                    "Standard",
                    "Premium",
                    "Ultra",
                  ]}
                  onChange={(v) =>
                    update(
                      "qualityMode",
                      v
                    )
                  }
                />

              </div>


              <div className="toggleGrid">

                <Toggle
                  title="Gerar capa"
                  description="Criar capa automaticamente"
                  checked={
                    form.generateCover
                  }
                  onChange={(v) =>
                    update(
                      "generateCover",
                      v
                    )
                  }
                />

                <Toggle
                  title="Gerar ilustrações"
                  description="Planejar imagens por página"
                  checked={
                    form.generateImages
                  }
                  onChange={(v) =>
                    update(
                      "generateImages",
                      v
                    )
                  }
                />

              </div>
            </>
          )}


          {step === 5 && (

            <>
              <ConfigHeader
                number="05"
                title="Revisão"
                description="Confira o briefing antes de criar o projeto."
              />

              <div className="reviewGrid">

                <Review
                  label="Produto"
                  value={
                    `${form.productType} • ${form.market}`
                  }
                />

                <Review
                  label="Título"
                  value={
                    form.title
                  }
                />

                <Review
                  label="Tema"
                  value={
                    form.topic
                  }
                />

                <Review
                  label="Idioma"
                  value={
                    form.language
                  }
                />

                <Review
                  label="Estrutura"
                  value={
                    `${form.pageCount} páginas • ${form.contentDepth}`
                  }
                />

                <Review
                  label="Visual"
                  value={
                    `${form.visualStyle} • ${form.imageStyle}`
                  }
                />

                <Review
                  label="E-book Base"
                  value={
                    form.referenceText
                      ? `${form.referenceText.length} caracteres (Material Base)`
                      : "Nenhum"
                  }
                />

              </div>


              <div className="readyBox">

                <span>✦</span>

                <div>
                  <strong>
                    Briefing pronto.
                  </strong>

                  <p>
                    Na próxima fase este projeto
                    será enviado ao Supabase e
                    conectado aos engines V4.
                  </p>
                </div>

              </div>
            </>
          )}


          {error && (
            <div className="formError">
              {error}
            </div>
          )}


          <div className="configFooter">

            <button
              className="secondary"
              onClick={back}
              disabled={step === 1}
            >
              ← Voltar
            </button>

            {step < 5 ? (

              <button
                className="primary"
                onClick={next}
              >
                Continuar →
              </button>

            ) : (

              <button
                className="primary"
                onClick={
                  createProject
                }
              >
                ✦ Criar projeto
              </button>

            )}

          </div>

        </section>

      </div>

    </AppShell>
  );
}


function ConfigHeader({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="configHeader">

      <span>
        {number}
      </span>

      <div>
        <h3>
          {title}
        </h3>

        <p>
          {description}
        </p>
      </div>

    </div>
  );
}


function ReferenceFileField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        onChange(text);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="field wide">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
        <span>{label}</span>
        <label style={{ fontSize: "11px", color: "#9d68ff", cursor: "pointer", fontWeight: "bold" }}>
          📁 Carregar arquivo (.txt / .md / .json)
          <input type="file" accept=".txt,.md,.json,.csv" onChange={handleFileUpload} style={{ display: "none" }} />
        </label>
      </div>
      <textarea
        rows={4}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function TextField({
  label,
  value,
  placeholder,
  onChange,
  wide = false,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (
    value: string
  ) => void;
  wide?: boolean;
}) {
  return (
    <label
      className={
        wide
          ? "field wide"
          : "field"
      }
    >
      <span>{label}</span>

      <input
        value={value}
        placeholder={
          placeholder
        }
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      />
    </label>
  );
}


function NumberField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (
    value: number
  ) => void;
}) {
  return (
    <label className="field">

      <span>{label}</span>

      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(event) =>
          onChange(
            Number(
              event.target.value
            )
          )
        }
      />

    </label>
  );
}


function SelectField({
  label,
  value,
  options,
  onChange,
  wide = false,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (
    value: string
  ) => void;
  wide?: boolean;
}) {
  return (
    <label
      className={
        wide
          ? "field wide"
          : "field"
      }
    >

      <span>{label}</span>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      >
        {options.map(
          (option) => (
            <option
              value={option}
              key={option}
            >
              {option}
            </option>
          )
        )}
      </select>

    </label>
  );
}


function Toggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (
    value: boolean
  ) => void;
}) {
  return (
    <button
      type="button"
      className={
        checked
          ? "toggle active"
          : "toggle"
      }
      onClick={() =>
        onChange(
          !checked
        )
      }
    >

      <div>
        <strong>
          {title}
        </strong>

        <small>
          {description}
        </small>
      </div>

      <i>
        <span />
      </i>

    </button>
  );
}


function Review({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="reviewItem">

      <span>
        {label}
      </span>

      <strong>
        {value || "Não informado"}
      </strong>

    </div>
  );
}
