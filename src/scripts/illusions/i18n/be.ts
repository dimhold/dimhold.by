/* Перевод строк демонстраций (be) по русскому тексту. См. ../i18n.ts.
   Разбит на части, чтобы над разными семействами демонстраций можно было работать
   независимо. */
import { BE_A } from './be/a';
import { BE_B } from './be/b';

export const BE: Record<string, string> = { ...BE_A, ...BE_B };
