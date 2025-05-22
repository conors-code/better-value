// Types based on SQL schema
export type Program = {
  id: number
  name: string
  owner: string
  dateAdded: Date | null
  dateRemoved: Date | null
  initiatives: Initiative[]
}

export type Initiative = {
  id: number
  name: string
  owner: string
  dateAdded: Date | null
  dateRemoved: Date | null
  programId: number
}

export type Indicator = {
  id: number
  name: string
  dateAdded: Date
  dateRemoved: Date | null
  priority?: IndicatorPriority
  targetValues?: IndicatorTargetValue[]
  leadFor?: number[]
  lagFor?: number[]
  actuals?: IndicatorActual[]
}

export type IndicatorPriority = {
  indicatorId: number
  priority: number
  dateStart: Date
  dateEnd: Date | null
}

export type IndicatorTargetValue = {
  indicatorId: number
  targetValue: string
  dateStart: Date
  dateEnd: Date | null
  thresholdValue: string
}

export type IndicatorLead = {
  indicatorId: number
  leadForIndicatorId: number
  dateAdded: Date
  dateRemoved: Date | null
}

export type IndicatorLag = {
  indicatorId: number
  lagForIndicatorId: number
  dateAdded: Date
  dateRemoved: Date | null
}

export type IndicatorActual = {
  indicatorId: number
  initiativeId: number
  value: string
  isPromised: boolean
  dateEffective: Date
  source: string
}

// Mock data based on SQL examples
export const mockPrograms: Program[] = [
  {
    id: 1,
    name: "Example Program 1",
    owner: "Program Owner 1",
    dateAdded: new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000),
    dateRemoved: null,
    initiatives: [],
  },
  {
    id: 2,
    name: "Example Program 2",
    owner: "Program Owner 2",
    dateAdded: new Date(new Date().getTime() - 180 * 24 * 60 * 60 * 1000),
    dateRemoved: null,
    initiatives: [],
  },
]

export const mockInitiatives: Initiative[] = [
  {
    id: 1,
    name: "Example Initiative 1",
    owner: "Initiative Owner 1",
    dateAdded: new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000),
    dateRemoved: null,
    programId: 1,
  },
  {
    id: 2,
    name: "Example Initiative 2",
    owner: "Initiative Owner 2",
    dateAdded: new Date(new Date().getTime() - 180 * 24 * 60 * 60 * 1000),
    dateRemoved: null,
    programId: 1,
  },
  {
    id: 3,
    name: "Example Initiative 3",
    owner: "Initiative Owner 1",
    dateAdded: new Date(),
    dateRemoved: null,
    programId: 1,
  },
  {
    id: 4,
    name: "Example Initiative 4",
    owner: "Initiative Owner 3",
    dateAdded: new Date(),
    dateRemoved: null,
    programId: 2,
  },
]

export const mockIndicators: Indicator[] = [
  {
    id: 1,
    name: "Example Indicator 1",
    dateAdded: new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000),
    dateRemoved: null,
  },
  {
    id: 2,
    name: "Example Indicator 2 (Lead)",
    dateAdded: new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000),
    dateRemoved: null,
  },
  {
    id: 3,
    name: "Example Indicator 3 (Lead)",
    dateAdded: new Date(),
    dateRemoved: null,
  },
  {
    id: 4,
    name: "Example Indicator 4 (Lag)",
    dateAdded: new Date(new Date().getTime() - 180 * 24 * 60 * 60 * 1000),
    dateRemoved: new Date(),
  },
]

export const mockIndicatorPriorities: IndicatorPriority[] = [
  {
    indicatorId: 1,
    priority: 1,
    dateStart: new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000),
    dateEnd: null,
  },
  {
    indicatorId: 2,
    priority: 2,
    dateStart: new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000),
    dateEnd: null,
  },
  {
    indicatorId: 3,
    priority: 2,
    dateStart: new Date(),
    dateEnd: null,
  },
  {
    indicatorId: 4,
    priority: 2,
    dateStart: new Date(new Date().getTime() - 180 * 24 * 60 * 60 * 1000),
    dateEnd: new Date(),
  },
]

export const mockIndicatorTargetValues: IndicatorTargetValue[] = [
  {
    indicatorId: 1,
    targetValue: "100",
    dateStart: new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000),
    dateEnd: null,
    thresholdValue: "90",
  },
  {
    indicatorId: 2,
    targetValue: "200",
    dateStart: new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000),
    dateEnd: null,
    thresholdValue: "190",
  },
  {
    indicatorId: 3,
    targetValue: "150",
    dateStart: new Date(),
    dateEnd: null,
    thresholdValue: "200",
  },
  {
    indicatorId: 4,
    targetValue: "50",
    dateStart: new Date(new Date().getTime() - 180 * 24 * 60 * 60 * 1000),
    dateEnd: new Date(),
    thresholdValue: "40",
  },
]

export const mockIndicatorLeads: IndicatorLead[] = [
  {
    indicatorId: 2,
    leadForIndicatorId: 1,
    dateAdded: new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000),
    dateRemoved: null,
  },
  {
    indicatorId: 3,
    leadForIndicatorId: 1,
    dateAdded: new Date(),
    dateRemoved: null,
  },
]

export const mockIndicatorLags: IndicatorLag[] = [
  {
    indicatorId: 4,
    lagForIndicatorId: 1,
    dateAdded: new Date(new Date().getTime() - 180 * 24 * 60 * 60 * 1000),
    dateRemoved: new Date(),
  },
]

export const mockIndicatorActuals: IndicatorActual[] = [
  {
    indicatorId: 1,
    initiativeId: 1,
    value: "120",
    isPromised: false,
    dateEffective: new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000),
    source: "promised",
  },
  {
    indicatorId: 1,
    initiativeId: 1,
    value: "100",
    isPromised: false,
    dateEffective: new Date(new Date().getTime() - 180 * 24 * 60 * 60 * 1000),
    source: "Source System 1",
  },
  {
    indicatorId: 1,
    initiativeId: 1,
    value: "110",
    isPromised: false,
    dateEffective: new Date(),
    source: "Source System 1",
  },
  {
    indicatorId: 2,
    initiativeId: 1,
    value: "250",
    isPromised: false,
    dateEffective: new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000),
    source: "promised",
  },
  {
    indicatorId: 2,
    initiativeId: 1,
    value: "140",
    isPromised: false,
    dateEffective: new Date(new Date().getTime() - 180 * 24 * 60 * 60 * 1000),
    source: "Source System 2",
  },
  {
    indicatorId: 2,
    initiativeId: 1,
    value: "180",
    isPromised: false,
    dateEffective: new Date(),
    source: "Source System 2",
  },
  {
    indicatorId: 3,
    initiativeId: 1,
    value: "160",
    isPromised: false,
    dateEffective: new Date(),
    source: "promised",
  },
  {
    indicatorId: 4,
    initiativeId: 2,
    value: "60",
    isPromised: false,
    dateEffective: new Date(),
    source: "promised",
  },
]

// Initialize programs with initiatives
mockPrograms.forEach((program) => {
  program.initiatives = mockInitiatives.filter((initiative) => initiative.programId === program.id)
})

// Initialize indicators with priorities, target values, and actuals
mockIndicators.forEach((indicator) => {
  indicator.priority = mockIndicatorPriorities.find((p) => p.indicatorId === indicator.id)
  indicator.targetValues = mockIndicatorTargetValues.filter((t) => t.indicatorId === indicator.id)
  indicator.leadFor = mockIndicatorLeads.filter((l) => l.indicatorId === indicator.id).map((l) => l.leadForIndicatorId)
  indicator.lagFor = mockIndicatorLags.filter((l) => l.indicatorId === indicator.id).map((l) => l.lagForIndicatorId)
  indicator.actuals = mockIndicatorActuals.filter((a) => a.indicatorId === indicator.id)
})

// Store functions
let programs = [...mockPrograms]
let initiatives = [...mockInitiatives]
let indicators = [...mockIndicators]
let indicatorPriorities = [...mockIndicatorPriorities]
let indicatorTargetValues = [...mockIndicatorTargetValues]
let indicatorLeads = [...mockIndicatorLeads]
let indicatorLags = [...mockIndicatorLags]
let indicatorActuals = [...mockIndicatorActuals]

// Program CRUD operations
export const getPrograms = () => programs
export const getProgram = (id: number) => programs.find((p) => p.id === id)
export const addProgram = (program: Omit<Program, "id" | "initiatives">) => {
  const newProgram: Program = {
    ...program,
    id: programs.length > 0 ? Math.max(...programs.map((p) => p.id)) + 1 : 1,
    initiatives: [],
  }
  programs = [...programs, newProgram]
  return newProgram
}
export const updateProgram = (id: number, program: Partial<Omit<Program, "id" | "initiatives">>) => {
  programs = programs.map((p) => (p.id === id ? { ...p, ...program } : p))
  return programs.find((p) => p.id === id)
}
export const deleteProgram = (id: number) => {
  // Delete associated initiatives first
  initiatives = initiatives.filter((i) => i.programId !== id)
  programs = programs.filter((p) => p.id !== id)
}

// Initiative CRUD operations
export const getInitiatives = () => initiatives
export const getInitiativesByProgram = (programId: number) => initiatives.filter((i) => i.programId === programId)
export const getInitiative = (id: number) => initiatives.find((i) => i.id === id)
export const addInitiative = (initiative: Omit<Initiative, "id">) => {
  const newInitiative: Initiative = {
    ...initiative,
    id: initiatives.length > 0 ? Math.max(...initiatives.map((i) => i.id)) + 1 : 1,
  }
  initiatives = [...initiatives, newInitiative]

  // Update program's initiatives
  const program = programs.find((p) => p.id === initiative.programId)
  if (program) {
    program.initiatives = [...program.initiatives, newInitiative]
  }

  return newInitiative
}
export const updateInitiative = (id: number, initiative: Partial<Omit<Initiative, "id">>) => {
  initiatives = initiatives.map((i) => (i.id === id ? { ...i, ...initiative } : i))

  // Update program's initiatives if needed
  if (initiative.programId) {
    programs.forEach((program) => {
      program.initiatives = initiatives.filter((i) => i.programId === program.id)
    })
  }

  return initiatives.find((i) => i.id === id)
}
export const deleteInitiative = (id: number) => {
  const initiative = initiatives.find((i) => i.id === id)
  if (initiative) {
    // Remove from program's initiatives
    const program = programs.find((p) => p.id === initiative.programId)
    if (program) {
      program.initiatives = program.initiatives.filter((i) => i.id !== id)
    }

    // Delete associated actuals
    indicatorActuals = indicatorActuals.filter((a) => a.initiativeId !== id)

    // Delete initiative
    initiatives = initiatives.filter((i) => i.id !== id)
  }
}

// Indicator CRUD operations
export const getIndicators = () => indicators
export const getIndicator = (id: number) => indicators.find((i) => i.id === id)
export const addIndicator = (
  indicator: Omit<Indicator, "id" | "priority" | "targetValues" | "leadFor" | "lagFor" | "actuals">,
) => {
  const newIndicator: Indicator = {
    ...indicator,
    id: indicators.length > 0 ? Math.max(...indicators.map((i) => i.id)) + 1 : 1,
  }
  indicators = [...indicators, newIndicator]
  return newIndicator
}
export const updateIndicator = (
  id: number,
  indicator: Partial<Omit<Indicator, "id" | "priority" | "targetValues" | "leadFor" | "lagFor" | "actuals">>,
) => {
  indicators = indicators.map((i) => (i.id === id ? { ...i, ...indicator } : i))
  return indicators.find((i) => i.id === id)
}
export const deleteIndicator = (id: number) => {
  // Delete associated data first
  indicatorPriorities = indicatorPriorities.filter((p) => p.indicatorId !== id)
  indicatorTargetValues = indicatorTargetValues.filter((t) => t.indicatorId !== id)
  indicatorLeads = indicatorLeads.filter((l) => l.indicatorId !== id || l.leadForIndicatorId !== id)
  indicatorLags = indicatorLags.filter((l) => l.indicatorId !== id || l.lagForIndicatorId !== id)
  indicatorActuals = indicatorActuals.filter((a) => a.indicatorId !== id)

  // Delete indicator
  indicators = indicators.filter((i) => i.id !== id)
}

// Indicator Priority CRUD operations
export const getIndicatorPriorities = () => indicatorPriorities
export const getIndicatorPriority = (indicatorId: number) =>
  indicatorPriorities.find((p) => p.indicatorId === indicatorId)
export const addIndicatorPriority = (priority: IndicatorPriority) => {
  // End any existing priority for this indicator
  indicatorPriorities = indicatorPriorities.map((p) =>
    p.indicatorId === priority.indicatorId && p.dateEnd === null ? { ...p, dateEnd: priority.dateStart } : p,
  )

  // Add new priority
  indicatorPriorities = [...indicatorPriorities, priority]

  // Update indicator
  const indicator = indicators.find((i) => i.id === priority.indicatorId)
  if (indicator) {
    indicator.priority = priority
  }

  return priority
}
export const updateIndicatorPriority = (
  indicatorId: number,
  priority: Partial<Omit<IndicatorPriority, "indicatorId">>,
) => {
  indicatorPriorities = indicatorPriorities.map((p) =>
    p.indicatorId === indicatorId && p.dateEnd === null ? { ...p, ...priority } : p,
  )

  // Update indicator
  const indicator = indicators.find((i) => i.id === indicatorId)
  if (indicator) {
    indicator.priority = indicatorPriorities.find((p) => p.indicatorId === indicatorId && p.dateEnd === null)
  }

  return indicatorPriorities.find((p) => p.indicatorId === indicatorId && p.dateEnd === null)
}

// Indicator Target Value CRUD operations
export const getIndicatorTargetValues = () => indicatorTargetValues
export const getIndicatorTargetValue = (indicatorId: number) =>
  indicatorTargetValues.find((t) => t.indicatorId === indicatorId && t.dateEnd === null)
export const addIndicatorTargetValue = (targetValue: IndicatorTargetValue) => {
  // End any existing target value for this indicator
  indicatorTargetValues = indicatorTargetValues.map((t) =>
    t.indicatorId === targetValue.indicatorId && t.dateEnd === null ? { ...t, dateEnd: targetValue.dateStart } : t,
  )

  // Add new target value
  indicatorTargetValues = [...indicatorTargetValues, targetValue]

  // Update indicator
  const indicator = indicators.find((i) => i.id === targetValue.indicatorId)
  if (indicator) {
    indicator.targetValues = indicatorTargetValues.filter((t) => t.indicatorId === targetValue.indicatorId)
  }

  return targetValue
}
export const updateIndicatorTargetValue = (
  indicatorId: number,
  targetValue: Partial<Omit<IndicatorTargetValue, "indicatorId">>,
) => {
  indicatorTargetValues = indicatorTargetValues.map((t) =>
    t.indicatorId === indicatorId && t.dateEnd === null ? { ...t, ...targetValue } : t,
  )

  // Update indicator
  const indicator = indicators.find((i) => i.id === indicatorId)
  if (indicator) {
    indicator.targetValues = indicatorTargetValues.filter((t) => t.indicatorId === indicatorId)
  }

  return indicatorTargetValues.find((t) => t.indicatorId === indicatorId && t.dateEnd === null)
}

// Indicator Lead/Lag CRUD operations
export const addIndicatorLead = (lead: IndicatorLead) => {
  indicatorLeads = [...indicatorLeads, lead]

  // Update indicators
  const indicator = indicators.find((i) => i.id === lead.indicatorId)
  if (indicator) {
    indicator.leadFor = [...(indicator.leadFor || []), lead.leadForIndicatorId]
  }

  return lead
}
export const removeIndicatorLead = (indicatorId: number, leadForIndicatorId: number) => {
  // Set dateRemoved instead of deleting
  indicatorLeads = indicatorLeads.map((l) =>
    l.indicatorId === indicatorId && l.leadForIndicatorId === leadForIndicatorId && l.dateRemoved === null
      ? { ...l, dateRemoved: new Date() }
      : l,
  )

  // Update indicator
  const indicator = indicators.find((i) => i.id === indicatorId)
  if (indicator && indicator.leadFor) {
    indicator.leadFor = indicator.leadFor.filter((id) => id !== leadForIndicatorId)
  }
}

export const addIndicatorLag = (lag: IndicatorLag) => {
  indicatorLags = [...indicatorLags, lag]

  // Update indicators
  const indicator = indicators.find((i) => i.id === lag.indicatorId)
  if (indicator) {
    indicator.lagFor = [...(indicator.lagFor || []), lag.lagForIndicatorId]
  }

  return lag
}
export const removeIndicatorLag = (indicatorId: number, lagForIndicatorId: number) => {
  // Set dateRemoved instead of deleting
  indicatorLags = indicatorLags.map((l) =>
    l.indicatorId === indicatorId && l.lagForIndicatorId === lagForIndicatorId && l.dateRemoved === null
      ? { ...l, dateRemoved: new Date() }
      : l,
  )

  // Update indicator
  const indicator = indicators.find((i) => i.id === indicatorId)
  if (indicator && indicator.lagFor) {
    indicator.lagFor = indicator.lagFor.filter((id) => id !== lagForIndicatorId)
  }
}

// Indicator Actual CRUD operations
export const getIndicatorActuals = () => indicatorActuals
export const getIndicatorActualsByIndicator = (indicatorId: number) =>
  indicatorActuals.filter((a) => a.indicatorId === indicatorId)
export const getIndicatorActualsByInitiative = (initiativeId: number) =>
  indicatorActuals.filter((a) => a.initiativeId === initiativeId)
export const addIndicatorActual = (actual: IndicatorActual) => {
  indicatorActuals = [...indicatorActuals, actual]

  // Update indicator
  const indicator = indicators.find((i) => i.id === actual.indicatorId)
  if (indicator) {
    indicator.actuals = [...(indicator.actuals || []), actual]
  }

  return actual
}
export const updateIndicatorActual = (
  indicatorId: number,
  initiativeId: number,
  dateEffective: Date,
  actual: Partial<Omit<IndicatorActual, "indicatorId" | "initiativeId" | "dateEffective">>,
) => {
  indicatorActuals = indicatorActuals.map((a) =>
    a.indicatorId === indicatorId &&
    a.initiativeId === initiativeId &&
    a.dateEffective.getTime() === dateEffective.getTime()
      ? { ...a, ...actual }
      : a,
  )

  // Update indicator
  const indicator = indicators.find((i) => i.id === indicatorId)
  if (indicator && indicator.actuals) {
    indicator.actuals = indicatorActuals.filter((a) => a.indicatorId === indicatorId)
  }

  return indicatorActuals.find(
    (a) =>
      a.indicatorId === indicatorId &&
      a.initiativeId === initiativeId &&
      a.dateEffective.getTime() === dateEffective.getTime(),
  )
}
export const deleteIndicatorActual = (indicatorId: number, initiativeId: number, dateEffective: Date) => {
  indicatorActuals = indicatorActuals.filter(
    (a) =>
      !(
        a.indicatorId === indicatorId &&
        a.initiativeId === initiativeId &&
        a.dateEffective.getTime() === dateEffective.getTime()
      ),
  )

  // Update indicator
  const indicator = indicators.find((i) => i.id === indicatorId)
  if (indicator && indicator.actuals) {
    indicator.actuals = indicatorActuals.filter((a) => a.indicatorId === indicatorId)
  }
}

// Helper function to calculate RAG status
export const calculateRAGStatus = (actual: string, target: string, threshold: string) => {
  const actualValue = Number.parseFloat(actual)
  const targetValue = Number.parseFloat(target)
  const thresholdValue = Number.parseFloat(threshold)

  if (actualValue >= thresholdValue) {
    return "green"
  } else if (actualValue >= thresholdValue * 0.9) {
    return "amber"
  } else {
    return "red"
  }
}

