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
import { Pencil, Trash2, Plus, Calendar, ArrowUp, ArrowDown, Link, Link2OffIcon as LinkOff } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getIndicators,
  addIndicator,
  updateIndicator,
  deleteIndicator,
  addIndicatorPriority,
  addIndicatorTargetValue,
  addIndicatorLead,
  removeIndicatorLead,
  addIndicatorLag,
  removeIndicatorLag,
  type Indicator,
} from "@/lib/data"

export default function IndicatorsManagement() {
  const [indicators, setIndicators] = useState(getIndicators())
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null)
  const [isAddingIndicator, setIsAddingIndicator] = useState(false)
  const [isEditingIndicator, setIsEditingIndicator] = useState(false)
  const [isSettingPriority, setIsSettingPriority] = useState(false)
  const [isSettingTarget, setIsSettingTarget] = useState(false)
  const [isManagingRelationships, setIsManagingRelationships] = useState(false)
  const [relationshipTab, setRelationshipTab] = useState("lead")

  // Form states
  const [indicatorName, setIndicatorName] = useState("")
  const [indicatorDateAdded, setIndicatorDateAdded] = useState<Date | null>(null)
  const [indicatorDateRemoved, setIndicatorDateRemoved] = useState<Date | null>(null)

  const [priorityValue, setPriorityValue] = useState("1")
  const [priorityDateStart, setPriorityDateStart] = useState<Date | null>(null)
  const [priorityDateEnd, setPriorityDateEnd] = useState<Date | null>(null)

  const [targetValue, setTargetValue] = useState("")
  const [thresholdValue, setThresholdValue] = useState("")
  const [targetDateStart, setTargetDateStart] = useState<Date | null>(null)
  const [targetDateEnd, setTargetDateEnd] = useState<Date | null>(null)

  const [selectedLeadIndicator, setSelectedLeadIndicator] = useState("")
  const [selectedLagIndicator, setSelectedLagIndicator] = useState("")

  // Refresh indicators
  const refreshIndicators = () => {
    setIndicators(getIndicators())
  }

  // Indicator handlers
  const handleAddIndicator = () => {
    setIsAddingIndicator(true)
    setIndicatorName("")
    setIndicatorDateAdded(new Date())
    setIndicatorDateRemoved(null)
  }

  const handleEditIndicator = (indicator: Indicator) => {
    setSelectedIndicator(indicator)
    setIsEditingIndicator(true)
    setIndicatorName(indicator.name)
    setIndicatorDateAdded(indicator.dateAdded)
    setIndicatorDateRemoved(indicator.dateRemoved)
  }

  const handleSaveIndicator = () => {
    if (isAddingIndicator) {
      addIndicator({
        name: indicatorName,
        dateAdded: indicatorDateAdded || new Date(),
        dateRemoved: indicatorDateRemoved,
      })
    } else if (isEditingIndicator && selectedIndicator) {
      updateIndicator(selectedIndicator.id, {
        name: indicatorName,
        dateAdded: indicatorDateAdded,
        dateRemoved: indicatorDateRemoved,
      })
    }

    refreshIndicators()
    setIsAddingIndicator(false)
    setIsEditingIndicator(false)
  }

  const handleDeleteIndicator = (indicator: Indicator) => {
    if (confirm(`Are you sure you want to delete indicator "${indicator.name}"?`)) {
      deleteIndicator(indicator.id)
      refreshIndicators()
    }
  }

  // Priority handlers
  const handleSetPriority = (indicator: Indicator) => {
    setSelectedIndicator(indicator)
    setIsSettingPriority(true)
    setPriorityValue(indicator.priority ? indicator.priority.priority.toString() : "1")
    setPriorityDateStart(new Date())
    setPriorityDateEnd(null)
  }

  const handleSavePriority = () => {
    if (selectedIndicator) {
      addIndicatorPriority({
        indicatorId: selectedIndicator.id,
        priority: Number.parseInt(priorityValue),
        dateStart: priorityDateStart || new Date(),
        dateEnd: priorityDateEnd,
      })

      refreshIndicators()
      setIsSettingPriority(false)
    }
  }

  // Target handlers
  const handleSetTarget = (indicator: Indicator) => {
    setSelectedIndicator(indicator)
    setIsSettingTarget(true)

    const currentTarget =
      indicator.targetValues && indicator.targetValues.length > 0
        ? indicator.targetValues.find((t) => t.dateEnd === null)
        : null

    setTargetValue(currentTarget ? currentTarget.targetValue : "")
    setThresholdValue(currentTarget ? currentTarget.thresholdValue : "")
    setTargetDateStart(new Date())
    setTargetDateEnd(null)
  }

  const handleSaveTarget = () => {
    if (selectedIndicator) {
      addIndicatorTargetValue({
        indicatorId: selectedIndicator.id,
        targetValue: targetValue,
        thresholdValue: thresholdValue,
        dateStart: targetDateStart || new Date(),
        dateEnd: targetDateEnd,
      })

      refreshIndicators()
      setIsSettingTarget(false)
    }
  }

  // Relationship handlers
  const handleManageRelationships = (indicator: Indicator) => {
    setSelectedIndicator(indicator)
    setIsManagingRelationships(true)
    setRelationshipTab("lead")
    setSelectedLeadIndicator("")
    setSelectedLagIndicator("")
  }

  const handleAddLeadIndicator = () => {
    if (selectedIndicator && selectedLeadIndicator) {
      addIndicatorLead({
        indicatorId: Number.parseInt(selectedLeadIndicator),
        leadForIndicatorId: selectedIndicator.id,
        dateAdded: new Date(),
        dateRemoved: null,
      })

      refreshIndicators()
      setSelectedLeadIndicator("")
    }
  }

  const handleRemoveLeadIndicator = (leadIndicatorId: number) => {
    if (selectedIndicator) {
      removeIndicatorLead(leadIndicatorId, selectedIndicator.id)
      refreshIndicators()
    }
  }

  const handleAddLagIndicator = () => {
    if (selectedIndicator && selectedLagIndicator) {
      addIndicatorLag({
        indicatorId: Number.parseInt(selectedLagIndicator),
        lagForIndicatorId: selectedIndicator.id,
        dateAdded: new Date(),
        dateRemoved: null,
      })

      refreshIndicators()
      setSelectedLagIndicator("")
    }
  }

  const handleRemoveLagIndicator = (lagIndicatorId: number) => {
    if (selectedIndicator) {
      removeIndicatorLag(lagIndicatorId, selectedIndicator.id)
      refreshIndicators()
    }
  }

  // Helper function to get current priority
  const getCurrentPriority = (indicator: Indicator) => {
    return indicator.priority ? indicator.priority.priority : "-"
  }

  // Helper function to get current target
  const getCurrentTarget = (indicator: Indicator) => {
    const currentTarget =
      indicator.targetValues && indicator.targetValues.length > 0
        ? indicator.targetValues.find((t) => t.dateEnd === null)
        : null

    return currentTarget ? currentTarget.targetValue : "-"
  }

  // Helper function to get current threshold
  const getCurrentThreshold = (indicator: Indicator) => {
    const currentTarget =
      indicator.targetValues && indicator.targetValues.length > 0
        ? indicator.targetValues.find((t) => t.dateEnd === null)
        : null

    return currentTarget ? currentTarget.thresholdValue : "-"
  }

  // Helper function to get lead indicators
  const getLeadIndicators = (indicator: Indicator) => {
    if (!indicator.leadFor || indicator.leadFor.length === 0) {
      return []
    }

    return indicators.filter((i) => indicator.leadFor?.includes(i.id))
  }

  // Helper function to get lag indicators
  const getLagIndicators = (indicator: Indicator) => {
    if (!indicator.lagFor || indicator.lagFor.length === 0) {
      return []
    }

    return indicators.filter((i) => indicator.lagFor?.includes(i.id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#510D77]">Indicators & Priorities</h2>
        <Button onClick={handleAddIndicator} className="bg-[#510D77] hover:bg-[#907797]">
          <Plus className="mr-2 h-4 w-4" /> Add Indicator
        </Button>
      </div>

      {indicators.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No indicators found. Add an indicator to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Threshold</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead>Date Removed</TableHead>
              <TableHead>Lead/Lag</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody  className="text-[#510D77]">
            {indicators.map((indicator) => (
              <TableRow key={indicator.id}>
                <TableCell>{indicator.name}</TableCell>
                <TableCell>{getCurrentPriority(indicator)}</TableCell>
                <TableCell>{getCurrentTarget(indicator)}</TableCell>
                <TableCell>{getCurrentThreshold(indicator)}</TableCell>
                <TableCell>{indicator.dateAdded ? format(indicator.dateAdded, "PP") : "-"}</TableCell>
                <TableCell>{indicator.dateRemoved ? format(indicator.dateRemoved, "PP") : "-"}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {indicator.leadFor && indicator.leadFor.length > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        <ArrowUp className="h-3 w-3 mr-1" /> {indicator.leadFor.length}
                      </span>
                    )}
                    {indicator.lagFor && indicator.lagFor.length > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                        <ArrowDown className="h-3 w-3 mr-1" /> {indicator.lagFor.length}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSetPriority(indicator)} title="Set Priority">
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleSetTarget(indicator)} title="Set Target">
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleManageRelationships(indicator)}
                    title="Manage Relationships"
                  >
                    <Link className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEditIndicator(indicator)} title="Edit">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteIndicator(indicator)} title="Delete">
                    <Trash2 className="h-4 w-4 text-[#C40D3C]" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Indicator Dialog */}
      <Dialog
        open={isAddingIndicator || isEditingIndicator}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddingIndicator(false)
            setIsEditingIndicator(false)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isAddingIndicator ? "Add Indicator" : "Edit Indicator"}</DialogTitle>
            <DialogDescription>
              {isAddingIndicator ? "Add a new key value indicator." : "Edit the details of the selected indicator."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="indicator-name">Indicator Name</Label>
              <Input
                id="indicator-name"
                value={indicatorName}
                onChange={(e) => setIndicatorName(e.target.value)}
                placeholder="Enter indicator name"
              />
            </div>

            <div className="grid gap-2">
              <Label>Date Added</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {indicatorDateAdded ? format(indicatorDateAdded, "PP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={indicatorDateAdded || undefined}
                    onSelect={setIndicatorDateAdded}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label>Date Removed</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {indicatorDateRemoved ? format(indicatorDateRemoved, "PP") : "Select date (optional)"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={indicatorDateRemoved || undefined}
                    onSelect={setIndicatorDateRemoved}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingIndicator(false)
                setIsEditingIndicator(false)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveIndicator} className="bg-[#510D77] hover:bg-[#907797]">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Priority Dialog */}
      <Dialog
        open={isSettingPriority}
        onOpenChange={(open) => {
          if (!open) {
            setIsSettingPriority(false)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Indicator Priority</DialogTitle>
            <DialogDescription>Set the priority level for {selectedIndicator?.name}.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="priority-value">Priority Level</Label>
              <Select value={priorityValue} onValueChange={setPriorityValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Highest</SelectItem>
                  <SelectItem value="2">2 - High</SelectItem>
                  <SelectItem value="3">3 - Medium</SelectItem>
                  <SelectItem value="4">4 - Low</SelectItem>
                  <SelectItem value="5">5 - Lowest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {priorityDateStart ? format(priorityDateStart, "PP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={priorityDateStart || undefined}
                    onSelect={setPriorityDateStart}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {priorityDateEnd ? format(priorityDateEnd, "PP") : "Select date (optional)"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={priorityDateEnd || undefined}
                    onSelect={setPriorityDateEnd}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingPriority(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePriority} className="bg-[#510D77] hover:bg-[#907797]">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Target Dialog */}
      <Dialog
        open={isSettingTarget}
        onOpenChange={(open) => {
          if (!open) {
            setIsSettingTarget(false)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Target Value</DialogTitle>
            <DialogDescription>Set the target and threshold values for {selectedIndicator?.name}.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="target-value">Target Value</Label>
              <Input
                id="target-value"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder="Enter target value"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="threshold-value">Threshold Value for RAG</Label>
              <Input
                id="threshold-value"
                value={thresholdValue}
                onChange={(e) => setThresholdValue(e.target.value)}
                placeholder="Enter threshold value"
              />
            </div>

            <div className="grid gap-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {targetDateStart ? format(targetDateStart, "PP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={targetDateStart || undefined}
                    onSelect={setTargetDateStart}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {targetDateEnd ? format(targetDateEnd, "PP") : "Select date (optional)"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={targetDateEnd || undefined}
                    onSelect={setTargetDateEnd}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingTarget(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTarget} className="bg-[#510D77] hover:bg-[#907797]">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Relationships Dialog */}
      <Dialog
        open={isManagingRelationships}
        onOpenChange={(open) => {
          if (!open) {
            setIsManagingRelationships(false)
          }
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Manage Indicator Relationships</DialogTitle>
            <DialogDescription>Manage lead and lag relationships for {selectedIndicator?.name}.</DialogDescription>
          </DialogHeader>

          <Tabs value={relationshipTab} onValueChange={setRelationshipTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="lead"
                className="text-[#510D77] data-[state=active]:bg-[#510D77] data-[state=active]:text-white"
              >
                Lead Indicators
              </TabsTrigger>
              <TabsTrigger
                value="lag"
                className="text-[#510D77] data-[state=active]:bg-[#510D77] data-[state=active]:text-white"
              >
                Lag Indicators
              </TabsTrigger>
            </TabsList>

            <TabsContent value="lead" className="space-y-4 mt-4">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <Label htmlFor="lead-indicator">Add Lead Indicator</Label>
                  <Select value={selectedLeadIndicator} onValueChange={setSelectedLeadIndicator}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select indicator" />
                    </SelectTrigger>
                    <SelectContent>
                      {indicators
                        .filter(
                          (i) =>
                            i.id !== selectedIndicator?.id &&
                            (!selectedIndicator?.leadFor || !selectedIndicator.leadFor.includes(i.id)),
                        )
                        .map((i) => (
                          <SelectItem key={i.id} value={i.id.toString()}>
                            {i.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleAddLeadIndicator}
                  disabled={!selectedLeadIndicator}
                  className="bg-[#510D77] hover:bg-[#907797]"
                >
                  Add
                </Button>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Indicator Name</TableHead>
                      <TableHead>Date Added</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedIndicator && getLeadIndicators(selectedIndicator).length > 0 ? (
                      getLeadIndicators(selectedIndicator).map((indicator) => (
                        <TableRow key={indicator.id}>
                          <TableCell>{indicator.name}</TableCell>
                          <TableCell>{indicator.dateAdded ? format(indicator.dateAdded, "PP") : "-"}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveLeadIndicator(indicator.id)}>
                              <LinkOff className="h-4 w-4 text-[#C40D3C]" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          No lead indicators found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="lag" className="space-y-4 mt-4">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <Label htmlFor="lag-indicator">Add Lag Indicator</Label>
                  <Select value={selectedLagIndicator} onValueChange={setSelectedLagIndicator}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select indicator" />
                    </SelectTrigger>
                    <SelectContent>
                      {indicators
                        .filter(
                          (i) =>
                            i.id !== selectedIndicator?.id &&
                            (!selectedIndicator?.lagFor || !selectedIndicator.lagFor.includes(i.id)),
                        )
                        .map((i) => (
                          <SelectItem key={i.id} value={i.id.toString()}>
                            {i.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleAddLagIndicator}
                  disabled={!selectedLagIndicator}
                  className="bg-[#510D77] hover:bg-[#907797]"
                >
                  Add
                </Button>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Indicator Name</TableHead>
                      <TableHead>Date Added</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedIndicator && getLagIndicators(selectedIndicator).length > 0 ? (
                      getLagIndicators(selectedIndicator).map((indicator) => (
                        <TableRow key={indicator.id}>
                          <TableCell>{indicator.name}</TableCell>
                          <TableCell>{indicator.dateAdded ? format(indicator.dateAdded, "PP") : "-"}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveLagIndicator(indicator.id)}>
                              <LinkOff className="h-4 w-4 text-[#C40D3C]" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          No lag indicators found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManagingRelationships(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

