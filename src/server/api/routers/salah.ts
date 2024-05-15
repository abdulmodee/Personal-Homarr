import { z } from 'zod';

import { adminProcedure, createTRPCRouter, publicProcedure } from '../trpc';

const citySchema = z.object({
  id: z.number(),
  name: z.string(),
  country: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
});

const salahSchema = z.object({
  timings: z.object({
    Fajr: z.string(),
    Sunrise: z.string(),
    Dhuhr: z.string(),
    Asr: z.string(),
    Maghrib: z.string(),
    Isha: z.string(),
  }),
});

export const salahRouter = createTRPCRouter({
  findCity: adminProcedure
    .input(
      z.object({
        query: z.string().min(2),
      })
    )
    .output(
      z.object({
        result: z.array(citySchema),
      })
    )
    .query(async ({ input }) => fetchCity(input.query)),
  retrievePrayer: publicProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
      })
    )
    .output(salahSchema)
    .query(async ({ input }) => {
      const res = await fetch(
        `http://api.aladhan.com/v1/timings?latitude=${input.latitude}&longitude=${input.longitude}`
      );
      const jsonData = await res.json();

      // Extract and return the 'data' object
      return jsonData.data;
    }),
});

export type City = z.infer<typeof citySchema>;
export type Salah = z.infer<typeof salahSchema>;

const outputSchema = z.object({
  result: z.array(citySchema),
});

export const fetchCity = async (query: string) => {
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}`);
  return outputSchema.parse(await res.json());
};
