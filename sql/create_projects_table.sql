-- Create projects table for LATAM Info Factory V4
create table if not exists projects (
  id bigserial primary key,
  projectId text not null,
  version text,
  status text,
  createdAt timestamptz,
  configuration jsonb,
  pipeline jsonb
);
