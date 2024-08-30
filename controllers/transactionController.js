import Transaction from '../models/Transaction.js';

export const addTransaction = async (req, res) => {
    const { amount, type, category, description } = req.body;
    try {
        const transaction = new Transaction({
            user: req.user.id,
            amount,
            type,
            category,
            description,
        });
        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ error: 'Adding transaction failed' });
    }
};

export const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id });
        res.json(transactions);
    } catch (error) {
        res.status(400).json({ error: 'Fetching transactions failed' });
    }
};
