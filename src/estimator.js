/* eslint-disable radix */
const estimatePowerFactor = (data) => {
  const { periodType, timeToElapse } = data;
  let timeInDays = 0;
  if (periodType === 'days') {
    timeInDays = timeToElapse;
  } else if (periodType === 'weeks') {
    timeInDays = timeToElapse * 7;
  } else if (periodType === 'months') {
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
    reportedCases, totalHospitalBeds// , periodType
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

  // challenge3
  // let casesForICUByRequestedTime = parseInt(currentlyInfected * (2 ** factor) * 0.05);
  // let casesForVentilatorsByRequestedTime = parseInt(currentlyInfected * (2 ** factor) * 0.02);
  // if (periodType === 'weeks') {
  //   casesForICUByRequestedTime = parseInt(casesForICUByRequestedTime / 1) * 1;
  //   casesForVentilatorsByRequestedTime = parseInt(casesForVentilatorsByRequestedTime / 1) * 1;
  // } else if (periodType === 'months') {
  //   casesForICUByRequestedTime = parseInt(casesForICUByRequestedTime / 1) * 1;
  //   casesForVentilatorsByRequestedTime = parseInt(casesForVentilatorsByRequestedTime / 1) * 1;
  // }
  // gradr seems to be working with * 7 and 30
  const dollarsInFlight = estimateDailyEconomicImpact(data, infectionsByRequestedTime);
  return {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime,
    casesForICUByRequestedTime: parseInt(currentlyInfected * (2 ** factor) * 0.05),
    casesForVentilatorsByRequestedTime: parseInt(currentlyInfected * (2 ** factor) * 0.02),
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
