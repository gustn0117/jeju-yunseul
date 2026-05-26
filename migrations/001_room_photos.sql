-- room_photos: per-floor 갤러리 + 대표 사진 관리용 테이블
--
-- 적용 방법 (Supabase SQL Editor):
--   1) 이 파일 전체 복사 → SQL Editor에 붙여넣고 Run
--   2) Storage > New bucket 으로 "room-photos" 버킷 생성 (Public 체크)
--   3) Storage 정책: Public 버킷이면 read는 공개. write는 service role만 사용하므로
--      별도 RLS 정책 추가 불필요 (서버에서 SUPABASE_SERVICE_ROLE_KEY로 접근).
--
-- public_url 규칙:
--   - 시드 데이터(기존 /public/images/...): "/images/rooms/2f/01.jpg" 처럼 사이트 경로
--   - 어드민 업로드본: "https://<project>.supabase.co/storage/v1/object/public/room-photos/<path>"
--   storage_path 가 NULL 이면 로컬 시드, NOT NULL 이면 Supabase Storage 대상.

create schema if not exists jeju_yunseul;

create table if not exists jeju_yunseul.room_photos (
  id           bigserial primary key,
  room         text        not null check (room in ('2f','3f','4f')),
  storage_path text,
  public_url   text        not null,
  is_hero      boolean     not null default false,
  sort_order   integer     not null default 0,
  filename     text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists room_photos_room_sort_idx
  on jeju_yunseul.room_photos (room, sort_order);

-- 층당 대표 사진 1장만 허용 (애플리케이션에서도 보장하지만 안전망)
create unique index if not exists room_photos_one_hero_per_room
  on jeju_yunseul.room_photos (room) where is_hero = true;

create or replace function jeju_yunseul.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists room_photos_touch on jeju_yunseul.room_photos;
create trigger room_photos_touch
  before update on jeju_yunseul.room_photos
  for each row execute function jeju_yunseul.touch_updated_at();

-- 시드: 기존 public/images 의 파일들을 그대로 등록.
-- 이미 데이터가 있으면 (재실행 안전) 시드 건너뜀.
do $$
declare
  cnt int;
begin
  select count(*) into cnt from jeju_yunseul.room_photos;
  if cnt > 0 then
    raise notice 'room_photos already seeded (% rows) — skip', cnt;
    return;
  end if;

  -- 대표 사진 (hero)
  insert into jeju_yunseul.room_photos (room, public_url, is_hero, sort_order, filename)
  values
    ('2f', '/images/room-2f-hero.jpg', true, 0, 'room-2f-hero.jpg'),
    ('3f', '/images/room-3f-hero.jpg', true, 0, 'room-3f-hero.jpg'),
    ('4f', '/images/room-4f-hero.jpg', true, 0, 'room-4f-hero.jpg');

  -- 2F 갤러리: 01..08 + common 01..03
  insert into jeju_yunseul.room_photos (room, public_url, sort_order, filename)
  select '2f', '/images/rooms/2f/' || lpad(g::text, 2, '0') || '.jpg', g, lpad(g::text, 2, '0') || '.jpg'
  from generate_series(1, 8) as g;
  insert into jeju_yunseul.room_photos (room, public_url, sort_order, filename)
  select '2f', '/images/rooms/common/' || lpad(g::text, 2, '0') || '.jpg', 100 + g, 'common-' || lpad(g::text, 2, '0') || '.jpg'
  from generate_series(1, 3) as g;

  -- 3F 갤러리: 01..24 + common
  insert into jeju_yunseul.room_photos (room, public_url, sort_order, filename)
  select '3f', '/images/rooms/3f/' || lpad(g::text, 2, '0') || '.jpg', g, lpad(g::text, 2, '0') || '.jpg'
  from generate_series(1, 24) as g;
  insert into jeju_yunseul.room_photos (room, public_url, sort_order, filename)
  select '3f', '/images/rooms/common/' || lpad(g::text, 2, '0') || '.jpg', 100 + g, 'common-' || lpad(g::text, 2, '0') || '.jpg'
  from generate_series(1, 3) as g;

  -- 4F 갤러리: 01..22 + common
  insert into jeju_yunseul.room_photos (room, public_url, sort_order, filename)
  select '4f', '/images/rooms/4f/' || lpad(g::text, 2, '0') || '.jpg', g, lpad(g::text, 2, '0') || '.jpg'
  from generate_series(1, 22) as g;
  insert into jeju_yunseul.room_photos (room, public_url, sort_order, filename)
  select '4f', '/images/rooms/common/' || lpad(g::text, 2, '0') || '.jpg', 100 + g, 'common-' || lpad(g::text, 2, '0') || '.jpg'
  from generate_series(1, 3) as g;
end $$;
