import Navbar from "@/components/navigation/navbar"
import ProtectedRoute from '@/components/utils/protectedRoute';
import DateToday from "@/components/utils/dateToday"
import Cumpleaños from "@/components/utils/cumpleañeros"

export default function Page() {
  return (<ProtectedRoute>
    <Navbar />
    <DateToday />
    <Cumpleaños />
  </ProtectedRoute>)
}