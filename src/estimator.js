/* eslint-disable radix */
const estimateInfectionsAfter = (data) => {
  const { periodType, timeToElapse, reportedCases } = data;
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
  const factor = parseInt(timeInDays / 3);
  return reportedCases * (2 ** factor);
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
  const infectionsByRequestedTime = estimateInfectionsAfter(data);
  const severeCasesByRequestedTime = parseInt(infectionsByRequestedTime * 0.15);
  const availableBeds = parseInt(totalHospitalBeds * 0.35);
  const hospitalBedsByRequestedTime = availableBeds - severeCasesByRequestedTime;
  const casesForICUByRequestedTime = parseInt(infectionsByRequestedTime * 0.05);
  const casesForVentilatorsByRequestedTime = parseInt(infectionsByRequestedTime * 0.02);
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

export default covid19ImpactEstimator;
