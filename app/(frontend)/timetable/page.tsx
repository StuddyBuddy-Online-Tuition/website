import MasterTimetable from "@/components/timetable/master-timetable"
import { getAllSubjects } from "@/app/(frontend)/server/supabase/queries/subjects"
import { getAllTimeslots } from "@/app/(frontend)/server/supabase/queries/timeslots"
import { getTimetableContent } from "@/lib/timetable"

export default async function MasterSubjectsTimetablePage() {
  const subjects = await getAllSubjects()
  const normalizedSubjects = subjects.map((s) => ({ ...s, standard: s.standard.toUpperCase() }))

  const timeslots = await getAllTimeslots()
  const normalTimeslots = timeslots.filter((t) => t.studentId === null)
  
  const timetableContent = await getTimetableContent()
  const availableGrades = Array.isArray(timetableContent.availableGrades) 
    ? timetableContent.availableGrades.map((g) => ({ value: g.value || '', label: g.label || '' }))
    : []

  return (
    <div className="bg-white py-16">
      <main>
        <div className="container px-4 md:px-6">
          <MasterTimetable
            initialSubjects={normalizedSubjects}
            initialTimeslots={normalTimeslots}
            title={timetableContent.title || 'Master Timetable'}
            description={timetableContent.description || 'Select up to 5 standards/forms to display.'}
            availableGrades={availableGrades}
          />
        </div>
      </main>
    </div>
  )
}


