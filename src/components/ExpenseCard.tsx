
import React from 'react';
import { Expense, formatCurrency, formatDateForDisplay } from '@/utils/expenseUtils';
import { useExpenses } from '@/context/ExpenseContext';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExpenseCardProps {
  expense: Expense;
  index: number;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, index }) => {
  const { deleteExpense } = useExpenses();

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      "Food & Dining": "bg-emerald-100 text-emerald-800",
      "Shopping": "bg-blue-100 text-blue-800",
      "Housing": "bg-amber-100 text-amber-800",
      "Transportation": "bg-cyan-100 text-cyan-800",
      "Entertainment": "bg-violet-100 text-violet-800",
      "Healthcare": "bg-red-100 text-red-800",
      "Education": "bg-indigo-100 text-indigo-800",
      "Personal Care": "bg-pink-100 text-pink-800",
      "Travel": "bg-yellow-100 text-yellow-800",
      "Utilities": "bg-gray-100 text-gray-800",
      "Other": "bg-purple-100 text-purple-800"
    };
    
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05, 
        ease: [0.23, 1, 0.32, 1] 
      }}
      className="glass-card rounded-xl p-4 flex flex-col space-y-3"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${getCategoryColor(expense.category)}`}>
            {expense.category}
          </span>
          <h3 className="font-medium truncate max-w-[200px]">
            {expense.description || 'Unnamed Expense'}
          </h3>
        </div>
        <div className="text-lg font-semibold">
          {formatCurrency(expense.amount)}
        </div>
      </div>
      
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>{formatDateForDisplay(expense.date)}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => deleteExpense(expense.id)}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default ExpenseCard;
