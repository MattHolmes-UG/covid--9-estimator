/* eslint-disable radix */
const estimateInfectionsAfter = (data) => {
  const { periodType, timeToElaspse, reportedCases } = data;
  let timeInDays;
  switch (periodType) {
    case 'days':
      timeInDays = timeToElaspse;
      break;
    case 'weeks':
      timeInDays = timeToElaspse * 7;
      break;
    case 'months':
      timeInDays = timeToElaspse * 30;
      break;

    default:
      timeInDays = timeToElaspse;
      break;
  }
  const power = parseInt(timeInDays / 3);
  const numberOfInfections = reportedCases * (2 ** power);
  return numberOfInfections;
};

const estimateDailyEconomicImpact = (data, infectionCases) => {
  const { region, timeToElaspse } = data;
  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = region;
  const totalEstimate = parseInt(infectionCases * avgDailyIncomePopulation * avgDailyIncomeInUSD);
  const dailyLossEstimate = parseInt(totalEstimate / timeToElaspse);
  return dailyLossEstimate;
};

const estimateImpact = (data, typeOfImpact) => {
  const {
    reportedCases, totalHospitalBeds
  } = data;
  let currentlyInfected;
  if (typeOfImpact === 'severe') {
    currentlyInfected = reportedCases * 10;
  } else if (typeOfImpact === 'normal') {
    currentlyInfected = reportedCases * 50;
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
