
import MyBooksTable from '@/components/dashboard/librarian/MyBooksTable'
import { getAllBooks } from '@/lib/api/admin/getAdminApi'
import { getUserSession } from '@/lib/core/session'

const MyBookPage = async () => {
  const user = await getUserSession()
  const books = await getAllBooks()

  const isAdmin = true;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mx-auto">
        <div className="mb-6">
          <p className="text-xs font-medium uppercase tracking-widest text-[#fc4a32] mb-1">
            My Library
          </p>
          <h1 className="text-2xl font-bold text-gray-800">Manage All Books</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track all published/pending catalogue
          </p>
        </div>

        <MyBooksTable
          initialBooks={books}
          isAdmin = {isAdmin}
        />
      </div>
    </div>
  )
}

export default MyBookPage