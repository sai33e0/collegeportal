-- Academic Fees Schema
-- Run this SQL in your Supabase/Postgres database

-- 1) Fee configuration per academic year
create table if not exists fee_configs (
  academic_year int primary key,
  tuition_fee numeric(12,2) not null,
  bus_fee numeric(12,2) not null,
  hostel_fee numeric(12,2) not null,
  created_at timestamp with time zone default now()
);

-- 2) Student service assignment (none | bus | hostel)
create table if not exists student_services (
  student_id uuid primary key references students(user_id) on delete cascade,
  service text not null check (service in ('none','bus','hostel')),
  service_details text null,
  annual_fee numeric(12,2),
  updated_at timestamp with time zone default now()
);

-- 3) Payments made by/for students
create table if not exists fee_payments (
  id bigserial primary key,
  student_id uuid not null references students(user_id) on delete cascade,
  academic_year int not null,
  tuition_amount numeric(12,2) default 0,
  service_type text null check (service_type is null or service_type in ('bus','hostel')),
  service_amount numeric(12,2) default 0,
  total_amount numeric(12,2) not null,
  paid_at timestamp with time zone default now(),
  created_by uuid references users(id)
);

create index if not exists idx_fee_payments_student_year on fee_payments(student_id, academic_year);

-- Optional: enable gen_random_uuid if you want uuid ids elsewhere
-- create extension if not exists pgcrypto;
