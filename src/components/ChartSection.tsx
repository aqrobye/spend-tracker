
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { format, parseISO, subDays, eachDayOfInterval } from 'date-fns';
import { useExpenses } from '@/context/ExpenseContext';
import { groupExpensesByCategory, groupExpensesByDate, formatCurrency } from '@/utils/expenseUtils';
import { motion } from 'framer-motion';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', 
  '#82CA9D', '#FFC658', '#8DD1E1', '#A4DE6C', '#D0ED57', '#F5E050'
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-2 text-xs shadow-lg">
        <p className="label font-medium">{`${payload[0].name}`}</p>
        <p className="intro">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }

  return null;
};

const ChartSection: React.FC = () => {
  const { expenses } = useExpenses();
  
  // Prepare data for category chart
  const categoryData = React.useMemo(() => {
    const grouped = groupExpensesByCategory(expenses);
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  // Prepare data for weekly spending chart
  const weeklyData = React.useMemo(() => {
    const today = new Date();
    const sevenDaysAgo = subDays(today, 7);
    
    // Create array of all dates in the last 7 days
    const dateRange = eachDayOfInterval({ start: sevenDaysAgo, end: today });
    
    // Initialize with zero values
    const datesWithZero = dateRange.map(date => ({
      date: format(date, 'yyyy-MM-dd'),
      amount: 0
    }));
    
    // Group expenses by date
    const groupedByDate = groupExpensesByDate(expenses);
    
    // Merge the grouped data with the date range
    return datesWithZero.map(item => {
      const expensesForDate = groupedByDate[item.date] || [];
      const total = expensesForDate.reduce((sum, exp) => sum + exp.amount, 0);
      return {
        date: format(parseISO(item.date), 'MMM dd'),
        amount: total
      };
    });
  }, [expenses]);

  if (expenses.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6 text-center">
        <h3 className="text-lg font-medium mb-2">No data to visualize</h3>
        <p className="text-muted-foreground">Add some expenses to see charts and visualizations.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="glass-card rounded-xl p-6"
      >
        <h3 className="text-lg font-medium mb-4">Spending by Category</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
        className="glass-card rounded-xl p-6"
      >
        <h3 className="text-lg font-medium mb-4">Daily Spending (Last 7 Days)</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="#0088FE" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default ChartSection;
