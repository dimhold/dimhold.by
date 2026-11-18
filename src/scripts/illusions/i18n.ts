/* Строки, которые демонстрации пишут сами: на холсте, в строке вывода, в заданиях.
 *
 * Модули демонстраций пишут их по-русски и оборачивают в tr(). Язык берётся из
 * <html lang>, перевод — из словаря по русскому тексту. Подстановки пишутся как {n} и
 * передаются вторым аргументом, чтобы порядок слов в переводе мог быть своим.
 * Строка, которой нет в словаре, выводится по-русски: это видно и чинится одной
 * строкой в словаре.
 */
import { EN } from './i18n/en';
import { BE } from './i18n/be';

const lang = typeof document !== 'undefined' ? document.documentElement.lang : 'ru';
const dict: Record<string, string> = lang === 'en' ? EN : lang === 'be' ? BE : {};

export const pageLang = lang;

export function tr(s: string, vars?: Record<string, string | number>): string {
  let out = dict[s] ?? s;
  if (vars) for (const [k, v] of Object.entries(vars)) out = out.split(`{${k}}`).join(String(v));
  return out;
}

/** Десятичная запятая по-русски и по-беларуски, точка по-английски. */
export const num = (x: number, digits = 1): string => {
  const s = x.toFixed(digits);
  return lang === 'en' ? s : s.replace('.', ',');
};
