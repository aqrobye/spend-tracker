
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useExpenses } from "@/context/ExpenseContext";
import { EXPENSE_CATEGORIES, Expense } from "@/utils/expenseUtils";
import ExpenseCard from "./ExpenseCard";
import { Search, SlidersHorizontal } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";

const ExpenseList: React.FC = () => {
  const { expenses, filterExpenses } = useExpenses();
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>(expenses);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: ""
  });

  // Update filtered expenses when filters or expenses change
  useEffect(() => {
    const filtered = filterExpenses({
      category: filters.category || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      minAmount: filters.minAmount ? parseFloat(filters.minAmount) : undefined,
      maxAmount: filters.maxAmount ? parseFloat(filters.maxAmount) : undefined,
      searchTerm: searchTerm || undefined
    });
    
    setFilteredExpenses(filtered);
  }, [expenses, filters, searchTerm, filterExpenses]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: ""
    });
    setSearchTerm("");
  };

  return (
    <AnimatedSection className="space-y-4" delay={0.1}>
      <div className="glass-card rounded-xl p-6">
        <div className="flex flex-col space-y-1.5 mb-4">
          <h3 className="text-2xl font-medium">Expense History</h3>
          <p className="text-sm text-muted-foreground">
            {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 expense-input-transition"
            />
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="filters" className="border-none">
              <AccordionTrigger className="py-2 hover:no-underline">
                <div className="flex items-center text-sm">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filter Options
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 pt-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category-filter">Category</Label>
                      <Select
                        value={filters.category}
                        onValueChange={(value) => handleFilterChange("category", value)}
                      >
                        <SelectTrigger id="category-filter">
                          <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All categories</SelectItem>
                          {EXPENSE_CATEGORIES.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="min-amount">Min Amount</Label>
                        <Input
                          id="min-amount"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Min"
                          value={filters.minAmount}
                          onChange={(e) => handleFilterChange("minAmount", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="max-amount">Max Amount</Label>
                        <Input
                          id="max-amount"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Max"
                          value={filters.maxAmount}
                          onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => handleFilterChange("startDate", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date">End Date</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => handleFilterChange("endDate", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    onClick={clearFilters}
                    className="mt-2 w-full md:w-auto md:self-end"
                  >
                    Clear Filters
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      
      {filteredExpenses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExpenses.map((expense, index) => (
            <ExpenseCard key={expense.id} expense={expense} index={index} />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-xl p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No expenses found</h3>
          <p className="text-muted-foreground">
            {expenses.length > 0 
              ? "Try adjusting your filters or search term."
              : "Start by adding your first expense."}
          </p>
        </div>
      )}
    </AnimatedSection>
  );
};

export default ExpenseList;
