import RegisterPageClient from "@/components/register/register-page.client"
import { getSubjectsContent } from "@/lib/subjects"
import { getRegisterContent } from "@/lib/register"

type CmsPackage = {
  id: string
  name: string
  grade: string
  price?: number | null
  subjects?: { label?: string | null }[] | null
  popular?: boolean | null
}

function mapCmsPackages(list: CmsPackage[] = []) {
  return list.map((p) => ({
    id: p.id,
    tier: p.grade,
    subjects: (Array.isArray(p.subjects) ? p.subjects : []).map((s) => s?.label).filter(Boolean) as string[],
    normalPriceMonthly: typeof p.price === "number" ? p.price : 0,
    popular: !!p.popular,
  }))
}

export default async function RegisterPage() {
  const subjects = await getSubjectsContent()
  const cmsPackages = Array.isArray(subjects.packages) ? (subjects.packages as unknown as CmsPackage[]) : []
  const packages = mapCmsPackages(cmsPackages)
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? null
  const registerContent = await getRegisterContent()

  return (
    <RegisterPageClient
      packages={packages}
      recaptchaSiteKey={recaptchaSiteKey}
      title={registerContent.title || 'Enroll Your Child with StudyBuddy'}
      description={registerContent.description || "Share a few details and we'll match your child with the perfect tutor."}
      gradeLabel={registerContent.gradeLabel || 'Choose Grade (For Year 2026)'}
      subjects={Array.isArray(registerContent.subjects) ? registerContent.subjects : []}
    />
  )
}