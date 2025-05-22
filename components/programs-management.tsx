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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2, Plus, Calendar } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import {
  getPrograms,
  addProgram,
  updateProgram,
  deleteProgram,
  addInitiative,
  updateInitiative,
  deleteInitiative,
  type Program,
  type Initiative,
} from "@/lib/data"

export default function ProgramsManagement() {
  const [programs, setPrograms] = useState(getPrograms())
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null)
  const [isAddingProgram, setIsAddingProgram] = useState(false)
  const [isEditingProgram, setIsEditingProgram] = useState(false)
  const [isAddingInitiative, setIsAddingInitiative] = useState(false)
  const [isEditingInitiative, setIsEditingInitiative] = useState(false)

  // Form states
  const [programName, setProgramName] = useState("")
  const [programOwner, setProgramOwner] = useState("")
  const [programDateAdded, setProgramDateAdded] = useState<Date | null>(null)
  const [programDateRemoved, setProgramDateRemoved] = useState<Date | null>(null)

  const [initiativeName, setInitiativeName] = useState("")
  const [initiativeOwner, setInitiativeOwner] = useState("")
  const [initiativeDateAdded, setInitiativeDateAdded] = useState<Date | null>(null)
  const [initiativeDateRemoved, setInitiativeDateRemoved] = useState<Date | null>(null)

  // Refresh programs
  const refreshPrograms = () => {
    setPrograms(getPrograms())
  }

  // Program handlers
  const handleAddProgram = () => {
    setIsAddingProgram(true)
    setProgramName("")
    setProgramOwner("")
    setProgramDateAdded(new Date())
    setProgramDateRemoved(null)
  }

  const handleEditProgram = (program: Program) => {
    setSelectedProgram(program)
    setIsEditingProgram(true)
    setProgramName(program.name)
    setProgramOwner(program.owner)
    setProgramDateAdded(program.dateAdded)
    setProgramDateRemoved(program.dateRemoved)
  }

  const handleSaveProgram = () => {
    if (isAddingProgram) {
      addProgram({
        name: programName,
        owner: programOwner,
        dateAdded: programDateAdded,
        dateRemoved: programDateRemoved,
      })
    } else if (isEditingProgram && selectedProgram) {
      updateProgram(selectedProgram.id, {
        name: programName,
        owner: programOwner,
        dateAdded: programDateAdded,
        dateRemoved: programDateRemoved,
      })
    }

    refreshPrograms()
    setIsAddingProgram(false)
    setIsEditingProgram(false)
  }

  const handleDeleteProgram = (program: Program) => {
    if (confirm(`Are you sure you want to delete program "${program.name}"?`)) {
      deleteProgram(program.id)
      refreshPrograms()
    }
  }

  // Initiative handlers
  const handleAddInitiative = (program: Program) => {
    setSelectedProgram(program)
    setIsAddingInitiative(true)
    setInitiativeName("")
    setInitiativeOwner("")
    setInitiativeDateAdded(new Date())
    setInitiativeDateRemoved(null)
  }

  const handleEditInitiative = (initiative: Initiative) => {
    setSelectedInitiative(initiative)
    setIsEditingInitiative(true)
    setInitiativeName(initiative.name)
    setInitiativeOwner(initiative.owner)
    setInitiativeDateAdded(initiative.dateAdded)
    setInitiativeDateRemoved(initiative.dateRemoved)
  }

  const handleSaveInitiative = () => {
    if (isAddingInitiative && selectedProgram) {
      addInitiative({
        name: initiativeName,
        owner: initiativeOwner,
        dateAdded: initiativeDateAdded,
        dateRemoved: initiativeDateRemoved,
        programId: selectedProgram.id,
      })
    } else if (isEditingInitiative && selectedInitiative) {
      updateInitiative(selectedInitiative.id, {
        name: initiativeName,
        owner: initiativeOwner,
        dateAdded: initiativeDateAdded,
        dateRemoved: initiativeDateRemoved,
      })
    }

    refreshPrograms()
    setIsAddingInitiative(false)
    setIsEditingInitiative(false)
  }

  const handleDeleteInitiative = (initiative: Initiative) => {
    if (confirm(`Are you sure you want to delete initiative "${initiative.name}"?`)) {
      deleteInitiative(initiative.id)
      refreshPrograms()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#510D77]">Programs & Initiatives</h2>
        <Button onClick={handleAddProgram} className="bg-[#510D77] hover:bg-[#907797]">
          <Plus className="mr-2 h-4 w-4" /> Add Program
        </Button>
      </div>

      {programs.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No programs found. Add a program to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="single" collapsible className="space-y-4">
          {programs.map((program) => (
            <AccordionItem key={program.id} value={`program-${program.id}`} className="border rounded-lg">
              <AccordionTrigger className="px-4 py-2 hover:bg-gray-50">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <span className="font-medium">{program.name}</span>
                    <span className="ml-4 text-sm text-muted-foreground">Owner: {program.owner}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditProgram(program)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteProgram(program)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-[#C40D3C]" />
                    </Button>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-2">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Initiatives</h3>
                    <Button
                      onClick={() => handleAddInitiative(program)}
                      size="sm"
                      className="bg-[#510D77] hover:bg-[#907797]"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Initiative
                    </Button>
                  </div>

                  {program.initiatives.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No initiatives found for this program.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Owner</TableHead>
                          <TableHead>Date Added</TableHead>
                          <TableHead>Date Removed</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {program.initiatives.map((initiative) => (
                          <TableRow key={initiative.id}>
                            <TableCell>{initiative.name}</TableCell>
                            <TableCell>{initiative.owner}</TableCell>
                            <TableCell>{initiative.dateAdded ? format(initiative.dateAdded, "PP") : "-"}</TableCell>
                            <TableCell>{initiative.dateRemoved ? format(initiative.dateRemoved, "PP") : "-"}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleEditInitiative(initiative)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteInitiative(initiative)}>
                                <Trash2 className="h-4 w-4 text-[#C40D3C]" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {/* Program Dialog */}
      <Dialog
        open={isAddingProgram || isEditingProgram}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddingProgram(false)
            setIsEditingProgram(false)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isAddingProgram ? "Add Program" : "Edit Program"}</DialogTitle>
            <DialogDescription>
              {isAddingProgram
                ? "Add a new program to track value-generating initiatives."
                : "Edit the details of the selected program."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="program-name">Program Name</Label>
              <Input
                id="program-name"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
                placeholder="Enter program name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="program-owner">Program Owner</Label>
              <Input
                id="program-owner"
                value={programOwner}
                onChange={(e) => setProgramOwner(e.target.value)}
                placeholder="Enter program owner"
              />
            </div>

            <div className="grid gap-2">
              <Label>Date Added</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {programDateAdded ? format(programDateAdded, "PP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={programDateAdded || undefined}
                    onSelect={setProgramDateAdded}
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
                    {programDateRemoved ? format(programDateRemoved, "PP") : "Select date (optional)"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={programDateRemoved || undefined}
                    onSelect={setProgramDateRemoved}
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
                setIsAddingProgram(false)
                setIsEditingProgram(false)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveProgram} className="bg-[#510D77] hover:bg-[#907797]">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Initiative Dialog */}
      <Dialog
        open={isAddingInitiative || isEditingInitiative}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddingInitiative(false)
            setIsEditingInitiative(false)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isAddingInitiative ? "Add Initiative" : "Edit Initiative"}</DialogTitle>
            <DialogDescription>
              {isAddingInitiative
                ? "Add a new initiative to the selected program."
                : "Edit the details of the selected initiative."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="initiative-name">Initiative Name</Label>
              <Input
                id="initiative-name"
                value={initiativeName}
                onChange={(e) => setInitiativeName(e.target.value)}
                placeholder="Enter initiative name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="initiative-owner">Initiative Owner</Label>
              <Input
                id="initiative-owner"
                value={initiativeOwner}
                onChange={(e) => setInitiativeOwner(e.target.value)}
                placeholder="Enter initiative owner"
              />
            </div>

            <div className="grid gap-2">
              <Label>Date Added</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {initiativeDateAdded ? format(initiativeDateAdded, "PP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={initiativeDateAdded || undefined}
                    onSelect={setInitiativeDateAdded}
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
                    {initiativeDateRemoved ? format(initiativeDateRemoved, "PP") : "Select date (optional)"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={initiativeDateRemoved || undefined}
                    onSelect={setInitiativeDateRemoved}
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
                setIsAddingInitiative(false)
                setIsEditingInitiative(false)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveInitiative} className="bg-[#510D77] hover:bg-[#907797]">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

