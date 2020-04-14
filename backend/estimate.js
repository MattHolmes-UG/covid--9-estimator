/* eslint-disable radix */
const estimateTimeInDays = (data) => {
  const { periodType, timeToElapse } = data;
  let timeInDays = 0;
  if (periodType === 'days') {
    timeInDays = timeToElapse;
  } else if (periodType === 'weeks') {
    timeInDays = timeToElapse * 7;
  } else if (periodType === 'months') {
    timeInDays = timeToElapse * 30;
  }
  return timeInDays;
};

const estimateDailyEconomicImpact = (data, infectionCases) => {
  const { region } = data;
  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = region;
  const totalEstimate = parseInt(infectionCases * avgDailyIncomePopulation * avgDailyIncomeInUSD);
  const timeInDays = estimateTimeInDays(data);
  const dailyLossEstimate = parseInt(totalEstimate / timeInDays);
  return dailyLossEstimate;
};

const estimateImpact = (data, typeOfImpact) => {
  const {
    reportedCases, totalHospitalBeds// , periodType
  } = data;
  let currentlyInfected;
  if (typeOfImpact === 'severe') {
    currentlyInfected = reportedCases * 50;
  }
  if (typeOfImpact === 'normal') {
    currentlyInfected = reportedCases * 10;
  }
  const numberOfDays = estimateTimeInDays(data);
  const factor = parseInt(numberOfDays / 3);
  const infectionsByRequestedTime = currentlyInfected * (2 ** factor);
  const severeCasesByRequestedTime = parseInt(infectionsByRequestedTime * 0.15);
  const availableBeds = totalHospitalBeds * 0.35;
  const hospitalBedsByRequestedTime = parseInt(availableBeds - severeCasesByRequestedTime);
  const casesForICUByRequestedTime = parseInt(currentlyInfected * (2 ** factor) * 0.05);
  const casesForVentilatorsByRequestedTime = parseInt(currentlyInfected * (2 ** factor) * 0.02);
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

  return {
    data,
    impact,
    severeImpact
  };
};

module.exports = covid19ImpactEstimator;
