import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

const pipeline = [
  ["01", "Briefing", "Configuração"],
  ["02", "Outline", "Arquitetura editorial"],
  ["03", "Conteúdo", "Geração estruturada"],
  ["04", "Art Director", "Direção visual"],
  ["05", "Ilustrações", "Assets por IA"],
  ["06", "Layout", "Diagramação"],
  ["07", "Quality Gate", "Revisão"],
  ["08", "Exportação", "PDF final"],
];

export default function Home() {

  return (
    <AppShell title="Dashboard">

      <div className="hero">

        <div className="heroGlow" />

        <div className="heroText">

          <span className="badge">
            ✦ GENERATIVE PUBLISHING
          </span>

          <h2>
            Transforme uma ideia em um
            <em>
              {" "}produto digital completo.
            </em>
          </h2>

          <p>
            Conteúdo, direção editorial,
            ilustrações, layout e PDF em
            um único fluxo inteligente.
          </p>

          <div className="heroButtons">

            <Link
              href="/projects/new"
              className="primary"
            >
              ✦ Criar novo produto
            </Link>

            <Link
              href="/projects"
              className="secondary"
            >
              Abrir projetos
            </Link>

          </div>

        </div>


        <div className="heroVisual">

          <div className="aiCard">

            <div className="aiTop">
              <span>LATAM INFO FACTORY</span>
              <b>V4</b>
            </div>

            <div className="aiSymbol">
              ✦
            </div>

            <strong>
              Multi-Engine
            </strong>

            <small>
              Editorial Intelligence
            </small>

          </div>

        </div>

      </div>


      <div className="sectionHeader">

        <div>
          <span className="eyebrow">
            PRODUCTION PIPELINE
          </span>

          <h3>
            Do briefing ao produto final
          </h3>
        </div>

        <span className="personal">
          PERSONAL MODE
        </span>

      </div>


      <div className="pipeline">

        {pipeline.map((step) => (

          <div
            className="pipelineCard"
            key={step[0]}
          >

            <div className="stepTop">
              <span>{step[0]}</span>
              <i>○</i>
            </div>

            <strong>
              {step[1]}
            </strong>

            <small>
              {step[2]}
            </small>

          </div>

        ))}

      </div>


      <div className="dashboardGrid">

        <section className="panel">

          <div className="panelHead">

            <div>
              <span className="eyebrow">
                RECENT PROJECTS
              </span>

              <h3>
                Projetos
              </h3>
            </div>

            <Link href="/projects">
              Ver todos →
            </Link>

          </div>


          <div className="empty">

            <div className="emptyIcon">
              ◇
            </div>

            <strong>
              Comece pela configuração.
            </strong>

            <p>
              Crie um produto e salve
              o primeiro projeto da V4.
            </p>

            <Link
              href="/projects/new"
              className="primary small"
            >
              + Novo produto
            </Link>

          </div>

        </section>


        <section className="panel">

          <div className="panelHead">

            <div>
              <span className="eyebrow">
                ENGINE STATUS
              </span>

              <h3>
                Intelligence Stack
              </h3>
            </div>

          </div>

          <div className="engineList">

            <div>
              <span>
                <i className="online" />
                Configuration
              </span>
              <b>V4.2</b>
            </div>

            <div>
              <span>
                <i className="purple" />
                Supabase
              </span>
              <b>V4.3</b>
            </div>

            <div>
              <span>
                <i className="purple" />
                AI Provider Router
              </span>
              <b>V4.4</b>
            </div>

          </div>

        </section>

      </div>

    </AppShell>
  );
}
