import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const incomeValues = transactions
      .filter(t => t.type === 'income')
      .map(t => t.value);

    const outcomeValues = transactions
      .filter(t => t.type === 'outcome')
      .map(t => t.value);

    let sumIncome = 0;
    let sumOutcome = 0;

    if (incomeValues.length) {
      sumIncome = incomeValues.reduce(
        (acumulator: number, value: number) => acumulator + value,
      );
    }
    if (outcomeValues.length) {
      sumOutcome = outcomeValues.reduce(
        (acumulator: number, value: number) => acumulator + value,
      );
    }

    const balance = {
      income: sumIncome,
      outcome: sumOutcome,
      total: sumIncome - sumOutcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
