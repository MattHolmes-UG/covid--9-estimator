/* eslint-disable radix */
const estimateInfectionsAfter = (data, currentlyInfected) => {
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
  const factor = parseInt(timeInDays / 3);
  return currentlyInfected * (2 ** factor);
};

const estimateDailyEconomicImpact = (data, infectionCases) => {
  const { region, timeToElapse } = data;
  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = region;
  const totalEstimate = parseInt(infectionCases * avgDailyIncomePopulation * avgDailyIncomeInUSD);
  const dailyLossEstimate = parseInt(totalEstimate / timeToElapse);
  return dailyLossEstimate;
};

const estimateICUandVentilatorsImpact = (infectionsByRequestedTime, periodType) => {
  let casesForICUByRequestedTime = 0;
  let casesForVentilatorsByRequestedTime = 0;
  if (periodType === 'days') {
    casesForICUByRequestedTime = parseInt(infectionsByRequestedTime * 0.05);
    casesForVentilatorsByRequestedTime = parseInt(infectionsByRequestedTime * 0.02);
  }
  if (periodType === 'weeks') {
    casesForICUByRequestedTime = parseInt((infectionsByRequestedTime * 0.05) / 7);
    casesForVentilatorsByRequestedTime = parseInt((infectionsByRequestedTime * 0.02) / 7);
  }
  if (periodType === 'months') {
    casesForICUByRequestedTime = parseInt((infectionsByRequestedTime * 0.05) / 30);
    casesForVentilatorsByRequestedTime = parseInt((infectionsByRequestedTime * 0.02) / 30);
  }
  console.log(casesForICUByRequestedTime, casesForVentilatorsByRequestedTime);
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
  const infectionsByRequestedTime = estimateInfectionsAfter(data, currentlyInfected);
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

console.log(covid19ImpactEstimator(data1));
console.log(covid19ImpactEstimator(data2));
console.log(covid19ImpactEstimator(data3));
