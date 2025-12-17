# Google AdSense 설정 가이드

## 1단계: Google AdSense 계정 생성

1. https://www.google.com/adsense 접속
2. Google 계정으로 로그인
3. 사이트 URL 입력 (배포된 Vercel URL)
4. 결제 정보 입력

## 2단계: 사이트 승인 받기

1. 애드센스 대시보드에서 사이트 추가
2. 제공된 코드를 확인 (이미 layout.tsx에 추가됨)
3. 사이트 심사 대기 (1-2주 소요)
4. 승인 후 광고 게재 시작

## 3단계: 광고 단위 생성

1. 애드센스 대시보드 → 광고 → 광고 단위
2. 디스플레이 광고 선택
3. 광고 단위 이름 입력:
   - "Forest Note - 상단 배너"
   - "Forest Note - 중간 광고"
   - "Forest Note - 하단 배너"
4. 광고 크기: 반응형 선택
5. 광고 단위 코드에서 `data-ad-slot` 값 복사

## 4단계: 환경 변수 설정

Vercel 대시보드에서:
1. 프로젝트 선택
2. Settings → Environment Variables
3. 다음 변수 추가:

```
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXX
```

또는 로컬에서 `.env.local` 파일 생성:
```
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXX
```

## 5단계: 광고 슬롯 ID 수정

`app/page.tsx` 파일에서 실제 슬롯 ID로 교체:

```tsx
<AdsenseAd slot="YOUR_TOP_SLOT_ID" format="horizontal" />
<AdsenseAd slot="YOUR_MIDDLE_SLOT_ID" format="rectangle" />
<AdsenseAd slot="YOUR_BOTTOM_SLOT_ID" format="horizontal" />
```

## 광고 배치 위치

- 상단 배너: 로고와 저장소 사용량 사이
- 중간 광고: 캘린더와 섹션 그리드 사이
- 하단 광고: 섹션 그리드 아래

## 예상 수익

- DAU 100명: $5-20/월
- DAU 1,000명: $50-200/월
- DAU 10,000명: $500-2,000/월

## 주의사항

1. 애드센스 정책 준수:
   - 클릭 유도 금지
   - 광고 개수 제한 (페이지당 3-4개 권장)
   - 저작권 위반 콘텐츠 없음

2. 파이네트워크 호환성:
   - 파이 브라우저에서도 정상 작동
   - 파이네트워크 자체 광고 시스템과 충돌하지 않음
   - 파이 결제 시스템과 독립적으로 운영

3. 성능 최적화:
   - `strategy="afterInteractive"` 사용으로 초기 로딩 속도 유지
   - 광고가 설정되지 않으면 자동으로 숨김
