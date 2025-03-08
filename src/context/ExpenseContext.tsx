
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Expense, loadExpenses, saveExpenses, generateId } from '../utils/expenseUtils';
import { toast } from "sonner";

interface ExpenseContextProps {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  filterExpenses: (filters: ExpenseFilters) => Expense[];
  isLoading: boolean;
  exportExpenses: () => void;
  importExpenses: (importedExpenses: Expense[]) => void;
}

export interface ExpenseFilters {
  category?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  searchTerm?: string;
}

const ExpenseContext = createContext<ExpenseContextProps | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load expenses on mount
  useEffect(() => {
    const loadData = async () => {
      const data = loadExpenses();
      setExpenses(data);
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  // Save expenses to localStorage when they change
  useEffect(() => {
    if (!isLoading) {
      saveExpenses(expenses);
    }
  }, [expenses, isLoading]);

  // Add a new expense
  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: generateId(),
    };
    
    setExpenses(prevExpenses => [...prevExpenses, newExpense]);
    toast.success("Expense added successfully");
  };

  // Delete an expense
  const deleteExpense = (id: string) => {
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
    toast.success("Expense deleted successfully");
  };

  // Export expenses to JSON file
  const exportExpenses = () => {
    try {
      const jsonData = JSON.stringify(expenses, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `expenses-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Expenses exported successfully");
    } catch (error) {
      console.error("Error exporting expenses:", error);
      toast.error("Failed to export expenses");
    }
  };

  // Import expenses from JSON file
  const importExpenses = (importedExpenses: Expense[]) => {
    try {
      // Validate imported data
      if (!Array.isArray(importedExpenses)) {
        throw new Error("Invalid data format");
      }
      
      // Add new expenses to existing ones
      setExpenses(prevExpenses => {
        // Create a Set of existing expense IDs for quick lookup
        const existingIds = new Set(prevExpenses.map(exp => exp.id));
        
        // Filter out duplicates
        const uniqueImportedExpenses = importedExpenses.filter(exp => !existingIds.has(exp.id));
        
        if (uniqueImportedExpenses.length === 0) {
          toast.info("No new expenses to import");
          return prevExpenses;
        }
        
        toast.success(`Imported ${uniqueImportedExpenses.length} expenses successfully`);
        return [...prevExpenses, ...uniqueImportedExpenses];
      });
    } catch (error) {
      console.error("Error importing expenses:", error);
      toast.error("Failed to import expenses");
    }
  };

  // Filter expenses based on provided filters
  const filterExpenses = (filters: ExpenseFilters): Expense[] => {
    return expenses.filter(expense => {
      // Filter by category
      if (filters.category && expense.category !== filters.category) {
        return false;
      }
      
      // Filter by date range
      if (filters.startDate && new Date(expense.date) < new Date(filters.startDate)) {
        return false;
      }
      
      if (filters.endDate && new Date(expense.date) > new Date(filters.endDate)) {
        return false;
      }
      
      // Filter by amount range
      if (filters.minAmount !== undefined && expense.amount < filters.minAmount) {
        return false;
      }
      
      if (filters.maxAmount !== undefined && expense.amount > filters.maxAmount) {
        return false;
      }
      
      // Filter by search term (description)
      if (filters.searchTerm && !expense.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  };

  return (
    <ExpenseContext.Provider value={{ 
      expenses, 
      addExpense, 
      deleteExpense, 
      filterExpenses,
      isLoading,
      exportExpenses,
      importExpenses
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
