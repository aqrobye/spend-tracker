import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Expense, 
  loadExpenses, 
  saveExpenses, 
  generateId, 
  addExpenseToSupabase, 
  deleteExpenseFromSupabase,
  importExpensesToSupabase,
  exportExpensesFromSupabase
} from '../utils/expenseUtils';
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
      setIsLoading(true);
      try {
        const data = await loadExpenses();
        setExpenses(data);
      } catch (error) {
        console.error("Error loading expenses:", error);
        toast.error("Failed to load expenses");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Add a new expense
  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    try {
      // Add to Supabase
      const newExpense = await addExpenseToSupabase(expenseData);
      
      if (newExpense) {
        // Update local state
        setExpenses(prevExpenses => [...prevExpenses, newExpense]);
        toast.success("Expense added successfully");
      } else {
        // Fallback to local storage if Supabase fails
        const fallbackExpense: Expense = {
          ...expenseData,
          id: generateId(),
        };
        
        setExpenses(prevExpenses => [...prevExpenses, fallbackExpense]);
        toast.success("Expense added locally (offline mode)");
        
        // Save updated expenses to local storage
        await saveExpenses([...expenses, fallbackExpense]);
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense");
    }
  };

  // Delete an expense
  const deleteExpense = async (id: string) => {
    try {
      // Delete from Supabase
      const success = await deleteExpenseFromSupabase(id);
      
      if (success) {
        // Update local state
        setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
        toast.success("Expense deleted successfully");
      } else {
        // Fallback to local storage if Supabase fails
        const updatedExpenses = expenses.filter(expense => expense.id !== id);
        setExpenses(updatedExpenses);
        toast.success("Expense deleted locally (offline mode)");
        
        // Save updated expenses to local storage
        await saveExpenses(updatedExpenses);
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  // Export expenses to JSON file
  const exportExpenses = async () => {
    try {
      // Get expenses from Supabase
      const expensesToExport = await exportExpensesFromSupabase();
      
      // Create JSON file for download
      const jsonData = JSON.stringify(expensesToExport, null, 2);
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
  const importExpenses = async (importedExpenses: Expense[]) => {
    try {
      // Validate imported data
      if (!Array.isArray(importedExpenses)) {
        throw new Error("Invalid data format");
      }
      
      // Import to Supabase
      const importedCount = await importExpensesToSupabase(importedExpenses);
      
      if (importedCount > 0) {
        // Reload expenses from Supabase
        const updatedExpenses = await loadExpenses();
        setExpenses(updatedExpenses);
        toast.success(`Imported ${importedCount} expenses successfully`);
      } else {
        toast.info("No new expenses to import");
      }
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
