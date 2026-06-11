-- 002: 2026-06-11 사진 보강 + 4F 침대 사진 제거
--
-- 적용 방법: Supabase SQL Editor 에서 이 파일 전체 실행.
-- 멱등 (재실행 안전): 이미 적용된 변경은 자동 스킵.
--
-- 변경 내용:
--   1) 4F 갤러리에서 침대 클로즈업 3장 삭제 (14, 15, 17 — 시드 데이터만)
--   2) 2F  +11장 (09 ~ 19)
--      3F  +10장 (25 ~ 34)
--      4F  +20장 (23 ~ 42)

-- 1) 4F 침대 컷 3장 삭제 (storage_path NULL = 시드 데이터에 한정)
delete from jeju_yunseul.room_photos
where room = '4f'
  and storage_path is null
  and public_url in (
    '/images/rooms/4f/14.jpg',
    '/images/rooms/4f/15.jpg',
    '/images/rooms/4f/17.jpg'
  );

-- 2) 새 사진 INSERT (이미 있으면 skip)
do $$
begin
  -- 2F: 09 .. 19
  for i in 9..19 loop
    insert into jeju_yunseul.room_photos (room, public_url, sort_order, filename)
    select '2f',
           '/images/rooms/2f/' || lpad(i::text, 2, '0') || '.jpg',
           i,
           lpad(i::text, 2, '0') || '.jpg'
    where not exists (
      select 1 from jeju_yunseul.room_photos
      where room = '2f'
        and public_url = '/images/rooms/2f/' || lpad(i::text, 2, '0') || '.jpg'
    );
  end loop;

  -- 3F: 25 .. 34
  for i in 25..34 loop
    insert into jeju_yunseul.room_photos (room, public_url, sort_order, filename)
    select '3f',
           '/images/rooms/3f/' || lpad(i::text, 2, '0') || '.jpg',
           i,
           lpad(i::text, 2, '0') || '.jpg'
    where not exists (
      select 1 from jeju_yunseul.room_photos
      where room = '3f'
        and public_url = '/images/rooms/3f/' || lpad(i::text, 2, '0') || '.jpg'
    );
  end loop;

  -- 4F: 23 .. 42
  for i in 23..42 loop
    insert into jeju_yunseul.room_photos (room, public_url, sort_order, filename)
    select '4f',
           '/images/rooms/4f/' || lpad(i::text, 2, '0') || '.jpg',
           i,
           lpad(i::text, 2, '0') || '.jpg'
    where not exists (
      select 1 from jeju_yunseul.room_photos
      where room = '4f'
        and public_url = '/images/rooms/4f/' || lpad(i::text, 2, '0') || '.jpg'
    );
  end loop;
end $$;

-- 검증 쿼리 (선택): 층별 갯수 확인
-- select room, count(*) from jeju_yunseul.room_photos group by room order by room;
