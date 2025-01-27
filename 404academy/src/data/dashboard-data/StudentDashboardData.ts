export interface StudentDataType {
   id: number;
   icon: string;
   count: number;
   title: string;
}

// This will be our template for student dashboard data
export const createStudentDashboardData = (enrolledCoursesCount: number): StudentDataType[] => [
   {
      id: 1,
      icon: "skillgro-notepad",
      count: enrolledCoursesCount,
      title: "ENROLLED COURSES",
   },
];
