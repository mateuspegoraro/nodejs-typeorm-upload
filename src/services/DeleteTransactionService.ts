import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepo = getRepository(Transaction);

    const transactionFound = await transactionRepo.findOne({
      where: {
        id,
      },
    });

    if (!transactionFound) {
      throw new AppError('Transaction not found!');
    }

    await transactionRepo.delete(transactionFound.id);
  }
}

export default DeleteTransactionService;
