import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  public averageCalculation(arr: number[]): number {
    const data = arr.reduce(
      (previousValue, currentValue) => {
        let { sum, count } = previousValue;
        if (currentValue) {
          sum += currentValue;
          count += 1;
        }
        return { sum, count };
      },
      { sum: 0, count: 0 },
    );
    return data.sum / data.count || null;
  }

  public sortFunction(a, b) {
    if (a.rankScore < b.rankScore) {
      return -1;
    }
    if (a.rankScore > b.rankScore) {
      return 1;
    }
    return 0;
  }
}
