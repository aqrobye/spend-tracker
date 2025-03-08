
import { subDays, isAfter, isSameDay, format, parseISO } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

// Categories with their corresponding icons
export const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Shopping",
  "Housing",
  "Transportation",
  "Entertainment",
  "Healthcare",
  "Education",
  "Personal Care",
  "Travel",
  "Utilities",
  "Other"
];

// Load expenses from Supabase
export const loadExpenses = async (): Promise<Expense[]> => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*');
    
    if (error) {
      console.error('Error loading expenses from Supabase:', error);
      // Fallback to localStorage if Supabase fails
      const saved = localStorage.getItem('expenses');
      if (saved) {
        return JSON.parse(saved);
      }
      return [];
    }
    
    // Transform Supabase data to match our Expense interface
    return data.map(item => ({
      id: item.id.toString(), // Convert number to string
      amount: item.amount || 0,
      category: item.category || 'Other',
      description: item.description || '',
      date: item.date || new Date().toISOString().split('T')[0]
    }));
  } catch (error) {
    console.error('Failed to load expenses:', error);
    // Fallback to localStorage if Supabase fails
    const saved = localStorage.getItem('expenses');
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  }
};

// Save expenses to Supabase
export const saveExpenses = async (expenses: Expense[]): Promise<void> => {
  try {
    // First, save to localStorage as backup
    localStorage.setItem('expenses', JSON.stringify(expenses));
    
    // We won't actually use this function to save to Supabase
    // Instead, we'll handle individual add/delete operations in the context
  } catch (error) {
    console.error('Failed to save expenses to localStorage:', error);
  }
};

// Add a new expense to Supabase
export const addExpenseToSupabase = async (expense: Omit<Expense, 'id'>): Promise<Expense | null> => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .insert([{
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        date: expense.date
      }])
      .select();
    
    if (error) {
      console.error('Error adding expense to Supabase:', error);
      return null;
    }
    
    if (data && data.length > 0) {
      return {
        id: data[0].id.toString(), // Convert number to string
        amount: data[0].amount,
        category: data[0].category,
        description: data[0].description,
        date: data[0].date
      };
    }
    
    return null;
  } catch (error) {
    console.error('Failed to add expense to Supabase:', error);
    return null;
  }
};

// Delete an expense from Supabase
export const deleteExpenseFromSupabase = async (id: string): Promise<boolean> => {
  try {
    // Convert string id to number before using it in the query
    // This is the fix for the TypeScript error
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', parseInt(id));
    
    if (error) {
      console.error('Error deleting expense from Supabase:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete expense from Supabase:', error);
    return false;
  }
};

// Import expenses to Supabase
export const importExpensesToSupabase = async (expenses: Expense[]): Promise<number> => {
  try {
    // Transform expenses to match Supabase schema
    const supabaseExpenses = expenses.map(exp => ({
      amount: exp.amount,
      category: exp.category,
      description: exp.description,
      date: exp.date
    }));
    
    const { data, error } = await supabase
      .from('expenses')
      .insert(supabaseExpenses)
      .select();
    
    if (error) {
      console.error('Error importing expenses to Supabase:', error);
      return 0;
    }
    
    return data?.length || 0;
  } catch (error) {
    console.error('Failed to import expenses to Supabase:', error);
    return 0;
  }
};

// Export expenses from Supabase
export const exportExpensesFromSupabase = async (): Promise<Expense[]> => {
  return await loadExpenses();
};

// Get daily expenses (today)
export const getDailyExpenses = (expenses: Expense[]): Expense[] => {
  const today = new Date();
  return expenses.filter(expense => isSameDay(parseISO(expense.date), today));
};

// Get weekly expenses (last 7 days)
export const getWeeklyExpenses = (expenses: Expense[]): Expense[] => {
  const weekAgo = subDays(new Date(), 7);
  return expenses.filter(expense => isAfter(parseISO(expense.date), weekAgo));
};

// Get monthly expenses (last 30 days)
export const getMonthlyExpenses = (expenses: Expense[]): Expense[] => {
  const monthAgo = subDays(new Date(), 30);
  return expenses.filter(expense => isAfter(parseISO(expense.date), monthAgo));
};

// Group expenses by date
export const groupExpensesByDate = (expenses: Expense[]): Record<string, Expense[]> => {
  return expenses.reduce((groups, expense) => {
    const date = format(parseISO(expense.date), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(expense);
    return groups;
  }, {} as Record<string, Expense[]>);
};

// Group expenses by category
export const groupExpensesByCategory = (expenses: Expense[]): Record<string, number> => {
  return expenses.reduce((grouped, expense) => {
    const category = expense.category || 'Other';
    if (!grouped[category]) {
      grouped[category] = 0;
    }
    grouped[category] += expense.amount;
    return grouped;
  }, {} as Record<string, number>);
};

// Calculate total expenses
export const calculateTotal = (expenses: Expense[]): number => {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

// Generate a unique ID for new expenses
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format date for display
export const formatDateForDisplay = (dateStr: string): string => {
  return format(parseISO(dateStr), 'MMM d, yyyy');
};
