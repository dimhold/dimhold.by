/* Общий тип для всех групп русских текстов. */

export interface Copy {
  /** Одна строка — то, ради чего сюда пришли. */
  lede: string;
  /** Что видно. Без объяснений. */
  what: string;
  /** Как это устроено. Абзацами. */
  how: string[];
  /** Ключ демонстрации в components/illusions. */
  demo?: string;
  /** Что делает ручка под демонстрацией и зачем она там. */
  demoNote?: string;
  /** Спорное, неожиданное или просто хорошая история. */
  twist?: string;
  /** Предупреждение. Показывается до запуска демонстрации. */
  caution?: string;
}

export type Group = Record<string, Copy>;
