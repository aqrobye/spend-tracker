
import React, { useState } from 'react';
import { useExpenses } from '@/context/ExpenseContext';
import { 
  getDailyExpenses, 
  getWeeklyExpenses, 
  getMonthlyExpenses, 
  calculateTotal, 
  formatCurrency,
  groupExpensesByCategory
} from '@/utils/expenseUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, BarChart3, Clock } from 'lucide-react';
import ChartSection from './ChartSection';
import AnimatedSection from './AnimatedSection';

const Reports: React.FC = () => {
  const { expenses } = useExpenses();
  const [activeTab, setActiveTab] = useState('daily');

  const dailyExpenses = getDailyExpenses(expenses);
  const weeklyExpenses = getWeeklyExpenses(expenses);
  const monthlyExpenses = getMonthlyExpenses(expenses);

  const dailyTotal = calculateTotal(dailyExpenses);
  const weeklyTotal = calculateTotal(weeklyExpenses);
  const monthlyTotal = calculateTotal(monthlyExpenses);

  const getCategoryBreakdown = (expenseList: typeof expenses) => {
    const categorized = groupExpensesByCategory(expenseList);
    return Object.entries(categorized)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  };

  const topDailyCategories = getCategoryBreakdown(dailyExpenses);
  const topWeeklyCategories = getCategoryBreakdown(weeklyExpenses);
  const topMonthlyCategories = getCategoryBreakdown(monthlyExpenses);

  const renderSummaryCard = (
    title: string, 
    total: number, 
    topCategories: [string, number][], 
    icon: React.ReactNode,
    delay: number
  ) => (
    <AnimatedSection
      className="glass-card rounded-xl p-6 space-y-4"
      delay={delay}
    >
      <div className="flex items-center space-x-3">
        <div className="bg-primary/10 text-primary rounded-full p-2">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">Summary Report</p>
        </div>
      </div>
      
      <div className="text-3xl font-bold">
        {formatCurrency(total)}
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Top Categories</h4>
        {topCategories.length > 0 ? (
          <div className="space-y-1">
            {topCategories.map(([category, amount]) => (
              <div key={category} className="flex justify-between text-sm">
                <span>{category}</span>
                <span className="font-medium">{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No expenses recorded</p>
        )}
      </div>
    </AnimatedSection>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="daily" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="daily" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            Daily
          </TabsTrigger>
          <TabsTrigger value="weekly" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Clock className="mr-2 h-4 w-4" />
            Weekly
          </TabsTrigger>
          <TabsTrigger value="monthly" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BarChart3 className="mr-2 h-4 w-4" />
            Monthly
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="space-y-6">
          {renderSummaryCard(
            "Today's Spending", 
            dailyTotal, 
            topDailyCategories, 
            <Calendar className="h-5 w-5" />,
            0.1
          )}
        </TabsContent>
        
        <TabsContent value="weekly" className="space-y-6">
          {renderSummaryCard(
            "Last 7 Days", 
            weeklyTotal, 
            topWeeklyCategories, 
            <Clock className="h-5 w-5" />,
            0.1
          )}
        </TabsContent>
        
        <TabsContent value="monthly" className="space-y-6">
          {renderSummaryCard(
            "Last 30 Days", 
            monthlyTotal, 
            topMonthlyCategories, 
            <BarChart3 className="h-5 w-5" />,
            0.1
          )}
        </TabsContent>
      </Tabs>
      
      <AnimatedSection delay={0.2}>
        <ChartSection />
      </AnimatedSection>
    </div>
  );
};

export default Reports;
