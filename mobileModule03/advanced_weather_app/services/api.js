import axios from 'axios';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

const WEATHER_CODE_MAP = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

const getRegion = (place) => place?.admin1 || place?.admin2 || place?.admin3 || '';

export const getWeatherDescription = (code) =>
  WEATHER_CODE_MAP[code] || 'Unknown weather';

export const getWeatherIconName = (code) => {
  if (code === 0) {
    return '☀';
  }

  if ([1, 2].includes(code)) {
    return '⛅';
  }

  if (code === 3) {
    return '☁';
  }

  if ([45, 48].includes(code)) {
    return '🌫';
  }

  if ([51, 53, 55, 80, 81, 82].includes(code)) {
    return '🌦';
  }

  if ([56, 57, 66, 67].includes(code)) {
    return '🌨';
  }

  if ([61, 63, 65].includes(code)) {
    return '🌧';
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return '❄';
  }

  if ([95, 96, 99].includes(code)) {
    return '⛈';
  }

  return '⛅';
};

export const formatPlaceLabel = (place) =>
  [place?.name, getRegion(place), place?.country].filter(Boolean).join(', ') ||
  'Unknown location';

const shapePlace = (place) => ({
  id: String(place?.id || `${place?.latitude}-${place?.longitude}-${place?.name || 'location'}`),
  name: place?.name || 'Unknown location',
  region: getRegion(place),
  country: place?.country || '',
  latitude: place?.latitude,
  longitude: place?.longitude,
  label: formatPlaceLabel(place),
});

export const getCityFromCoordsAPI = async (lat, lon) => {
  const res = await axios.get(`${GEOCODING_BASE_URL}/reverse`, {
    params: {
      latitude: lat,
      longitude: lon,
      language: 'en',
    },
  });

  const firstMatch = res.data.results?.find(
    (item) => item.name || item.admin1 || item.country
  );

  return firstMatch ? shapePlace(firstMatch) : null;
};

export const searchCitiesAPI = async (text, count = 6) => {
  const query = text.trim();

  if (!query) {
    return [];
  }

  const res = await axios.get(`${GEOCODING_BASE_URL}/search`, {
    params: {
      name: query,
      count,
      language: 'en',
    },
  });

  return (res.data.results || []).map(shapePlace);
};

export const fetchWeatherAPI = async (lat, lon) => {
  const res = await axios.get(FORECAST_BASE_URL, {
    params: {
      latitude: lat,
      longitude: lon,
      current_weather: true,
      hourly: 'temperature_2m,windspeed_10m,weathercode',
      daily: 'temperature_2m_min,temperature_2m_max,weathercode',
      timezone: 'auto',
      forecast_days: 7,
    },
  });

  const data = res.data;
  const currentDate =
    data.current_weather?.time?.split('T')[0] ||
    data.hourly?.time?.[0]?.split('T')[0] ||
    '';

  const today =
    data.hourly?.time
      ?.map((time, index) => ({
        time,
        date: time.split('T')[0],
        temperature: data.hourly.temperature_2m[index],
        windSpeed: data.hourly.windspeed_10m[index],
        weatherCode: data.hourly.weathercode[index],
        weatherDescription: getWeatherDescription(data.hourly.weathercode[index]),
      }))
      .filter((hour) => hour.date === currentDate) || [];

  const weekly =
    data.daily?.time?.map((date, index) => ({
      date,
      minTemperature: data.daily.temperature_2m_min[index],
      maxTemperature: data.daily.temperature_2m_max[index],
      weatherCode: data.daily.weathercode[index],
      weatherDescription: getWeatherDescription(data.daily.weathercode[index]),
    })) || [];

  return {
    current: data.current_weather
      ? {
          temperature: data.current_weather.temperature,
          windSpeed: data.current_weather.windspeed,
          weatherCode: data.current_weather.weathercode,
          weatherDescription: getWeatherDescription(data.current_weather.weathercode),
          time: data.current_weather.time,
        }
      : null,
    today,
    weekly,
  };
};
