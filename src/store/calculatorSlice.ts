import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CalculatorState {
  // User Input
  activeCasesPerYear: number;
  numberOfUsers: number;

  // Case Composition
  bindersPerCase: number;
  pagesPerBinder: number;
  revisionsPerBinder: number;
  copiesPerBinder: number;

  // Production Costs
  printCostPerPage: number;
  binderMaterials: number;

  // Labor Rates
  paralegalRate: number;
  attorneyRate: number;

  // Labor Effort
  paralegalBuildHours: number;
  paralegalRevisionHours: number;

  // Logistics & Storage
  shipmentsPerBinder: number;
  shippingCostPerShipment: number;
  storageCost: number;

  // Align Efficiency
  paralegalBuildReduction: number;
  paralegalRevisionReduction: number;
  attorneyTimeSaved: number;
  courierReduction: number;

  // Adoption & Cost
  adoptionRate: number;
  alignCostPerUser: number;

  // UI State
  showAssumptions: boolean;
}

const initialState: CalculatorState = {
  // User Input
  activeCasesPerYear: 0,
  numberOfUsers: 0,

  // Case Composition (annual rates)
  bindersPerCase: 12, // Binders created per case per year
  pagesPerBinder: 450,
  revisionsPerBinder: 3,
  copiesPerBinder: 3, // Number of copies made of each binder

  // Production Costs
  printCostPerPage: 0.10,
  binderMaterials: 14, // Tabs, dividers, and binder hardware

  // Labor Rates
  paralegalRate: 65,
  attorneyRate: 450,

  // Labor Effort
  paralegalBuildHours: 3.0,
  paralegalRevisionHours: 1.0,

  // Logistics & Storage
  shipmentsPerBinder: 2,
  shippingCostPerShipment: 35,
  storageCost: 2.5, // Blended average: 50% stored @ $3/yr, 50% destroyed @ $2

  // Align Efficiency (as decimal percentages)
  paralegalBuildReduction: 0.70,
  paralegalRevisionReduction: 0.90,
  attorneyTimeSaved: 1.0,
  courierReduction: 0.90,

  // Adoption & Cost
  adoptionRate: 0.70,
  alignCostPerUser: 1500,

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
    setNumberOfUsers: (state, action: PayloadAction<number>) => {
      state.numberOfUsers = action.payload;
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
  setNumberOfUsers,
  updateAssumption,
  toggleAssumptions,
  resetToDefaults,
} = calculatorSlice.actions;

export default calculatorSlice.reducer;
