import { z } from "zod";

const nonEmpty = z.string().trim().min(1);

export const CalendarEventSchema = z.object({
  title: nonEmpty,
  start: nonEmpty.describe("ISO datetime or HH:mm"),
  end: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  allDay: z.boolean().optional(),
  calendar: z.string().optional(),
});

export const SprintTaskSchema = z.object({
  title: nonEmpty,
  status: z.string().optional(),
  project: z.string().optional(),
  priority: z.string().optional(),
  dueDate: z.string().optional(),
  url: z.string().url().optional(),
  assignee: z.string().optional(),
  notes: z.string().optional(),
});

export const SocialPostSchema = z.object({
  title: nonEmpty,
  platform: z.string().optional(),
  status: z.string().optional(),
  scheduledFor: z.string().optional(),
  url: z.string().url().optional(),
  caption: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const WeatherForecastSchema = z.object({
  time: nonEmpty,
  tempC: z.number(),
  condition: z.string().optional(),
  precipitationMm: z.number().optional(),
  icon: z.string().optional(),
});

export const NewsTopicEnum = z.enum([
  "Claude",
  "Expo",
  "React Native",
  "Swift",
  "SwiftUI",
  "Other",
]);

export const NewsItemSchema = z.object({
  title: nonEmpty,
  topic: NewsTopicEnum,
  summary: nonEmpty,
  source: z.string().optional(),
  url: z.string().url().optional(),
  publishedAt: z.string().optional(),
});

export const BriefSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  generatedAt: z.string().optional(),
  summary: z.string().optional(),
  calendar: z
    .object({
      events: z.array(CalendarEventSchema).default([]),
    })
    .default({ events: [] }),
  tasks: z
    .object({
      sprintName: z.string().optional(),
      sprintDates: z.string().optional(),
      items: z.array(SprintTaskSchema).default([]),
    })
    .default({ items: [] }),
  posts: z
    .object({
      items: z.array(SocialPostSchema).default([]),
    })
    .default({ items: [] }),
  weather: z
    .object({
      location: z.string().default("Rijeka, Croatia"),
      summary: z.string().optional(),
      current: z
        .object({
          tempC: z.number(),
          feelsLikeC: z.number().optional(),
          condition: z.string().optional(),
          humidity: z.number().optional(),
          windKph: z.number().optional(),
          icon: z.string().optional(),
        })
        .optional(),
      forecast: z.array(WeatherForecastSchema).default([]),
    })
    .optional(),
  news: z
    .object({
      items: z.array(NewsItemSchema).default([]),
    })
    .default({ items: [] }),
});

export type Brief = z.infer<typeof BriefSchema>;
export type CalendarEvent = z.infer<typeof CalendarEventSchema>;
export type SprintTask = z.infer<typeof SprintTaskSchema>;
export type SocialPost = z.infer<typeof SocialPostSchema>;
export type NewsItem = z.infer<typeof NewsItemSchema>;
export type WeatherForecast = z.infer<typeof WeatherForecastSchema>;
export type NewsTopic = z.infer<typeof NewsTopicEnum>;
