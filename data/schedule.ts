/*
  Órarend — termenként, három oszlopban (a design szerint).

  Egy óra mezői:
    id        egyedi azonosító (a kiválasztás ezzel működik)
    title     a kártya félkövér sora
    subtitle  a kártya kisbetűs alsó sora
    chip      rövid felirat a kiválasztott-chipeken
    full      a jelentkezésbe kerülő teljes leírás
*/

export type ClassItem = {
  id: string;
  title: string;
  subtitle: string;
  chip: string;
  full: string;
};

export type ScheduleColumn = {
  heading: string;
  classes: ClassItem[];
};

export type Room = {
  id: "nagy" | "kozepes";
  /** Teljes név, pl. a terem-váltó gombján. */
  name: string;
  /** Az órák sorának minimum magassága (Tailwind osztály). */
  minHeightClass: string;
  columns: [ScheduleColumn, ScheduleColumn, ScheduleColumn];
};

export const rooms: Room[] = [
  {
    id: "nagy",
    name: "Nagy terem",
    minHeightClass: "min-h-[280px]",
    columns: [
      {
        heading: "Hétfő · Szerda",
        classes: [
          {
            id: "ora-nagy-0-0",
            title: "Hétfő · 17:00 Beginner",
            subtitle: "NewJeans Style",
            chip: "Nagy · Hétfő 17:00",
            full: "Nagy terem · Hétfő · 17:00 Beginner — NewJeans Style",
          },
          {
            id: "ora-nagy-0-1",
            title: "Szerda · 18:30 Advanced",
            subtitle: "Stray Kids Choreo",
            chip: "Nagy · Szerda 18:30",
            full: "Nagy terem · Szerda · 18:30 Advanced — Stray Kids Choreo",
          },
        ],
      },
      {
        heading: "Kedd · Csütörtök",
        classes: [
          {
            id: "ora-nagy-1-0",
            title: "Kedd · 17:30 Intermediate",
            subtitle: "IVE — Baddie",
            chip: "Nagy · Kedd 17:30",
            full: "Nagy terem · Kedd · 17:30 Intermediate — IVE — Baddie",
          },
          {
            id: "ora-nagy-1-1",
            title: "Csütörtök · 19:00 Haladó",
            subtitle: "Blackpink Essentials",
            chip: "Nagy · Csütörtök 19:00",
            full: "Nagy terem · Csütörtök · 19:00 Haladó — Blackpink Essentials",
          },
        ],
      },
      {
        heading: "Péntek",
        classes: [
          {
            id: "ora-nagy-2-0",
            title: "16:00 Kids Pop",
            subtitle: "Twice Medley",
            chip: "Nagy · Péntek 16:00",
            full: "Nagy terem · 16:00 Kids Pop — Twice Medley",
          },
        ],
      },
    ],
  },
  {
    id: "kozepes",
    name: "Közepes terem",
    minHeightClass: "min-h-[220px]",
    columns: [
      {
        heading: "Hétfő · Szerda",
        classes: [
          {
            id: "ora-kozepes-0-0",
            title: "Szerda · 17:00 Beginner",
            subtitle: "K-pop Basic",
            chip: "Közepes · Szerda 17:00",
            full: "Közepes terem · Szerda · 17:00 Beginner — K-pop Basic",
          },
        ],
      },
      {
        heading: "Kedd · Csütörtök",
        classes: [
          {
            id: "ora-kozepes-1-0",
            title: "Kedd · 17:00 Beginner",
            subtitle: "Blackpink Essentials",
            chip: "Közepes · Kedd 17:00",
            full: "Közepes terem · Kedd · 17:00 Beginner — Blackpink Essentials",
          },
          {
            id: "ora-kozepes-1-1",
            title: "Csütörtök · 18:00 Advanced",
            subtitle: "BTS Legacy Class",
            chip: "Közepes · Csütörtök 18:00",
            full: "Közepes terem · Csütörtök · 18:00 Advanced — BTS Legacy Class",
          },
        ],
      },
      {
        heading: "Péntek",
        classes: [
          {
            id: "ora-kozepes-2-0",
            title: "10:00 Workshop",
            subtitle: "K-Pop Intenzív",
            chip: "Közepes · Péntek 10:00",
            full: "Közepes terem · 10:00 Workshop — K-Pop Intenzív",
          },
        ],
      },
    ],
  },
];

/** Az összes óra, a megjelenési sorrendben (a chipek is ebben a sorrendben jönnek). */
export const allClasses: (ClassItem & { roomId: Room["id"] })[] = rooms.flatMap((room) =>
  room.columns.flatMap((col) => col.classes.map((c) => ({ ...c, roomId: room.id }))),
);
