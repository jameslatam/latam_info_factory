"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";

type Project = {
  projectId: string;
  createdAt: string;
  status: string;

  configuration: {
    title: string;
    productType: string;
    niche: string;
    language: string;
    pageCount: number;
  };
};

export default function ProjectsPage() {

  const [projects, setProjects] =
    useState<Project[]>([]);

  useEffect(() => {

    const raw =
      localStorage.getItem(
        "latam_v4_projects"
      );

    if (!raw) {
      return;
    }

    try {
      setProjects(
        JSON.parse(raw)
      );
    } catch {
      setProjects([]);
    }

  }, []);

  return (
    <AppShell
      title="Meus projetos"
      eyebrow="PROJECT LIBRARY"
    >

      <div className="projectsHead">

        <div>
          <h2>
            Produtos em desenvolvimento
          </h2>

          <p>
            Projetos criados na versão
            pessoal da LATAM INFO FACTORY.
          </p>
        </div>

        <Link
          href="/projects/new"
          className="primary"
        >
          + Novo produto
        </Link>

      </div>


      {projects.length === 0 ? (

        <section className="panel">

          <div className="empty">

            <div className="emptyIcon">
              ◇
            </div>

            <strong>
              Nenhum projeto ainda.
            </strong>

            <p>
              Configure seu primeiro
              infoproduto.
            </p>

            <Link
              href="/projects/new"
              className="primary small"
            >
              Criar projeto
            </Link>

          </div>

        </section>

      ) : (

        <div className="projectCards">

          {projects.map(
            (project) => (

              <article
                className="projectCard"
                key={
                  project.projectId
                }
              >

                <div className="projectTop">

                  <span className="projectType">
                    {
                      project
                        .configuration
                        .productType
                    }
                  </span>

                  <span className="projectStatus">
                    CONFIGURADO
                  </span>

                </div>

                <div className="projectVisual">
                  ✦
                </div>

                <h3>
                  {
                    project
                      .configuration
                      .title
                  }
                </h3>

                <p>
                  {
                    project
                      .configuration
                      .niche
                  }
                  {" • "}
                  {
                    project
                      .configuration
                      .language
                  }
                </p>

                <div className="projectMeta">

                  <span>
                    {
                      project
                        .configuration
                        .pageCount
                    } páginas
                  </span>

                  <span>
                    V4.2
                  </span>

                </div>

                <Link href={`/editor?projectId=${project.projectId}`} className="secondary projectButton">
                  Abrir projeto →
                </Link>

              </article>

            )
          )}

        </div>

      )}

    </AppShell>
  );
}
