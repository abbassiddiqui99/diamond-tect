import { NftHistogramRange } from 'src/constant/commonConstants';
import { NftHistogramType, Uniqueness } from 'src/types/graphs';
import { formatDateTime, getAverage } from 'src/utils/helpers';

export const generateDomainDetails = (data: Uniqueness) => {
  const domains: {
    [k: string]: {
      count: number;
      avgScore: number;
      links: string[];
    };
  } = {};

  //   Count Domains and Sum Score
  data.tinEyeMatches?.forEach(item => {
    if (domains[item.domain]?.count && domains[item.domain]?.avgScore) {
      domains[item.domain].count += 1;
      domains[item.domain].avgScore += item.score;
      domains[item.domain].links.push(...item.backlinks);
      domains[item.domain].links = Array.from(new Set(domains[item.domain].links));
    } else {
      domains[item.domain] = {
        count: 1,
        avgScore: item.score,
        links: [...item.backlinks],
      };
    }
  });

  //   Add Average Score
  Object.keys(domains).forEach(item => {
    domains[item].avgScore = getAverage(domains[item].avgScore, domains[item].count);
  });

  // Add up domains with 1 count
  if (Object.entries(domains).length > 10) {
    let count = 0;
    let avgScore = 0;
    const links: string[] = [];
    Object.keys(domains).forEach(item => {
      if (domains[item].count === 1) {
        count += 1;
        avgScore += domains[item].avgScore;
        links.push(...domains[item].links);
        delete domains[item];
      }
    });
    avgScore = getAverage(avgScore, count);
    domains['Other'] = {
      avgScore,
      count,
      links,
    };
  }

  //   Sort
  return Object.entries(domains).sort((a, b) => b[1].count - a[1].count);
};

export const generateNftScoreRange = (data: Uniqueness) => {
  const scoreRange: NftHistogramType = { ...NftHistogramRange };

  data.nftPortMatches.forEach(item => {
    if (item.score >= 80 && item.score <= 85) {
      scoreRange['80-85'] += 1;
    } else if (item.score >= 85 && item.score <= 90) {
      scoreRange['85-90'] += 1;
    } else if (item.score >= 90 && item.score <= 95) {
      scoreRange['90-95'] += 1;
    } else {
      scoreRange['95-100'] += 1;
    }
  });
  return scoreRange;
};

export const generatetNftTableDetails = (data: Uniqueness) => {
  const details = data?.nftPortMatches?.map(item => ({
    contractAddress: item?.contractAddress ?? '',
    score: item?.score ?? 0,
    chain: item?.chain ?? '',
    tokenId: item?.tokenId ?? '',
    fileUrl: item?.fileUrl ?? '',
    cachedFileUrl: item?.cachedFileUrl ?? '',
    mintDate: item?.mintDate ? formatDateTime(item.mintDate) : '',
  }));
  return details;
};
