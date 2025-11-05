import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store/store';

// Base selector
const selectCalculator = (state: RootState) => state.calculator;

/**
 * Savings from Align per binder
 * Three independent efficiency gains:
 * 1. Administrative time reduction (reduces total admin hours for paralegals/assistants)
 * 2. Attorney time saved (hours freed for billable work)
 * 3. Physical binders reduction (reduces all physical costs)
 */
export const selectSavingsPerBinder = createSelector(
  [selectCalculator],
  (calc) => {
    // 1. Administrative time savings (single percentage applied to total admin hours)
    const totalAdminHours = calc.administrativeBuildHours + (calc.administrativeRevisionHours * calc.revisionsPerBinder);
    const adminHoursSaved = totalAdminHours * calc.administrativeTimeReduction;
    const adminSavings = adminHoursSaved * calc.administrativeRate;

    // 2. Attorney time savings (per binder allocation from per-case savings)
    const attorneySavings = (calc.attorneyRate * calc.attorneyTimeSaved) / calc.bindersPerCase;

    // 3. Physical costs avoided by going digital (single percentage applied to all physical costs)
    const initialPrintCost = calc.pagesPerBinder * calc.printCostPerPage * calc.copiesPerBinder;
    const revisionPrintCost = calc.pagesPerBinder * calc.printCostPerPage * calc.revisionsPerBinder * calc.copiesPerBinder;
    const materialsCost = calc.binderMaterials * calc.copiesPerBinder;
    const shippingCost = calc.shipmentsPerBinder * calc.shippingCostPerShipment * calc.copiesPerBinder;
    const storageCost = calc.storageCost * calc.copiesPerBinder;

    const totalPhysicalCosts = initialPrintCost + revisionPrintCost + materialsCost + shippingCost + storageCost;
    const physicalCostSavings = totalPhysicalCosts * calc.physicalBindersReduction;

    return adminSavings + attorneySavings + physicalCostSavings;
  }
);

/**
 * Annual hard cost savings (physical costs only)
 * Physical binders reduction percentage applied to all physical costs
 */
export const selectAnnualHardCostSavings = createSelector(
  [selectCalculator],
  (calc) => {
    // Calculate total physical costs per binder
    const initialPrintCost = calc.pagesPerBinder * calc.printCostPerPage * calc.copiesPerBinder;
    const revisionPrintCost = calc.pagesPerBinder * calc.printCostPerPage * calc.revisionsPerBinder * calc.copiesPerBinder;
    const materialsCost = calc.binderMaterials * calc.copiesPerBinder;
    const shippingCost = calc.shipmentsPerBinder * calc.shippingCostPerShipment * calc.copiesPerBinder;
    const storageCost = calc.storageCost * calc.copiesPerBinder;

    const totalPhysicalCostsPerBinder = initialPrintCost + revisionPrintCost + materialsCost + shippingCost + storageCost;
    const physicalCostSavingsPerBinder = totalPhysicalCostsPerBinder * calc.physicalBindersReduction;

    return physicalCostSavingsPerBinder * calc.bindersPerCase * calc.activeCasesPerYear * calc.adoptionRate;
  }
);

/**
 * Annual nonbillable administrative hours saved
 * Administrative time reduction percentage applied to total admin hours (paralegals, assistants)
 */
export const selectAnnualAdministrativeHoursSaved = createSelector(
  [selectCalculator],
  (calc) => {
    const totalAdminHoursPerBinder = calc.administrativeBuildHours + (calc.administrativeRevisionHours * calc.revisionsPerBinder);
    const adminHoursSavedPerBinder = totalAdminHoursPerBinder * calc.administrativeTimeReduction;

    return adminHoursSavedPerBinder * calc.bindersPerCase * calc.activeCasesPerYear * calc.adoptionRate;
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
 * Dollar value of administrative hours saved
 */
export const selectAdministrativeHoursValue = createSelector(
  [selectAnnualAdministrativeHoursSaved, selectCalculator],
  (adminHours, calc) => {
    return adminHours * calc.administrativeRate;
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
    selectAnnualAdministrativeHoursSaved,
    selectAdministrativeHoursValue,
    selectAnnualAttorneyBillableHoursRecovered,
    selectAttorneyHoursValue,
    selectAnnualTotalSavings,
    selectTotalAnnualBenefit,
  ],
  (hardCostSavings, administrativeHours, administrativeValue, attorneyHours, attorneyValue, totalSavings, totalBenefit) => ({
    hardCostSavings,
    administrativeHours,
    administrativeValue,
    attorneyHours,
    attorneyValue,
    totalSavings,
    totalBenefit,
  })
);
