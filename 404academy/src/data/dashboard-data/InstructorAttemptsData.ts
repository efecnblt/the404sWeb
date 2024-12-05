interface DataType {
   id: number,
   date: string;
   title: string;
   name: string;
   qus: number;
   tm: number;
   ca: number;
   result: string;
   result_class?: string;
};

const instructor_attempts_data: DataType[] = [
   {
      id: 1,
      date: "20 Ocak 2024",
      title: "Kendiniz hakkında 5 cümlelik kısa bir yazı yazın",
      name: "Efe Canbolat",
      qus: 4,
      tm: 8,
      ca: 4,
      result: "Geçti",
   },
   {
      id: 2,
      date: "20 Ocak 2024",
      title: "Kendiniz hakkında 5 cümlelik kısa bir yazı yazın",
      name: "Efe Canbolat",
      qus: 2,
      tm: 6,
      ca: 3,
      result: "Kaldı",
      result_class: "fail",
   },
   {
      id: 3,
      date: "20 Ocak 2024",
      title: "Kendiniz hakkında 5 cümlelik kısa bir yazı yazın",
      name: "Efe Canbolat",
      qus: 4,
      tm: 8,
      ca: 4,
      result: "Geçti",
   },
   {
      id: 4,
      date: "20 Ocak 2024",
      title: "Kendiniz hakkında 5 cümlelik kısa bir yazı yazın",
      name: "Efe Canbolat",
      qus: 2,
      tm: 6,
      ca: 3,
      result: "Kaldı",
      result_class: "fail",
   },
   {
      id: 5,
      date: "20 Ocak 2024",
      title: "Kendiniz hakkında 5 cümlelik kısa bir yazı yazın",
      name: "Efe Canbolat",
      qus: 4,
      tm: 8,
      ca: 4,
      result: "Geçti",
   },
   {
      id: 6,
      date: "20 Ocak 2024",
      title: "Kendiniz hakkında 5 cümlelik kısa bir yazı yazın",
      name: "Efe Canbolat",
      qus: 2,
      tm: 6,
      ca: 3,
      result: "Kaldı",
      result_class: "fail",
   },
   {
      id: 7,
      date: "20 Ocak 2024",
      title: "Kendiniz hakkında 5 cümlelik kısa bir yazı yazın",
      name: "Efe Canbolat",
      qus: 4,
      tm: 8,
      ca: 4,
      result: "Geçti",
   },
   {
      id: 8,
      date: "20 Ocak 2024",
      title: "Kendiniz hakkında 5 cümlelik kısa bir yazı yazın",
      name: "Efe Canbolat",
      qus: 2,
      tm: 6,
      ca: 3,
      result: "Kaldı",
      result_class: "fail",
   },
];

export default instructor_attempts_data;