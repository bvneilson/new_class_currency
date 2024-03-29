import { Link } from "react-router-dom";

// A function to generate initials from the classroom name
function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function ClassroomTable({ classrooms }) {
  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
      {classrooms.map((classroom) => (
        <li
          key={classroom.id}
          className="overflow-hidden rounded-xl border border-gray-200"
        >
          <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
            {/* Replace imageUrl with initials */}
            <div className="h-12 w-12 flex-none rounded-lg bg-white flex items-center justify-center ring-1 ring-gray-900/10 text-gray-900 font-medium">
              {getInitials(classroom.name)}
            </div>
            <div className="text-sm font-medium leading-6 text-gray-900">
              {classroom.name}
            </div>
          </div>
          <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500">Classroom Currency Name</dt>
              <dd className="text-gray-700">
                <div className="font-medium text-gray-900">
                  {classroom.currency_name}
                </div>
              </dd>
            </div>
          </dl>
        </li>
      ))}
      <li>
        <Link
          to="/new-classroom"
          type="button"
          className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-circle-plus"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#2c3e50"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <circle cx="12" cy="12" r="9" />
              <line x1="9" y1="12" x2="15" y2="12" />
              <line x1="12" y1="9" x2="12" y2="15" />
            </svg>
          </svg>
          <span className="mt-2 block text-sm font-semibold text-gray-900">
            Create a new classroom
          </span>
        </Link>
      </li>
    </ul>
  );
}

export default ClassroomTable;
