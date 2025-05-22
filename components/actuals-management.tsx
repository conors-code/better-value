"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2, Plus, Calendar, CheckCircle2, AlertCircle, XCircle } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  getIndicators,
  getInitiatives,
  getIndicatorActuals,
  addIndicatorActual,
  updateIndicatorActual,
  deleteIndicatorActual,
  calculateRAGStatus,
  type IndicatorActual,
} from "@/lib/data"

export default function ActualsManagement() {
  const [indicators, setIndicators] = useState(getIndicators())
  const [initiatives, setInitiatives] = useState(getInitiatives())
  const [actuals, setActuals] = useState(getIndicatorActuals())
  const [isAddingActual, setIsAddingActual] = useState(false)
  const [isEditingActual, setIsEditingActual] = useState(false)
  const [selectedActual, setSelectedActual] = useState<IndicatorActual | null>(null)

  // Form states
  const [selectedIndicatorId, setSelectedIndicatorId] = useState("")
  const [selectedInitiativeId, setSelectedInitiativeId] = useState("")
  const [actualValue, setActualValue] = useState("")
  const [isPromised, setIsPromised] = useState(false)
  const [dateEffective, setDateEffective] = useState<Date | null>(null)
  const [valueSource, setValueSource] = useState("promised")

  // Refresh data
  const refreshData = () => {
    setIndicators(getIndicators())
    setInitiatives(getInitiatives())
    setActuals(getIndicatorActuals())
  }

  // Actual handlers
  const handleAddActual = () => {
    setIsAddingActual(true)
    setSelectedIndicatorId("")
    setSelectedInitiativeId("")
    setActualValue("")
    setIsPromised(false)
    setDateEffective(new Date())
    setValueSource("promised")
  }

  const handleEditActual = (actual: IndicatorActual) => {
    setSelectedActual(actual)
    setIsEditingActual(true)
    setSelectedIndicatorId(actual.indicatorId.toString())
    setSelectedInitiativeId(actual.initiativeId.toString())
    setActualValue(actual.value)
    setIsPromised(actual.isPromised)
    setDateEffective(actual.dateEffective)
    setValueSource(actual.source)
  }

  const handleSaveActual = () => {
    if (isAddingActual) {
      addIndicatorActual({
        indicatorId: Number.parseInt(selectedIndicatorId),
        initiativeId: Number.parseInt(selectedInitiativeId),
        value: actualValue,
        isPromised: isPromised,
        dateEffective: dateEffective || new Date(),
        source: valueSource,
      })
    } else if (isEditingActual && selectedActual) {
      updateIndicatorActual(selectedActual.indicatorId, selectedActual.initiativeId, selectedActual.dateEffective, {
        value: actualValue,
        isPromised: isPromised,
        source: valueSource,
      })
    }

    refreshData()
    setIsAddingActual(false)
    setIsEditingActual(false)
  }

  const handleDeleteActual = (actual: IndicatorActual) => {
    if (confirm("Are you sure you want to delete this actual value?")) {
      deleteIndicatorActual(actual.indicatorId, actual.initiativeId, actual.dateEffective)
      refreshData()
    }
  }

  // Helper function to get indicator name
  const getIndicatorName = (id: number) => {
    const indicator = indicators.find((i) => i.id === id)
    return indicator ? indicator.name : "-"
  }

  // Helper function to get initiative name
  const getInitiativeName = (id: number) => {
    const initiative = initiatives.find((i) => i.id === id)
    return initiative ? initiative.name : "-"
  }

  // Helper function to get RAG status
  const getRAGStatus = (actual: IndicatorActual) => {
    const indicator = indicators.find((i) => i.id === actual.indicatorId)
    if (!indicator || !indicator.targetValues || indicator.targetValues.length === 0) {
      return "gray"
    }

    const currentTarget = indicator.targetValues.find(
      (t) => t.dateStart <= actual.dateEffective && (!t.dateEnd || t.dateEnd >= actual.dateEffective),
    )

    if (!currentTarget) {
      return "gray"
    }

    return calculateRAGStatus(actual.value, currentTarget.targetValue, currentTarget.thresholdValue)
  }

  // Helper function to render RAG icon
  const renderRAGIcon = (status: string) => {
    switch (status) {
      case "green":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "amber":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      case "red":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#510D77]">Actual Values</h2>
        <Button onClick={handleAddActual} className="bg-[#510D77] hover:bg-[#907797]">
          <Plus className="mr-2 h-4 w-4" /> Add Actual Value
        </Button>
      </div>

      {actuals.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No actual values found. Add an actual value to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Indicator</TableHead>
              <TableHead>Initiative</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Promised</TableHead>
              <TableHead>Date Effective</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-[#510D77]">
            {actuals.map((actual, index) => {
              const ragStatus = getRAGStatus(actual)
              return (
                <TableRow key={`${actual.indicatorId}-${actual.initiativeId}-${actual.dateEffective.getTime()}`}>
                  <TableCell>{getIndicatorName(actual.indicatorId)}</TableCell>
                  <TableCell>{getInitiativeName(actual.initiativeId)}</TableCell>
                  <TableCell>{actual.value}</TableCell>
                  <TableCell>{actual.isPromised ? "Yes" : "No"}</TableCell>
                  <TableCell>{format(actual.dateEffective, "PP")}</TableCell>
                  <TableCell>{actual.source}</TableCell>
                  <TableCell>
                    <div className="flex justify-center">{renderRAGIcon(ragStatus)}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEditActual(actual)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteActual(actual)}>
                      <Trash2 className="h-4 w-4 text-[#C40D3C]" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}

      {/* Actual Dialog */}
      <Dialog
        open={isAddingActual || isEditingActual}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddingActual(false)
            setIsEditingActual(false)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isAddingActual ? "Add Actual Value" : "Edit Actual Value"}</DialogTitle>
            <DialogDescription>
              {isAddingActual
                ? "Add a new actual value for an indicator."
                : "Edit the details of the selected actual value."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="indicator">Indicator</Label>
              <Select value={selectedIndicatorId} onValueChange={setSelectedIndicatorId} disabled={isEditingActual}>
                <SelectTrigger>
                  <SelectValue placeholder="Select indicator" />
                </SelectTrigger>
                <SelectContent>
                  {indicators.map((indicator) => (
                    <SelectItem key={indicator.id} value={indicator.id.toString()}>
                      {indicator.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="initiative">Initiative</Label>
              <Select value={selectedInitiativeId} onValueChange={setSelectedInitiativeId} disabled={isEditingActual}>
                <SelectTrigger>
                  <SelectValue placeholder="Select initiative" />
                </SelectTrigger>
                <SelectContent>
                  {initiatives.map((initiative) => (
                    <SelectItem key={initiative.id} value={initiative.id.toString()}>
                      {initiative.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="actual-value">Actual Value</Label>
              <Input
                id="actual-value"
                value={actualValue}
                onChange={(e) => setActualValue(e.target.value)}
                placeholder="Enter actual value"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-promised"
                checked={isPromised}
                onCheckedChange={(checked) => setIsPromised(checked === true)}
              />
              <Label htmlFor="is-promised">Is Promised Value</Label>
            </div>

            <div className="grid gap-2">
              <Label>Date Effective</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal" disabled={isEditingActual}>
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateEffective ? format(dateEffective, "PP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={dateEffective || undefined}
                    onSelect={setDateEffective}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="value-source">Value Source</Label>
              <Input
                id="value-source"
                value={valueSource}
                onChange={(e) => setValueSource(e.target.value)}
                placeholder="Enter value source"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingActual(false)
                setIsEditingActual(false)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveActual} className="bg-[#510D77] hover:bg-[#907797]">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

