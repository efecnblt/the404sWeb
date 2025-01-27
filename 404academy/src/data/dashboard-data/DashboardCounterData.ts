export interface DataType {
   id: number;
   icon: string;
   count: number;
   title: string;
}

// This will be our template, actual data will be populated dynamically
export const createDashboardData = (courseCount: number, studentCount: number, totalEarnings: number): DataType[] => [
   {
      id: 1,
      icon: "skillgro-notepad",
      count: courseCount,
      title: "TOTAL COURSES",
   },
   {
      id: 2,
      icon: "skillgro-group",
      count: studentCount,
      title: "TOTAL STUDENTS",
   },
   {
      id: 3,
      icon: "skillgro-dollar-currency-symbol",
      count: totalEarnings,
      title: "TOTAL EARNINGS",
   },
];