import MasterTimetable from "@/components/timetable/master-timetable"
import { getAllSubjects } from "@/app/(frontend)/server/supabase/queries/subjects"
import { getAllTimeslots } from "@/app/(frontend)/server/supabase/queries/timeslots"

export default async function MasterSubjectsTimetablePage() {
  const subjects = await getAllSubjects()
  const normalizedSubjects = subjects.map((s) => ({ ...s, standard: s.standard.toUpperCase() }))

  const timeslots = await getAllTimeslots()
  const normalTimeslots = timeslots.filter((t) => t.studentId === null)
  return (
    <div className="bg-white py-16">
      <main>
        <div className="container px-4 md:px-6">
          <MasterTimetable initialSubjects={normalizedSubjects} initialTimeslots={normalTimeslots} />
        </div>
      </main>
    </div>
  )
}


