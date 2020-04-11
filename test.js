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

const estimateICUandVentilatorsImpact = (infectionsByRequestedTime, periodType) => {
  let casesForICUByRequestedTime = parseInt(infectionsByRequestedTime * 0.05);
  let casesForVentilatorsByRequestedTime = parseInt(infectionsByRequestedTime * 0.02);
  if (periodType === 'weeks') {
    casesForICUByRequestedTime = parseInt(casesForICUByRequestedTime / 7);
    casesForVentilatorsByRequestedTime = parseInt(casesForVentilatorsByRequestedTime / 7);
    // console.log('for weeks', casesForICUByRequestedTime, casesForVentilatorsByRequestedTime);
  }
  if (periodType === 'months') {
    casesForICUByRequestedTime = parseInt(casesForICUByRequestedTime / 30);
    casesForVentilatorsByRequestedTime = parseInt(casesForVentilatorsByRequestedTime / 30);
    // console.log('for months', casesForICUByRequestedTime, casesForVentilatorsByRequestedTime);
  }
  return {
    casesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime
  };
};

const estimateImpact = (data, typeOfImpact) => {
  const {
    reportedCases, totalHospitalBeds, periodType
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
  const {
    casesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime
  } = estimateICUandVentilatorsImpact(infectionsByRequestedTime, periodType);
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

const data1 = {
  region: {
    name: 'Africa',
    avgAge: 19.7,
    avgDailyIncomeInUSD: 5,
    avgDailyIncomePopulation: 0.71
  },
  periodType: 'days',
  timeToElapse: 28,
  reportedCases: 674,
  population: 66622705,
  totalHospitalBeds: 1380614
};
const data2 = {
  region: {
    name: 'Africa',
    avgAge: 19.7,
    avgDailyIncomeInUSD: 5,
    avgDailyIncomePopulation: 0.71
  },
  periodType: 'months',
  timeToElapse: 1,
  reportedCases: 674,
  population: 66622705,
  totalHospitalBeds: 1380614
};
const data3 = {
  region: {
    name: 'Africa',
    avgAge: 19.7,
    avgDailyIncomeInUSD: 5,
    avgDailyIncomePopulation: 0.71
  },
  periodType: 'weeks',
  timeToElapse: 4,
  reportedCases: 674,
  population: 66622705,
  totalHospitalBeds: 1380614
};

// console.log(covid19ImpactEstimator(data1));
console.log(covid19ImpactEstimator(data2));
console.log(covid19ImpactEstimator(data3));
