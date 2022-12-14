import { ERateType } from 'types';

export const calculateResultWithRate = (
  rateType: ERateType,
  rate: string,
  num: number
): number => {
  switch (rateType) {
    case ERateType.MUL:
      return num * (Number(rate) || 1);
    case ERateType.DIV:
      return num / (Number(rate) || 1);
    case ERateType.ADD:
      return num + (Number(rate) || 1);
    case ERateType.SUB:
      return num - (Number(rate) || 1);
    case ERateType.ADD_PERC:
      return num * (1 + (Number(rate) || 1) / 100);
    case ERateType.SUB_PERC:
      return num * (1 - (Number(rate) || 1) / 100);
  }

  return num;
};
