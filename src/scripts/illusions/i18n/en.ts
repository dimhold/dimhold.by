/* Перевод строк демонстраций (en) по русскому тексту. См. ../i18n.ts.
   Разбит на части, чтобы над разными семействами демонстраций можно было работать
   независимо. */
import { EN_A } from './en/a';
import { EN_B } from './en/b';

export const EN: Record<string, string> = { ...EN_A, ...EN_B };
