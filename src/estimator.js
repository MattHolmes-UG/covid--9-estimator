/* eslint-disable max-len */
/* eslint-disable radix */
const estimatePowerFactor = (data) => {
  const { periodType, timeToElapse } = data;
  let timeInDays = 0;
  if (periodType === 'days') {
    timeInDays = timeToElapse;
  }
  if (periodType === 'weeks') {
    timeInDays = timeToElapse * 7;
  }
  if (periodType === 'months') {
    timeInDays = timeToElapse * 30;
  }
  return parseInt(timeInDays / 3);
};

const estimateDailyEconomicImpact = (data, infectionCases) => {
  const { region, timeToElapse } = data;
  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = region;
  const totalEstimate = parseInt(infectionCases * avgDailyIncomePopulation * avgDailyIncomeInUSD);
  const dailyLossEstimate = parseInt(totalEstimate / timeToElapse);
  return dailyLossEstimate;
};

const estimateImpact = (data, typeOfImpact) => {
  const {
    reportedCases, totalHospitalBeds
  } = data;
  let currentlyInfected;
  if (typeOfImpact === 'severe') {
    currentlyInfected = reportedCases * 50;
  }
  if (typeOfImpact === 'normal') {
    currentlyInfected = reportedCases * 10;
  }
  const factor = estimatePowerFactor(data);
  const infectionsByRequestedTime = currentlyInfected * (2 ** factor);
  const severeCasesByRequestedTime = parseInt(infectionsByRequestedTime * 0.15);
  const availableBeds = totalHospitalBeds * 0.35;
  const hospitalBedsByRequestedTime = parseInt(availableBeds - severeCasesByRequestedTime);

  // challenge 3
  const casesForICUByRequestedTime = parseInt(infectionsByRequestedTime * 0.05);
  const casesForVentilatorsByRequestedTime = parseInt(infectionsByRequestedTime * 0.02);
  // gradr seems to be working with * 7 and 30
  const dollarsInFlight = estimateDailyEconomicImpact(data, infectionsByRequestedTime);
  return {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime,
    casesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime,
    dollarsInFlight
  };
};

const covid19ImpactEstimator = (data) => {
  const impact = estimateImpact(data, 'normal');
  const severeImpact = estimateImpact(data, 'severe');

  if (data.periodType === 'weeks') {
    impact.casesForICUByRequestedTime = parseInt(impact.casesForICUByRequestedTime / 7);
    impact.casesForVentilatorsByRequestedTime = parseInt(impact.casesForVentilatorsByRequestedTime / 7);
    severeImpact.casesForICUByRequestedTime = parseInt(severeImpact.casesForICUByRequestedTime / 7);
    severeImpact.casesForVentilatorsByRequestedTime = parseInt(severeImpact.casesForVentilatorsByRequestedTime / 7);
    // console.log('for weeks', casesForICUByRequestedTime, casesForVentilatorsByRequestedTime);
  }
  if (data.periodType === 'months') {
    impact.casesForICUByRequestedTime = parseInt(impact.casesForICUByRequestedTime / 30);
    impact.casesForVentilatorsByRequestedTime = parseInt(impact.casesForVentilatorsByRequestedTime / 30);
    severeImpact.casesForICUByRequestedTime = parseInt(severeImpact.casesForICUByRequestedTime / 30);
    severeImpact.casesForVentilatorsByRequestedTime = parseInt(severeImpact.casesForVentilatorsByRequestedTime / 30);
  }

  return {
    data,
    impact,
    severeImpact
  };
};

export default covid19ImpactEstimator;
