import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CalculatorState {
  // User Input
  activeCasesPerYear: number;

  // Case Composition
  bindersPerCase: number;
  pagesPerBinder: number;
  revisionsPerBinder: number;
  copiesPerBinder: number;

  // Production Costs
  printCostPerPage: number;
  binderMaterials: number;

  // Labor Rates
  administrativeRate: number;
  attorneyRate: number;

  // Labor Effort
  administrativeBuildHours: number;
  administrativeRevisionHours: number;

  // Logistics & Storage
  shipmentsPerBinder: number;
  shippingCostPerShipment: number;
  storageCost: number;

  // Align Efficiency
  administrativeTimeReduction: number;
  attorneyTimeSaved: number;
  physicalBindersReduction: number;

  // Adoption
  adoptionRate: number;

  // UI State
  showAssumptions: boolean;
}

const initialState: CalculatorState = {
  // User Input
  activeCasesPerYear: 1,

  // Case Composition (annual rates)
  bindersPerCase: 12, // Binders created per case per year
  pagesPerBinder: 450,
  revisionsPerBinder: 1,
  copiesPerBinder: 3, // Number of copies made of each binder

  // Production Costs
  printCostPerPage: 0.06,
  binderMaterials: 14.00, // Tabs, dividers, and binder hardware

  // Labor Rates
  administrativeRate: 40,
  attorneyRate: 400,

  // Labor Effort
  administrativeBuildHours: 2.0,
  administrativeRevisionHours: 1.0,

  // Logistics & Storage
  shipmentsPerBinder: 1,
  shippingCostPerShipment: 20.00,
  storageCost: 2.00, // Blended average: 50% stored @ $3/yr, 50% destroyed @ $2

  // Align Efficiency (as decimal percentages)
  administrativeTimeReduction: 0.7,
  attorneyTimeSaved: 1.5,
  physicalBindersReduction: 0.8,

  // Adoption
  adoptionRate: 0.7,

  // UI State
  showAssumptions: false,
};

const calculatorSlice = createSlice({
  name: "calculator",
  initialState,
  reducers: {
    setActiveCases: (state, action: PayloadAction<number>) => {
      state.activeCasesPerYear = action.payload;
    },
    updateAssumption: (
      state,
      action: PayloadAction<{
        key: keyof CalculatorState;
        value: number | boolean;
      }>,
    ) => {
      const { key, value } = action.payload;
      (state[key] as number | boolean) = value;
    },
    toggleAssumptions: (state) => {
      state.showAssumptions = !state.showAssumptions;
    },
    resetToDefaults: () => initialState,
  },
});

export const {
  setActiveCases,
  updateAssumption,
  toggleAssumptions,
  resetToDefaults,
} = calculatorSlice.actions;

export default calculatorSlice.reducer;
