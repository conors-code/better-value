"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProgramsManagement from "@/components/programs-management"
import IndicatorsManagement from "@/components/indicators-management"
import ActualsManagement from "@/components/actuals-management"
import { ThemeProvider } from "@/components/theme-provider"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("programs")

  return (
    <ThemeProvider>
      <div className="container mx-auto py-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#510D77]">Better Value Management System</h1>
          <p className="text-[#907797]">Track and manage your value-generating programs and initiatives</p>
        </header>

        <Tabs defaultValue="programs" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger
              value="programs"
              className="text-[#510D77] data-[state=active]:bg-[#510D77] data-[state=active]:text-white"
            >
              Programs & Initiatives
            </TabsTrigger>
            <TabsTrigger
              value="indicators"
              className="text-[#510D77] data-[state=active]:bg-[#510D77] data-[state=active]:text-white"
            >
              Indicators & Priorities
            </TabsTrigger>
            <TabsTrigger
              value="actuals"
              className="text-[#510D77] data-[state=active]:bg-[#510D77] data-[state=active]:text-white"
            >
              Actual Values
            </TabsTrigger>
          </TabsList>

          <TabsContent value="programs" className="space-y-4">
            <ProgramsManagement />
          </TabsContent>

          <TabsContent value="indicators" className="space-y-4">
            <IndicatorsManagement />
          </TabsContent>

          <TabsContent value="actuals" className="space-y-4">
            <ActualsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </ThemeProvider>
  )
}

