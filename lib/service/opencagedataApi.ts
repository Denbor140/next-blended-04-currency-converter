import axios from 'axios';

interface getUserInfoProps {
  latitude: number;
  longitude: number;
}

interface OpenCageCurrency {
  iso_code: string;
  name: string;
  symbol: string;
}

interface Result {
  annotations: {
    currency: OpenCageCurrency;
  };
}

interface OpenCageResponse {
  results: Result[];
}

export const getUserInfo = async ({
  latitude,
  longitude,
}: getUserInfoProps): Promise<OpenCageResponse> => {
  const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
  const urlPosition = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}`;

  const { data } = await axios.get<OpenCageResponse>(urlPosition, {
    params: {
      key: apiKey,
      language: 'en',
    },
  });

  return data;
};
