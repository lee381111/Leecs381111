"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function TermsOfServicePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> 뒤로 가기
        </Button>

        <Card className="p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center">이용약관</h1>
          <p className="text-sm text-muted-foreground text-center">최종 업데이트: 2025년 1월</p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">제1조 (목적)</h2>
            <p className="text-muted-foreground">
              본 약관은 기록의 숲(Forest of Records, 이하 "서비스")의 이용과 관련하여 서비스 제공자와 사용자 간의 권리,
              의무 및 책임사항, 서비스 이용조건 및 절차 등 기본적인 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">제2조 (정의)</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                "서비스"란 기록의 숲이 제공하는 일정, 할일, 메모, 일기, 예산, 여행, 차량, 건강 관리 등의 기능을
                의미합니다.
              </li>
              <li>"사용자"란 본 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
              <li>"회원"이란 서비스에 가입하여 계정을 보유한 자를 의미합니다.</li>
              <li>"콘텐츠"란 사용자가 서비스를 이용하며 생성, 업로드한 모든 정보를 의미합니다.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">제3조 (약관의 효력 및 변경)</h2>
            <p className="text-muted-foreground">
              본 약관은 서비스 화면에 게시하거나 기타의 방법으로 사용자에게 공지함으로써 효력이 발생합니다. 서비스
              제공자는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며, 변경된 약관은 제1항과
              같은 방법으로 공지 또는 통지함으로써 효력이 발생합니다.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">제4조 (회원가입)</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                회원가입은 사용자가 약관의 내용에 동의하고, 서비스가 정한 가입 양식에 따라 회원정보를 기입한 후 회원가입
                신청을 하여 서비스 제공자가 이를 승낙함으로써 체결됩니다.
              </li>
              <li>
                서비스 제공자는 다음 각 호에 해당하는 신청에 대해서는 승낙을 거부할 수 있습니다:
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
                  <li>허위의 정보를 기재하거나, 서비스가 제시하는 내용을 기재하지 않은 경우</li>
                  <li>만 14세 미만인 경우</li>
                  <li>기타 회원으로 등록하는 것이 서비스의 기술상 현저히 지장이 있다고 판단되는 경우</li>
                </ul>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">제5조 (서비스의 제공 및 변경)</h2>
            <p className="text-muted-foreground">서비스는 다음의 업무를 수행합니다:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>일정, 할일, 메모, 일기 작성 및 관리</li>
              <li>예산 관리 및 분석</li>
              <li>여행 기록 및 계획</li>
              <li>차량 정비 기록 관리</li>
              <li>건강 정보 기록 및 추적</li>
              <li>명함 관리</li>
              <li>날씨 정보 제공</li>
              <li>기타 서비스 제공자가 추가 개발하거나 제휴 계약 등을 통해 사용자에게 제공하는 일체의 서비스</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">제6조 (서비스의 중단)</h2>
            <p className="text-muted-foreground">
              서비스는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의
              제공을 일시적으로 중단할 수 있습니다. 이 경우 서비스 제공자는 사용자에게 통지합니다. 다만, 서비스 제공자가
              사전에 통지할 수 없는 부득이한 사유가 있는 경우 사후에 통지할 수 있습니다.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">제7조 (회원의 의무)</h2>
            <p className="text-muted-foreground">회원은 다음 행위를 하여서는 안 됩니다:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>신청 또는 변경 시 허위 내용의 등록</li>
              <li>타인의 정보 도용</li>
              <li>서비스에 게시된 정보의 변경</li>
              <li>서비스가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
              <li>서비스 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
              <li>서비스 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
              <li>
                외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">제8조 (저작권의 귀속 및 이용제한)</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>서비스가 작성한 저작물에 대한 저작권 기타 지적재산권은 서비스 제공자에게 귀속합니다.</li>
              <li>
                사용자는 서비스를 이용함으로써 얻은 정보 중 서비스에게 지적재산권이 귀속된 정보를 서비스의 사전 승낙
                없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는
                안됩니다.
              </li>
              <li>사용자가 서비스 내에 게시한 콘텐츠의 저작권은 해당 사용자에게 귀속됩니다.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">제9조 (분쟁해결)</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                서비스는 사용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여
                피해보상처리기구를 설치, 운영합니다.
              </li>
              <li>서비스는 사용자로부터 제출되는 불만사항 및 의견은 우선적으로 그 사항을 처리합니다.</li>
              <li>
                서비스와 사용자 간 발생한 분쟁은 전자거래기본법 제28조 및 동 시행령 제15조에 의하여 설치된
                전자거래분쟁조정위원회의 조정에 따를 수 있습니다.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">제10조 (재판권 및 준거법)</h2>
            <p className="text-muted-foreground">
              서비스와 사용자 간에 발생한 전자거래 분쟁에 관한 소송은 대한민국 법을 준거법으로 합니다.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">제11조 (고객 지원)</h2>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="font-semibold">문의 및 지원</p>
              <p className="text-muted-foreground">이메일: lee381111@gmail.com</p>
              <p className="text-sm text-muted-foreground">
                서비스 이용 중 문의사항이나 문제가 발생하면 언제든지 연락 주시기 바랍니다.
              </p>
            </div>
          </section>

          <section className="space-y-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">본 약관은 2025년 1월 1일부터 시행됩니다.</p>
          </section>
        </Card>
      </div>
    </div>
  )
}
