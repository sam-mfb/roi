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
 * Annual labor time recovered (in hours)
 */
export const selectAnnualLaborHoursRecovered = createSelector(
  [selectCalculator],
  (calc) => {
    const paralegalHoursPerBinder =
      calc.paralegalBuildHours * calc.paralegalBuildReduction +
      calc.paralegalRevisionHours * calc.revisionsPerBinder * calc.paralegalRevisionReduction;

    const attorneyHoursPerCase = calc.attorneyTimeSaved;
    const attorneyHoursPerBinder = attorneyHoursPerCase / calc.bindersPerCase;

    const totalHoursPerBinder = paralegalHoursPerBinder + attorneyHoursPerBinder;

    return totalHoursPerBinder * calc.bindersPerCase * calc.activeCasesPerYear * calc.adoptionRate;
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
 * Net annual benefit
 * = Annual savings - Align cost
 */
export const selectNetAnnualBenefit = createSelector(
  [selectAnnualTotalSavings, selectCalculator],
  (annualSavings, calc) => {
    return annualSavings - calc.alignAnnualCost;
  }
);

/**
 * ROI percentage
 * = Net benefit ÷ Align cost × 100
 */
export const selectROI = createSelector(
  [selectNetAnnualBenefit, selectCalculator],
  (netBenefit, calc) => {
    if (calc.alignAnnualCost === 0) return 0;
    return (netBenefit / calc.alignAnnualCost) * 100;
  }
);

/**
 * Payback period in months
 * = Align cost ÷ (Annual savings ÷ 12)
 */
export const selectPaybackMonths = createSelector(
  [selectAnnualTotalSavings, selectCalculator],
  (annualSavings, calc) => {
    if (annualSavings === 0) return 0;
    return calc.alignAnnualCost / (annualSavings / 12);
  }
);

/**
 * Combined results selector for easy access to all key metrics
 */
export const selectResults = createSelector(
  [
    selectAnnualHardCostSavings,
    selectAnnualLaborHoursRecovered,
    selectAnnualTotalSavings,
    selectNetAnnualBenefit,
    selectROI,
    selectPaybackMonths,
  ],
  (hardCostSavings, laborHours, totalSavings, netBenefit, roi, paybackMonths) => ({
    hardCostSavings,
    laborHours,
    totalSavings,
    netBenefit,
    roi,
    paybackMonths,
  })
);
