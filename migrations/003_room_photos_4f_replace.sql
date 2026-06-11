-- 003: 4F 갤러리 전면 교체 (2026-06-11 0611 4층 폴더 사진 20장)
--
-- 적용 방법: Supabase SQL Editor 에서 이 파일 전체 실행.
-- 멱등 (재실행 안전).
--
-- 변경 내용:
--   1) 기존 4F 갤러리 시드 행 전부 삭제 (storage_path NULL & /images/rooms/4f/ 경로)
--      → hero (/images/room-4f-hero.jpg) 와 common (/images/rooms/common/...) 은 보존
--      → 어드민에서 업로드한 사진(storage_path NOT NULL) 도 보존
--   2) 새 4F 갤러리 시드 INSERT (01 ~ 20)

delete from jeju_yunseul.room_photos
where room = '4f'
  and storage_path is null
  and public_url like '/images/rooms/4f/%';

do $$
begin
  for i in 1..20 loop
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

-- 검증 (선택): select count(*), room from jeju_yunseul.room_photos group by room;
