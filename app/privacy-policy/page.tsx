"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PrivacyPolicyPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> 뒤로 가기
        </Button>

        <Card className="p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center">개인정보처리방침</h1>
          <p className="text-sm text-muted-foreground text-center">최종 업데이트: 2025년 1월</p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. 개인정보의 수집 및 이용 목적</h2>
            <p className="text-muted-foreground">
              기록의 숲(Forest of Records)은 다음의 목적을 위해 개인정보를 수집하고 이용합니다:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>회원 가입 및 관리: 사용자 인증, 계정 관리</li>
              <li>서비스 제공: 일정, 할일, 메모, 일기, 예산, 여행, 차량, 건강 정보 관리</li>
              <li>서비스 개선: 사용자 경험 향상을 위한 분석</li>
              <li>고객 지원: 문의 응대 및 문제 해결</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. 수집하는 개인정보 항목</h2>
            <p className="text-muted-foreground">다음의 개인정보를 수집합니다:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>필수 항목: 이메일 주소, 비밀번호</li>
              <li>선택 항목: 프로필 사진, 위치 정보(여행 기록 시)</li>
              <li>자동 수집 정보: 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보, 기기 정보, 브라우저 정보</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. 개인정보의 보유 및 이용 기간</h2>
            <p className="text-muted-foreground">
              회원 탈퇴 시까지 개인정보를 보유하며, 탈퇴 즉시 지체 없이 파기합니다. 단, 관련 법령에 따라 보존이 필요한
              경우 해당 기간 동안 보관합니다:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
              <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
              <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
              <li>서비스 방문 기록: 3개월</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. 개인정보의 제3자 제공</h2>
            <p className="text-muted-foreground">
              원칙적으로 사용자의 개인정보를 외부에 제공하지 않습니다. 다음의 경우에는 예외로 합니다:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>사용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 요구가 있는 경우</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. 개인정보의 파기 절차 및 방법</h2>
            <p className="text-muted-foreground">
              개인정보는 보유기간 만료, 처리목적 달성 등 개인정보가 불필요하게 되었을 때 지체 없이 파기합니다:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>전자적 파일: 복구 및 재생이 불가능한 방법으로 영구 삭제</li>
              <li>종이 문서: 분쇄기로 분쇄하거나 소각</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. 사용자 및 법정대리인의 권리</h2>
            <p className="text-muted-foreground">사용자는 언제든지 다음의 권리를 행사할 수 있습니다:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리정지 요구</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. 개인정보 보호책임자</h2>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="font-semibold">개인정보 보호책임자</p>
              <p className="text-muted-foreground">이메일: lee381111@gmail.com</p>
              <p className="text-sm text-muted-foreground">
                개인정보 침해에 대한 신고나 상담이 필요하신 경우 아래 기관에 문의하시기 바랍니다:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground ml-4">
                <li>개인정보침해신고센터 (privacy.kisa.or.kr / 국번없이 118)</li>
                <li>대검찰청 사이버범죄수사단 (www.spo.go.kr / 국번없이 1301)</li>
                <li>경찰청 사이버안전국 (cyberbureau.police.go.kr / 국번없이 182)</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. 개인정보 처리방침 변경</h2>
            <p className="text-muted-foreground">
              이 개인정보 처리방침은 2025년 1월 1일부터 적용되며, 법령 및 방침에 따른 변경 내용의 추가, 삭제 및 정정이
              있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. 쿠키의 운용 및 거부</h2>
            <p className="text-muted-foreground">
              서비스는 쿠키를 사용하여 사용자 경험을 개선합니다. 쿠키 사용을 거부하려면 브라우저 설정에서 비활성화할 수
              있으나, 일부 서비스 이용에 제한이 있을 수 있습니다.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">10. 개인정보의 안전성 확보조치</h2>
            <p className="text-muted-foreground">다음과 같은 기술적, 관리적 조치를 통해 개인정보를 보호합니다:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>비밀번호 암호화 저장 및 관리</li>
              <li>해킹 등에 대비한 기술적 대책</li>
              <li>개인정보 취급 직원의 최소화 및 교육</li>
              <li>개인정보보호 전담기구 운영</li>
            </ul>
          </section>
        </Card>
      </div>
    </div>
  )
}
