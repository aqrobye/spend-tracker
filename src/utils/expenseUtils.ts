
import { subDays, isAfter, isSameDay, format, parseISO } from 'date-fns';

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

// Load expenses from localStorage
export const loadExpenses = (): Expense[] => {
  try {
    const saved = localStorage.getItem('expenses');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load expenses:', error);
  }
  return [];
};

// Save expenses to localStorage
export const saveExpenses = (expenses: Expense[]): void => {
  try {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  } catch (error) {
    console.error('Failed to save expenses:', error);
  }
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
