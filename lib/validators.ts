import { z } from 'zod';

/**
 * Schemas de validación Zod para los archivos JSON de /data.
 *
 * Por qué Zod además de las interfaces TypeScript:
 * - TypeScript solo valida en tiempo de compilación.
 * - Zod valida en RUNTIME: detecta JSONs corruptos, campos faltantes
 *   o valores fuera del set de tipos literales permitidos.
 * - z.enum() garantiza que los valores del JSON coincidan exactamente
 *   con los tipos literales definidos en lib/types.ts.
 */

// ─────────────────────────────────────────────────────────
// HomeDataSchema — valida /data/home.json en runtime
// ─────────────────────────────────────────────────────────

export const HomeDataSchema = z.object({
  hero: z.object({
    title: z.string().min(1),
    subtitle: z.string(),
    description: z.string(),
    /**
     * z.enum() refleja el tipo literal union de HomeData.animationStyle.
     * Si el JSON contiene un valor distinto (ej: "bounce"), Zod lanza
     * un ZodError descriptivo antes de que llegue al componente UI.
     */
    animationStyle: z.enum(['typewriter', 'fadeIn', 'slideUp']),
  }),
  meta: z.object({
    pageTitle: z.string().min(1),
    description: z.string(),
  }),
});

/**
 * Tipo inferido desde el schema — compatibilidad total con HomeData.
 * Útil cuando se quiere el tipo derivado del schema sin importar types.ts.
 */
export type HomeDataZod = z.infer<typeof HomeDataSchema>;

// ─────────────────────────────────────────────────────────
// AppConfigSchema — valida /data/config.json en runtime
// ─────────────────────────────────────────────────────────

export const AppConfigSchema = z.object({
  appName: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Debe ser formato semver (ej: 1.0.0)'),
  locale: z.string().min(2),
  /**
   * z.enum() para theme garantiza que solo 'light' o 'dark' sean válidos.
   * Un string genérico permitiría valores como "blue" sin error en runtime.
   */
  theme: z.enum(['light', 'dark']),
});

/**
 * Tipo inferido desde el schema — compatibilidad total con AppConfig.
 */
export type AppConfigZod = z.infer<typeof AppConfigSchema>;
