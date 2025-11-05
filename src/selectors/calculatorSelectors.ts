import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store/store';

// Base selector
const selectCalculator = (state: RootState) => state.calculator;

/**
 * Physical cost per binder
 * = (Pages × Print cost × (1 + Revisions)) + Tabs + Binder + (Shipments × ShipCost) + Storage
 */
export const selectPhysicalCostPerBinder = createSelector(
  [selectCalculator],
  (calc) => {
    const printCost = calc.pagesPerBinder * calc.printCostPerPage * (1 + calc.revisionsPerBinder);
    const shippingCost = calc.shipmentsPerBinder * calc.shippingCostPerShipment;

    return printCost + calc.tabsPerBinder + calc.binderHardware + shippingCost + calc.storageCost;
  }
);

/**
 * Labor cost per case (for all binders in the case)
 * = Paralegal rate × (Build hours + Revisions × Revision hours) +
 *   Attorney rate × (Revision hours × Revisions + Locate hours)
 *
 * Note: This is per case, which includes multiple binders
 */
export const selectLaborCostPerCase = createSelector(
  [selectCalculator],
  (calc) => {
    const paralegalCost = calc.paralegalRate * (
      calc.paralegalBuildHours +
      calc.revisionsPerBinder * calc.paralegalRevisionHours
    );

    const attorneyCost = calc.attorneyRate * (
      calc.attorneyRevisionHours * calc.revisionsPerBinder +
      calc.attorneyLocateHours
    );

    return paralegalCost + attorneyCost;
  }
);

/**
 * Baseline cost per binder (physical + labor allocated per binder)
 */
export const selectBaselineCostPerBinder = createSelector(
  [selectPhysicalCostPerBinder, selectLaborCostPerCase, selectCalculator],
  (physicalCost, laborCostPerCase, calc) => {
    // Labor cost is per case, so divide by binders per case to get per-binder labor cost
    const laborPerBinder = laborCostPerCase / calc.bindersPerCase;
    return physicalCost + laborPerBinder;
  }
);

/**
 * Savings from Align per binder
 * Includes: paralegal time saved, attorney time saved, shipping avoided, print costs avoided
 */
export const selectSavingsPerBinder = createSelector(
  [selectCalculator],
  (calc) => {
    // Paralegal time savings
    const paralegalBuildSavings = calc.paralegalRate * calc.paralegalBuildHours * calc.paralegalBuildReduction;
    const paralegalRevisionSavings = calc.paralegalRate * calc.paralegalRevisionHours * calc.revisionsPerBinder * calc.paralegalRevisionReduction;

    // Attorney time savings (per binder allocation from per-case savings)
    const attorneySavings = (calc.attorneyRate * calc.attorneyTimeSaved) / calc.bindersPerCase;

    // Shipping cost savings
    const shippingSavings = calc.shipmentsPerBinder * calc.shippingCostPerShipment * calc.courierReduction;

    // Print cost savings from reduced revisions
    const printSavings = calc.pagesPerBinder * calc.printCostPerPage * calc.revisionsPerBinder * calc.paralegalRevisionReduction;

    return paralegalBuildSavings + paralegalRevisionSavings + attorneySavings + shippingSavings + printSavings;
  }
);

/**
 * Annual baseline cost (without Align)
 */
export const selectAnnualBaselineCost = createSelector(
  [selectBaselineCostPerBinder, selectCalculator],
  (costPerBinder, calc) => {
    return costPerBinder * calc.bindersPerCase * calc.activeCasesPerYear;
  }
);

/**
 * Annual hard cost savings (physical costs only)
 */
export const selectAnnualHardCostSavings = createSelector(
  [selectCalculator],
  (calc) => {
    // Shipping and print costs are hard costs
    const shippingSavingsPerBinder = calc.shipmentsPerBinder * calc.shippingCostPerShipment * calc.courierReduction;
    const printSavingsPerBinder = calc.pagesPerBinder * calc.printCostPerPage * calc.revisionsPerBinder * calc.paralegalRevisionReduction;

    const hardCostSavingsPerBinder = shippingSavingsPerBinder + printSavingsPerBinder;

    return hardCostSavingsPerBinder * calc.bindersPerCase * calc.activeCasesPerYear * calc.adoptionRate;
  }
);

/**
 * Annual nonbillable paralegal hours saved
 * These are cost savings since paralegal time cannot be billed to clients
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
 * Annual total savings (hard costs + monetized labor)
 */
export const selectAnnualTotalSavings = createSelector(
  [selectSavingsPerBinder, selectCalculator],
  (savingsPerBinder, calc) => {
    return savingsPerBinder * calc.bindersPerCase * calc.activeCasesPerYear * calc.adoptionRate;
  }
);

/**
 * Total Align annual cost
 * = Number of users × Cost per user
 */
export const selectAlignAnnualCost = createSelector(
  [selectCalculator],
  (calc) => {
    return calc.numberOfUsers * calc.alignCostPerUser;
  }
);

/**
 * Net annual benefit
 * = Annual savings - Align cost
 */
export const selectNetAnnualBenefit = createSelector(
  [selectAnnualTotalSavings, selectAlignAnnualCost],
  (annualSavings, alignCost) => {
    return annualSavings - alignCost;
  }
);

/**
 * ROI percentage
 * = Net benefit ÷ Align cost × 100
 */
export const selectROI = createSelector(
  [selectNetAnnualBenefit, selectAlignAnnualCost],
  (netBenefit, alignCost) => {
    if (alignCost === 0) return 0;
    return (netBenefit / alignCost) * 100;
  }
);

/**
 * Combined results selector for easy access to all key metrics
 */
export const selectResults = createSelector(
  [
    selectAnnualHardCostSavings,
    selectAnnualParalegalHoursSaved,
    selectAnnualAttorneyBillableHoursRecovered,
    selectAnnualTotalSavings,
    selectNetAnnualBenefit,
    selectROI,
  ],
  (hardCostSavings, paralegalHours, attorneyHours, totalSavings, netBenefit, roi) => ({
    hardCostSavings,
    paralegalHours,
    attorneyHours,
    totalSavings,
    netBenefit,
    roi,
  })
);
