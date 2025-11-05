import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  printCostPerPage: 0.10,
  binderMaterials: 10, // Tabs, dividers, and binder hardware

  // Labor Rates
  administrativeRate: 65,
  attorneyRate: 450,

  // Labor Effort
  administrativeBuildHours: 2.0,
  administrativeRevisionHours: 1.0,

  // Logistics & Storage
  shipmentsPerBinder: 1,
  shippingCostPerShipment: 35,
  storageCost: 2.5, // Blended average: 50% stored @ $3/yr, 50% destroyed @ $2

  // Align Efficiency (as decimal percentages)
  administrativeTimeReduction: 0.70,
  attorneyTimeSaved: 1.5,
  physicalBindersReduction: 0.90,

  // Adoption
  adoptionRate: 0.70,

  // UI State
  showAssumptions: false,
};

const calculatorSlice = createSlice({
  name: 'calculator',
  initialState,
  reducers: {
    setActiveCases: (state, action: PayloadAction<number>) => {
      state.activeCasesPerYear = action.payload;
    },
    updateAssumption: (
      state,
      action: PayloadAction<{ key: keyof CalculatorState; value: number | boolean }>
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
