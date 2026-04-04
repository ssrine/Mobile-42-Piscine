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

const WEATHER_ICON_MAP = {
  0: 'weather-sunny',
  1: 'weather-sunny',
  2: 'weather-partly-cloudy',
  3: 'weather-cloudy',
  45: 'weather-fog',
  48: 'weather-fog',
  51: 'weather-rainy',
  53: 'weather-rainy',
  55: 'weather-rainy',
  56: 'weather-rainy',
  57: 'weather-rainy',
  61: 'weather-rainy',
  63: 'weather-rainy',
  65: 'weather-pouring',
  66: 'weather-rainy',
  67: 'weather-pouring',
  71: 'weather-snowy',
  73: 'weather-snowy',
  75: 'weather-snowy-heavy',
  77: 'weather-snowy',
  80: 'weather-rainy',
  81: 'weather-rainy',
  82: 'weather-pouring',
  85: 'weather-snowy-rainy',
  86: 'weather-snowy-rainy',
  95: 'weather-lightning-rainy',
  96: 'weather-lightning-rainy',
  99: 'weather-lightning-rainy',
};

const getRegion = (place) => place?.admin1 || place?.admin2 || place?.admin3 || '';

export const getWeatherDescription = (code) =>
  WEATHER_CODE_MAP[code] || 'Unknown weather';

export const getWeatherIcon = (code) =>
  WEATHER_ICON_MAP[code] || 'weather-cloudy';

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

export const searchCitiesAPI = async (text, count = 5) => {
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
        weatherIcon: getWeatherIcon(data.hourly.weathercode[index]),
      }))
      .filter((hour) => hour.date === currentDate) || [];

  const weekly =
    data.daily?.time?.map((date, index) => ({
      date,
      minTemperature: data.daily.temperature_2m_min[index],
      maxTemperature: data.daily.temperature_2m_max[index],
      weatherCode: data.daily.weathercode[index],
      weatherDescription: getWeatherDescription(data.daily.weathercode[index]),
      weatherIcon: getWeatherIcon(data.daily.weathercode[index]),
    })) || [];

  return {
    current: data.current_weather
      ? {
          temperature: data.current_weather.temperature,
          windSpeed: data.current_weather.windspeed,
          weatherCode: data.current_weather.weathercode,
          weatherDescription: getWeatherDescription(data.current_weather.weathercode),
          weatherIcon: getWeatherIcon(data.current_weather.weathercode),
          time: data.current_weather.time,
        }
      : null,
    today,
    weekly,
  };
};
