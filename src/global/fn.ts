import { instanceToPlain } from 'class-transformer';

export const merge = <T extends object>(origin, dto = {}): T => {
  const merged = { ...origin };
  for (const [key] of Object.entries(origin)) {
    if (key in origin) {
      if (dto[key]) merged[key] = dto[key];
    }
  }
  return instanceToPlain(merged, {
    exposeUnsetFields: false,
  }) as T;
};
