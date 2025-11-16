import RegisterPageClient from "@/components/register/register-page.client"
import { getSubjectsContent } from "@/lib/subjects"

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

  return <RegisterPageClient packages={packages} recaptchaSiteKey={recaptchaSiteKey} />
}