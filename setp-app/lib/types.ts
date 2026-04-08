/**
 * Tipos e interfaces globales TypeScript del sistema.
 * Estos tipos describen la forma de los datos leídos desde /data/*.json.
 *
 * Regla: exportar individualmente (no default export) para facilitar
 * el tree-shaking y los imports selectivos.
 */

// ─────────────────────────────────────────────────────────
// HomeData — Describe la estructura de /data/home.json
// ─────────────────────────────────────────────────────────

export interface HomeData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    /**
     * Tipo literal union — restringe los valores válidos de animación.
     * Usar string causaría errores en tiempo de ejecución si el JSON
     * contiene un valor fuera del set de variantes de Framer Motion.
     */
    animationStyle: 'typewriter' | 'fadeIn' | 'slideUp';
  };
  meta: {
    pageTitle: string;
    description: string;
  };
}

// ─────────────────────────────────────────────────────────
// AppConfig — Describe la estructura de /data/config.json
// ─────────────────────────────────────────────────────────

export interface AppConfig {
  appName: string;
  version: string;
  locale: string;
  /**
   * Tipo literal union — restringe el tema a valores conocidos.
   * Permite que el sistema de diseño compruebe exhaustivamente
   * todos los temas posibles sin casteos inseguros.
   */
  theme: 'light' | 'dark';
}
