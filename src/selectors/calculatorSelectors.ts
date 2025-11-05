import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store/store';

// Base selector
const selectCalculator = (state: RootState) => state.calculator;

/**
 * Savings from Align per binder
 * Includes: paralegal time saved, attorney time saved, shipping avoided, print costs avoided
 * Note: Physical costs (shipping, print) are multiplied by copiesPerBinder
 */
export const selectSavingsPerBinder = createSelector(
  [selectCalculator],
  (calc) => {
    // Paralegal time savings (labor is per binder regardless of copies - all copies created together)
    const paralegalBuildSavings = calc.paralegalRate * calc.paralegalBuildHours * calc.paralegalBuildReduction;
    const paralegalRevisionSavings = calc.paralegalRate * calc.paralegalRevisionHours * calc.revisionsPerBinder * calc.paralegalRevisionReduction;

    // Attorney time savings (per binder allocation from per-case savings)
    const attorneySavings = (calc.attorneyRate * calc.attorneyTimeSaved) / calc.bindersPerCase;

    // Shipping cost savings (per copy - each copy gets shipped)
    const shippingSavings = calc.shipmentsPerBinder * calc.shippingCostPerShipment * calc.courierReduction * calc.copiesPerBinder;

    // Print cost savings from reduced revisions (per copy - each copy needs pages)
    const printSavings = calc.pagesPerBinder * calc.printCostPerPage * calc.revisionsPerBinder * calc.paralegalRevisionReduction * calc.copiesPerBinder;

    // Materials savings (per copy - each copy needs tabs/dividers/hardware)
    const materialsSavings = calc.binderMaterials * calc.copiesPerBinder * 0; // Currently no reduction assumed for materials

    // Storage savings (per copy - each copy gets stored)
    const storageSavings = calc.storageCost * calc.copiesPerBinder * 0; // Currently no reduction assumed for storage

    return paralegalBuildSavings + paralegalRevisionSavings + attorneySavings + shippingSavings + printSavings + materialsSavings + storageSavings;
  }
);

/**
 * Annual hard cost savings (physical costs only)
 * Note: bindersPerCase represents the annual rate (binders created per case per year)
 * Note: Physical costs are multiplied by copiesPerBinder
 */
export const selectAnnualHardCostSavings = createSelector(
  [selectCalculator],
  (calc) => {
    // Shipping and print costs are hard costs (per copy)
    const shippingSavingsPerBinder = calc.shipmentsPerBinder * calc.shippingCostPerShipment * calc.courierReduction * calc.copiesPerBinder;
    const printSavingsPerBinder = calc.pagesPerBinder * calc.printCostPerPage * calc.revisionsPerBinder * calc.paralegalRevisionReduction * calc.copiesPerBinder;

    const hardCostSavingsPerBinder = shippingSavingsPerBinder + printSavingsPerBinder;

    return hardCostSavingsPerBinder * calc.bindersPerCase * calc.activeCasesPerYear * calc.adoptionRate;
  }
);

/**
 * Annual nonbillable paralegal hours saved
 * These are cost savings since paralegal time cannot be billed to clients
 * Note: bindersPerCase represents the annual rate (binders created per case per year)
 */
export const selectAnnualParalegalHoursSaved = createSelector(
  [selectCalculator],
  (calc) => {
    const paralegalHoursPerBinder =
      calc.paralegalBuildHours * calc.paralegalBuildReduction +
      calc.paralegalRevisionHours * calc.revisionsPerBinder * calc.paralegalRevisionReduction;

    return paralegalHoursPerBinder * calc.bindersPerCase * calc.activeCasesPerYear * calc.adoptionRate;
  }
);

/**
 * Annual attorney billable hours recovered
 * These hours can be redirected to billable work instead of administrative tasks
 * Note: attorneyTimeSaved is per case per year, allocated across bindersPerCase (annual rate)
 */
export const selectAnnualAttorneyBillableHoursRecovered = createSelector(
  [selectCalculator],
  (calc) => {
    const attorneyHoursPerCase = calc.attorneyTimeSaved;
    const attorneyHoursPerBinder = attorneyHoursPerCase / calc.bindersPerCase;

    return attorneyHoursPerBinder * calc.bindersPerCase * calc.activeCasesPerYear * calc.adoptionRate;
  }
);

/**
 * Dollar value of paralegal hours saved
 */
export const selectParalegalHoursValue = createSelector(
  [selectAnnualParalegalHoursSaved, selectCalculator],
  (paralegalHours, calc) => {
    return paralegalHours * calc.paralegalRate;
  }
);

/**
 * Dollar value of attorney hours recovered
 */
export const selectAttorneyHoursValue = createSelector(
  [selectAnnualAttorneyBillableHoursRecovered, selectCalculator],
  (attorneyHours, calc) => {
    return attorneyHours * calc.attorneyRate;
  }
);

/**
 * Annual total savings (hard costs + monetized labor)
 * Note: bindersPerCase represents the annual rate (binders created per case per year)
 */
export const selectAnnualTotalSavings = createSelector(
  [selectSavingsPerBinder, selectCalculator],
  (savingsPerBinder, calc) => {
    return savingsPerBinder * calc.bindersPerCase * calc.activeCasesPerYear * calc.adoptionRate;
  }
);

/**
 * Total annual benefit
 * = Annual savings from all sources (hard costs + monetized labor)
 */
export const selectTotalAnnualBenefit = createSelector(
  [selectAnnualTotalSavings],
  (annualSavings) => {
    return annualSavings;
  }
);

/**
 * Combined results selector for easy access to all key metrics
 */
export const selectResults = createSelector(
  [
    selectAnnualHardCostSavings,
    selectAnnualParalegalHoursSaved,
    selectParalegalHoursValue,
    selectAnnualAttorneyBillableHoursRecovered,
    selectAttorneyHoursValue,
    selectAnnualTotalSavings,
    selectTotalAnnualBenefit,
  ],
  (hardCostSavings, paralegalHours, paralegalValue, attorneyHours, attorneyValue, totalSavings, totalBenefit) => ({
    hardCostSavings,
    paralegalHours,
    paralegalValue,
    attorneyHours,
    attorneyValue,
    totalSavings,
    totalBenefit,
  })
);
