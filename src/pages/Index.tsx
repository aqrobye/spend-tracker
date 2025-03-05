
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, BarChart4, List } from "lucide-react";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import Reports from "@/components/Reports";
import { ExpenseProvider } from "@/context/ExpenseContext";
import { motion } from "framer-motion";

const Index = () => {
  const [activeTab, setActiveTab] = useState('add');

  return (
    <ExpenseProvider>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="max-w-6xl mx-auto mb-8 text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight">Expenses Tracker</h1>
          <p className="mt-3 text-xl text-muted-foreground">Track, analyze, and manage your expenses with ease</p>
        </motion.div>
        
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="add" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="add" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Expense
              </TabsTrigger>
              <TabsTrigger value="list" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <List className="mr-2 h-4 w-4" />
                Expense List
              </TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <BarChart4 className="mr-2 h-4 w-4" />
                Reports
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="add" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <ExpenseForm />
                </div>
                <div className="md:col-span-2">
                  <Reports />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="list">
              <ExpenseList />
            </TabsContent>
            
            <TabsContent value="reports">
              <Reports />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ExpenseProvider>
  );
};

export default Index;
