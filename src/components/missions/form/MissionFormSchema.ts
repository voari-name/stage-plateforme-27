
import * as z from "zod";

export const missionSchema = z.object({
  titre: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  status: z.enum(["not_started", "in_progress", "completed"]),
  dateDebut: z.date({
    required_error: "Une date de début est requise",
  }),
  dateFin: z.date({
    required_error: "Une date de fin est requise",
  }),
  departement: z.string().min(2, "Le département doit être spécifié"),
  progress: z.number().min(0).max(100).default(0),
});

export type MissionFormValues = z.infer<typeof missionSchema>;
