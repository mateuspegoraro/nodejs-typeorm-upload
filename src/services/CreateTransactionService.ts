import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    let categoryFound = await categoryRepository.findOne({
      where: { title: category },
    });
    if (type === 'outcome') {
      const balance = await transactionsRepository.getBalance();
      const nextTotal = balance.total - value;
      if (nextTotal < 0) {
        throw new AppError('Balance is negative!!');
      }
    }

    if (!categoryFound) {
      categoryFound = categoryRepository.create({
        title: category,
      });

      categoryFound = await categoryRepository.save(categoryFound);
    }
    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryFound.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
